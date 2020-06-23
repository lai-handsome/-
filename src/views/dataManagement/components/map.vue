
<template>
  <div id="map">
    <el-dialog width="80%"
               top="3vh"
               :visible.sync="$parent.mapDialog"
               :close-on-click-modal="false">
      <div id="mapDiv"
           class="mapDiv"
           ref="mapDiv">
      </div>
      <template v-slot:footer
                class="dialog-footer">
        <el-button @click="$parent.mapDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="sureChoose">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
 
<script>
import Tianditu from '@/utils/mapInit.js'
// import {getCity} from '@/api/remote'
// import BMap from 'BMap'
export default {
  data () {
    return {
      zoom: 12,
      map: '',
      weidu: '',//经度
      jingdu: '',//纬度
      points: '',//行政区划
    }
  },

  mounted () {
    this.getPosition()
  },

  computed: {
    stateWeidu () {
      return this.$store.state.crud.weidu
    },
    stateJingdu () {
      return this.$store.state.crud.jingdu
    }
  },

  destroyed () {
    this.map.removeEventListener('click', this.MapClick)
  },

  watch: {
    '$route': 'getPosition',
  },
  methods: {
    getPosition () { //地图初始化
      Tianditu.init().then((T) => {

        this.map = new T.Map(this.$refs.mapDiv, {
          projection: 'EPSG:4326'
        });
        // console.log(this.map.__proto__.addOverLay, 'map');
        this.map.centerAndZoom(new T.LngLat(103.46436, 30.41032), this.zoom);
        this.map.addEventListener('click', this.MapClick)
        //改为山地样式的地图
        this.map.setMapType(TMAP_HYBRID_MAP)
        //给固定地区添加标识地图范围
        let administrative = new T.AdministrativeDivision();

        let config = {
          needSubInfo: false,
          needAll: false,
          needPolygon: true,
          needPre: true,
          searchType: 1,
          searchWord: "邛崃市"
        };

        administrative.search(config, searchResult);
      }).then(() => {
        if (this.stateWeidu && this.stateJingdu) {
          this.weidu = this.stateWeidu
          this.jingdu = this.stateJingdu
          let oldMarker = new T.Marker(new T.LngLat(this.jingdu, this.weidu));
          this.map.addOverLay(oldMarker)
        }
      })

      function searchResult (result) {
        if (result.getStatus() == 100) {
          var data = result.getData();
          showMsg(data);
          //   document.getElementById("administrativeMsg").innerHTML = html;
        } else {
          result.getMsg();
        }
      }

      let showMsg = (data) => {
        for (var i = 0; i < data.length; i++) {
          //解释上级行政区划
          if (data[i].parents) {
            var upLevel = "";
            if (data[i].parents.country) {
              upLevel += data[i].parents.country.name;
            }
            if (data[i].parents.province) {
              upLevel += data[i].parents.province.name;
            }
          }
          this.points = data[i].points
          if (Array.isArray(data[i].points) && data[i].points.length > 0) {
            //绘制行政区划
            polygon(data[i].points);
          }

          //解释下级行政区划
          if (data[i].child) {
            showMsg(data[i].child);
            if (data[i].child.points) {
              //绘制行政区划
              polygon(data[i].child.points);
            }
          }
        }
      }

      let polygon = (points) => {
        let map = new T.Map(this.$refs.mapDiv, {
          projection: 'EPSG:4326'
        });
        var pointsArr = [];
        for (var i = 0; i < points.length; i++) {
          var regionLngLats = [];
          var regionArr = points[i].region.split(",");
          for (var m = 0; m < regionArr.length; m++) {
            var lnglatArr = regionArr[m].split(" ");
            var lnglat = new T.LngLat(lnglatArr[0], lnglatArr[1]);
            regionLngLats.push(lnglat);
            pointsArr.push(lnglat);
          }
          //创建面对象
          var polygon = new T.Polygon(regionLngLats, {
            color: "red",
            weight: 3,
            opacity: 1,
            fillColor: "#FFFFFF",
            fillOpacity: 0.3
          });
          //向地图上添加行政区划面
          this.map.addOverLay(polygon);
        }
        //显示最佳比例尺
        this.map.setViewport(pointsArr);
      }
      //   .catch(error => {
      //     console.log(error)
      //   })
    },

    MapClick (e) {
      let weidu = e.lnglat.lat
      let jingdu = e.lnglat.lng
      let oldMarker = this.map.getOverlays()
      if (Array.isArray(this.points) && this.points.length > 0) {
        if (oldMarker.length > 1) {
          if (oldMarker[1].hasOwnProperty('Lt')) {  //如果数组索引1是标识地图范围的，就把第0个删掉
            this.map.removeOverLay(oldMarker[0])
          } else {
            this.map.removeOverLay(oldMarker[oldMarker.length - 1])
          }
        }
      } else {
        this.map.clearOverLays()
      }
      let newMarker = new T.Marker(new T.LngLat(jingdu, weidu));
      this.map.addOverLay(newMarker);
      this.weidu = weidu
      this.jingdu = jingdu
    },

    sureChoose () {
      if (this.weidu && this.jingdu) {
        this.$store.commit('crud/GET_LONGITUDE_AND_LATITUDE', { weidu: this.weidu, jingdu: this.jingdu })
        this.$parent.mapDialog = false
      } else {
        this.$message({
          message: '请在地图上打点',
          type: 'error'
        });
      }
    }

  }
}
</script>
 
<style scoped>
#map /deep/ .el-dialog__body {
  padding: 0;
  padding-top: 20px;
}
.mapDiv {
  width: 100%;
  height: 82vh;
}
</style>