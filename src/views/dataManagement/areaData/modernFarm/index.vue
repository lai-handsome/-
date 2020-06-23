<template>
  <div>
    <div style="height: 500px; overflow-y: auto;">
      <table>
        <tr>
          <th>
            <div class="check"></div>
          </th>
          <th>
            序号
          </th>
          <th>
            认定名称
          </th>
          <th>
            区域类型
          </th>
          <th>
            所在乡镇
          </th>
          <th>
            建设地点
          </th>
          <th>
            认定级别
          </th>
          <th>
            建设状态
          </th>
          <th>
            操作
          </th>
        </tr>
        <tr v-for="(item,index) in $parent.dataList"
            :key="item.id">
          <td>
            <div class="check"></div>
          </td>
          <td>
            {{index + 1}}
          </td>
          <td>
            {{item.name}}
          </td>
          <td>
            {{item.regionalTypeName}}
          </td>
          <td>
            {{item.countryName}}
          </td>
          <td>
            {{item.jianshedidianName}}
          </td>
          <td>
            {{item.jibie == 1? '省级' : item.jibie == 2 ? '市级' : '县级'}}
          </td>
          <td>
            {{item.status}}
          </td>
          <td>

            <span class="left pointer"
                  @click="checkItemDetails(item)">
              <!-- <img src="@/assets/management/icon-查看.png"
                   alt=""> -->
              <span>查看</span>
            </span>
            <span class="pointer"
                  @click="openDeleteDialog(item.id)">
              删除
            </span>
            <span class="right pointer"
                  @click="$parent.changeData(item,'dialogFormVisible1')">
              <!-- <img src="@/assets/management/icon-编辑.png"
                   alt=""> -->
              <span>编辑</span>
            </span>

          </td>
        </tr>
      </table>
    </div>
    <el-dialog title="删除提示"
               :visible.sync="dialogVisible"
               width="300px">
      <span>确定要删除吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="deleteData">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="用户信息"
               v-if="userDialogVisible"
               :visible.sync="userDialogVisible"
               width="20%">
      <p>
        创建时间：{{item.createtime}}
      </p>
      <p>
        申请时间：{{item.applytime}}
      </p>
      <p>
        申报时间:{{item.applytime}}
      </p>
      <p>
        乡镇：{{item.town}}
      </p>
      <p>
        乡镇id：{{item.townid}}
      </p>
      <p>
        村：{{item.countryname}}
      </p>
      <p>
        村id：{{item.countryid}}
      </p>

      <p>
        经度：{{item.longitude}}
      </p>
      <p>
        纬度：{{item.latitude}}
      </p>
      <p>
        更新时间：{{item.updateTime}}
      </p>
      <p>
        申报时间:{{item.applytime}}
      </p>
      <p>
        年度:{{item.year}}
      </p>
      <p>
        村落类型:{{item.countrytype == 1 ? '分类处理村' : '项目试点村'}}
      </p>
      <p>
        总投资:{{item.totalinvestment}}
      </p>
      <p>
        项目类型:{{item.projecttype == 1 ? '修缮' : item.projecttype ==2 ? '开发利用' : '其它'}}
      </p>
      <p>
        项目负责人:{{item.projectperson}}
      </p>
      <p>
        项目负责人联系电话:{{item.projectphone}}
      </p>
      <p>
        项目主管部门:{{item.projectchiefdept}}
      </p>
      <p>
        主管部门联系人:{{item.projectdeptperson}}
      </p>
      <p>
        主管部门联系电话:{{item.projectdeptphone}}
      </p>
      <p>
        施工公司:{{item.constructcompany}}
      </p>
      <p>
        施工单位联系电话:{{item.constructphone}}
      </p>
      <p>
        省级财政:{{item.provincemoney}}
      </p>
      <p>
        市级财政:{{item.citymoney}}
      </p>
      <p>
        县级财政:{{item.countymoney}}
      </p>
      <p>
        村级财政:{{item.villagemoney}}
      </p>
      <p>
        银行财政:{{item.bankmoney}}
      </p>
      <p>
        其他收入:{{item.othermoney}}
      </p>
      <p>
        顶瓦修补幢数:{{item.dwxb}}
      </p>
      <p>
        墙体加固幢数:{{item.qtjg}}
      </p>
      <p>
        立体改造幢数:{{item.ltgz}}
      </p>
      <p>
        构造修复幢数:{{item.gzxf}}
      </p>
      <p>
        异地迁入幢数:{{item.ydqr}}
      </p>
      <p>
        立面改造幢数:{{item.lmgz}}
      </p>
      <p>
        结构降层幢数:{{item.jgjc}}
      </p>
      <p>
        整体拆除面积:{{item.ztcc}}
      </p>
      <p>
        异地搬迁入户:{{item.ydbq}}
      </p>
      <p>
        用地面积:{{item.ydmj}}
      </p>
      <p>
        安置户数:{{item.azhs}}
      </p>
      <p>
        基本公建设施资额:{{item.jbgj}}
      </p>
      <p>
        面积:{{item.area}}
      </p>
      <p>
        里程:{{item.licheng}}
      </p>
      <p>
        id：{{item.id}}
      </p>

      <p>
        扩展字段1：{{item.cel1}}
      </p>

      <p>
        扩展字段2：{{item.cel2}}
      </p>
      <p>
        扩展字段3：{{item.cel3}}
      </p>
      <p>
        扩展字段4：{{item.cel4}}
      </p>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="userDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/request/request'
export default {
  data () {
    return {
      dialogVisible: false,// 删除弹框
      userDialogVisible: false, //查看用户信息弹框
      item: null, //单条用户信息
      id: '', //单条数据的id
    }
  },

  methods: {
    openDeleteDialog (id) {
      this.id = id
      this.dialogVisible = true
    },

    deleteData () {

      let data = {
        ids: this.id
      }

      request({
        url: '/regionalData/deleteRegionalData',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.dialogVisible = false
          this.$parent.getDataList({ regionalTypeId: this.$parent.selectDataList[1].id })
        }
      })

    },

    checkItemDetails (item) { //查看用户信息
      this.item = item
      this.userDialogVisible = true
    },
  },
}
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  font-size: 16px;
  tr {
    height: 54px;
    line-height: 54px;
    border-bottom: 1px solid #ededed;
    width: 100%;
    border-bottom: 1px solid #ededed;
  }
  td {
    text-align: center;
    width: 12%;
    .left {
      padding-right: 40px;
    }
    .right {
      padding-left: 40px;
    }
  }
  td:last-child {
    width: 20%;
  }
  td:first-child {
    width: 5%;
  }
  td:nth-child(2) {
    width: 5%;
  }
  th {
    text-align: center;
    width: 12%;
  }
  th:last-child {
    width: 20%;
  }
  th:first-child {
    width: 5%;
  }
  th:nth-child(2) {
    width: 5%;
  }
}
tr:first-child {
  border: 1px solid #ededed;
  background: #f5f5f5;
  height: 40px;
  line-height: 40px;
}
.check {
  display: inline-block;
  border: 1px solid #999;
  width: 16px;
  height: 18px;
  margin-right: 10px;
  vertical-align: middle;
  background: #fff;
}
</style>