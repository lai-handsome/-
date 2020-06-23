<template>
  <div class="plant">
    <div class="content">
      <div class="content-header">
        <img src="@/assets/management/矢量智能对象.png"
             alt="">
        <span>数据管理&nbsp;&nbsp;>&nbsp;&nbsp;农业统计&nbsp;&nbsp;>&nbsp;&nbsp;{{ treeData[treeDataIndex].name }}</span>
      </div>
      <div class="content-main">
        <div class="top">
          <div class="top-left">
            <div>
              <img src="@/assets/management/icon-删除2.png"
                   alt="">
              <span>删除</span>
            </div>
            <div>
              <img src="@/assets/management/icon-导入.png"
                   alt="">
              <span>导入</span>
            </div>
            <div>
              <img src="@/assets/management/icon-导出2.png"
                   alt="">
              <span>导出</span>
            </div>
          </div>
          <div class="top-right">

            <div>
              <span>年份：</span>

              <el-input v-model="year"></el-input>
            </div>

            <div>
              <!-- 一级 -->
              <span>乡镇：</span>
              <el-select v-model="countryValue1"
                         placeholder="请选择"
                         @visible-change="getCountrySelectDataList($event,1)">
                <el-option v-for="item in countryOption1"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
              <!-- 二级 -->
              <el-select v-model="countryValue2"
                         placeholder="请选择"
                         @visible-change="getCountrySelectDataList($event,2)">
                <el-option v-for="item in countryOption2"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>

            </div>
            <div class="refer-btn btn"
                 @click="queryData">
              <!-- <img src="@/assets/management/icon-查询.png"
                   alt=""> -->
              <span>查询</span>
            </div>
            <div class="add-btn btn"
                 @click="addData">
              <!-- <img src="@/assets/management/icon-导出.png"
                   alt=""> -->
              <span>新增</span>
            </div>

          </div>
        </div>

        <table>
          <tr>
            <th>
              <el-checkbox v-model="checkAll"></el-checkbox>
            </th>
            <th>
              序号
            </th>
            <th>
              产业类型
            </th>
            <th>
              年度
            </th>
            <th>
              乡镇
            </th>
            <th>
              面积（亩）
            </th>
            <th>
              亩产（万吨）
            </th>
            <th>
              产量（万吨）
            </th>
            <th>
              操作
            </th>
          </tr>
          <tr v-for="(item,index) in dataList"
              :key="item.id">
            <td>
              <el-checkbox-group v-model="id"
                                 @change="(value) => handleCheckedCitiesChange(value,item.id)">
                <el-checkbox :key="item.id"></el-checkbox>
              </el-checkbox-group>
            </td>
            <td>
              {{index + 1}}
            </td>
            <td>
              {{item.industryTypeThirdName}}
            </td>
            <td>
              {{item.year}}
            </td>
            <td>
              {{item.countryName}}
            </td>
            <td>
              {{item.size}}
            </td>
            <td>
              {{item.yield}}
            </td>
            <td>
              {{item.outputValue}}
            </td>
            <td>
              <span class="left pointer"
                    @click="checkItemDetails(item)">
                <img src="@/assets/management/icon-查看.png"
                     alt="">
                <span>查看详情</span>
              </span>
              <span class="right pointer"
                    @click="changeData(item)">
                <img src="@/assets/management/icon-编辑.png"
                     alt="">
                <span>编辑</span>
              </span>
              <span class="right pointer"
                    @click="openDeleteDialog(item.id)">
                <span>删除</span>
              </span>
            </td>
          </tr>
        </table>

      </div>
      <el-pagination v-if="total > pageSize"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="page"
                     :page-sizes="[5,10, 20]"
                     :page-size="pageSize"
                     background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"></el-pagination>
    </div>

    <div>
      <el-dialog title="用户信息"
                 v-if="userDialogVisible"
                 :visible.sync="userDialogVisible"
                 width="20%">
        <p>
          创建时间：{{item.createDate}}
        </p>

        <p>
          乡镇：{{item.countryName}}
        </p>
        <p>
          乡镇id：{{item.countryside}}
        </p>
        <p>
          村：{{item.cunName}}
        </p>
        <p>
          村id：{{item.cunId}}
        </p>
        <p>
          面积：{{item.size}}(亩)
        </p>
        <p>
          产量：{{item.yield}}(万吨)
        </p>
        <p>
          产量{{item.outputValue}}(万元)
        </p>
        <p>
          更新时间：{{item.updateDate}}
        </p>
        <p>
          id：{{item.id}}
        </p>

        <span slot="footer"
              class="dialog-footer">
          <el-button @click="userDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="userDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog title="删除提示"
               :visible.sync="deleteDialogVisible"
               width="300px">
      <span>确定要删除吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="suredeleteData">确 定</el-button>
      </span>
    </el-dialog>

    <FarmingStatisticsDialog1 v-if="dialogFormVisible1"
                              :typeId="1"></FarmingStatisticsDialog1>
  </div>
</template>

<script>
import Plant from './components/plant'
import request from '@/request/request'
import FarmingStatisticsDialog1 from '../farmingStatisticsDialog1'
export default {
  components: {
    Plant,
  },
  data () {
    return {
      dialogFormVisible1: false,
      deleteDialogVisible: false, //删除按钮弹框
      isCompile: false, //是否是编辑开关
      userDialogVisible: false, //查看用户信息弹框
      item: null,//存取单个用户信息
      id: '',//存取单个用户id
      idArr: [],//存取选取的id数组
      countryOption1: null,
      countryValue1: '',  //获取一级乡村id
      countryOption2: null,
      countryValue2: '',  //获取一级乡村id

      treeData: [
        {
          name: '种植业生产情况',
          isSelected: true
        },
        {
          name: '畜牧业生产情况',
          isSelected: false
        },
      ],

      page: 1,
      pageSize: 10,
      total: 0,
      treeDataIndex: 0,
      dataList: null,

      checkAll: false, //全选按钮

      countryside: 230000000000,// 一级乡镇id
      year: '', //年度

    }
  },
  watch: {
    treeDataIndex (to, from) {
      this.treeData[to].isSelected = true
      this.treeData[from].isSelected = false
      this.getDataList()
    }
  },

  mounted () {
    this.getDataList();
  },
  methods: {
    changeData (item) {
      this.isCompile = true
      this.item = item
      if (this.treeDataIndex == 0) {
        this.dialogFormVisible1 = true
      } else {
        this.dialogFormVisible2 = true
      }
    },

    addData () { //添加数据
      if (this.treeDataIndex == 0) {
        this.dialogFormVisible1 = true
      } else {
        this.dialogFormVisible2 = true
      }

    },

    openDeleteDialog (id) {
      this.id = id
      this.deleteDialogVisible = true
    },

    suredeleteData () {
      let data = {
        ids: this.id //传个用户id可以删除，也可以批量处理，传个数组，里面是要传的id
      }

      request({
        url: '/plantManage/delePlant',
        method: 'post',
        data
      }).then(res => {
        if (res.code = '10000') {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.deleteDialogVisible = false
        }
      }).then(() => this.getDataList())
    },

    queryData () { //查询数据
      this.getDataList(this.year, this.countryValue1, this.countryValue2)
    },

    getCountrySelectDataList (event, val) {

      if (event) {

        if (val == 1) {
          let data = {
            id: this.countryside
          }
          request({
            url: '/countryData/getcountry',
            method: 'get',
            params: data
          }).then(res => {
            if (res.code == '10000') {
              this.countryOption1 = res.data
            }
          })
        } else if (val == 2 && this.countryValue1 != '') {
          let data = {
            id: this.countryValue1
          }
          request({
            url: '/countryData/getcountry',
            method: 'get',
            params: data
          }).then(res => {
            if (res.code == '10000') {
              this.countryOption2 = res.data
            }
          })
        }

      }
    },

    getDataList (year = '', countryside = '', cunId = '') { //获取、查询信息列表
      let data = {
        pageNo: this.page,

        pageSize: this.pageSize,

        countryside: countryside,

        year: year,

        cunId: cunId,
      }
      request({
        url: '/plantManage/getList',
        method: 'post',
        data
      }).then(res => {

        if (res.code == '10000') {
          this.dataList = res.data
          this.total = res.total
        }

      })

    },

    checkItemDetails (item) { //查看用户信息
      this.item = item
      this.userDialogVisible = true
    },

    handleSizeChange (val) {
      this.pageSize = val
      this.getDataList()
    },
    handleCurrentChange (val) {
      this.page = val
      this.getDataList()
    },

    selectDiffData (e) {
      if (e.target.nodeName === 'LI' && e.target.dataset.index !== this.treeDataIndex) {
        this.treeDataIndex = e.target.dataset.index
      }
    },

    handleCheckAllChange () { },

    handleCheckedCitiesChange (value, id) {
      console.log(value, id);
    }
  },
}
</script>

<style lang="scss" scoped>
.plant {
  background: #f4f7fe;
  width: 100%;
  height: 100%;
  position: relative;

  .el-pagination {
    margin-bottom: 60px;
    float: right;
  }
  .el-select {
    width: 140px;
  }

  .aside {
    position: absolute;
    left: 0;
    top: 0;
    width: 250px;
    height: 100%;
    background: #fff;
    .pull-down-header {
      height: 60px;
      line-height: 60px;
      font-size: 20px;
      color: #2780ff;
      padding: 0 18px 0 22px;
    }
    img {
      vertical-align: middle;
    }
    .macro-data-icon {
      width: 20px;
      height: 22px;
    }
    .pull-down-icon {
      height: 8px;
      width: 14px;
      float: right;
      margin-top: 24px;
    }

    .pull-down-content {
      cursor: pointer;
      padding: 0 10px;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        padding-left: 10px;
      }
    }
    .is-selected {
      background: #f4f7fe;
      border-radius: 4px;
      color: #5494ff;
    }
  }

  .content {
    .el-input {
      width: 120px;
    }

    padding: 20px 20px 0 20px;
    margin-left: 260px;
    &-header {
      height: 40px;
      line-height: 40px;
      background: #fff;
      border-radius: 4px;
      padding-left: 18px;
      font-size: 16px;
      color: #2780ff;
      span {
        padding: 0 8px;
        font-weight: bold;
        text-align: center;
      }
      img {
        float: left;
        width: 20px;
        height: 14px;
        margin-top: 12px;
      }
    }
  }
  .content-main {
    background: #fff;
    margin-top: 20px;
    border-radius: 4px;
    padding: 0 20px 80px;
    .top {
      padding: 34px 0 24px 0;
      font-size: 18px;
      overflow: hidden;
    }
    .top-left {
      overflow: hidden;
      float: left;
      div {
        float: left;
        width: 100px;
        height: 40px;
        border: 1px solid #2780ff;
        border-radius: 6px;
        color: #2780ff;
        margin: 0 auto;
        padding: 8px 0 0 16px;
        box-sizing: border-box;
        margin-right: 20px;
      }
      img {
        height: 20px;
        width: 22px;
      }
    }
    .top-right {
      > div {
        float: left;
        line-height: 40px;
      }
      .pull-down {
        margin-right: 20px;
      }
      .btn {
        color: #fff;
        text-align: center;
        line-height: 40px;
        width: 80px;
        height: 40px;
        border-radius: 4px;
        margin-left: 40px;
        cursor: pointer;
      }
      .refer-btn {
        background: #0174ff;
      }
      .add-btn {
        background: #ff7a38;
      }
    }
  }
}
</style>