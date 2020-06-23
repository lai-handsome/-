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
            主体名称
          </th>
          <th>
            所属乡镇
          </th>
          <th>
            所属村庄
          </th>
          <th>
            联系人
          </th>
          <th>
            产业类型
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
            {{item.countryName}}
          </td>
          <td>
            {{item.cunName}}
          </td>
          <td>
            {{item.contact}}
          </td>
          <td>
            {{item.shengchanleixing}}
          </td>
          <td>
            <span class="left pointer"
                  @click="checkItemDetails(item)">
              <img src="@/assets/management/icon-查看.png"
                   alt="">
              <span>查看</span>
            </span>
            <span class="pointer"
                  @click="openDeleteDialog(item.id)">
              删除
            </span>
            <span class="right pointer"
                  @click="$parent.changeData(item,'farmingSubjectDialog1')">
              <img src="@/assets/management/icon-编辑.png"
                   alt="">
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
        创建时间：{{item.createDate}}
      </p>
      <p>
        乡镇：{{item.countryName}}
      </p>
      <p>
        乡镇id：{{item.countryId}}
      </p>
      <p>
        村：{{item.cunName}}
      </p>
      <p>
        村id：{{item.cunId}}
      </p>

      <p>
        经度：{{item.jingdu}}
      </p>
      <p>
        纬度：{{item.weidu}}
      </p>
      <p>
        更新时间：{{item.updateDate}}
      </p>
      <p>
        年度:{{item.year}}
      </p>
      <p>
        三级产业分类id:{{item.industryTypeThirId}}
      </p>
      <p>
        三级产业分类名称:{{item.industryTypeThirName}}
      </p>
      <p>
        联系人:{{item.contact}}
      </p>
      <p>
        联系电话:{{item.tele}}
      </p>
      <p>
        信用代码（营业执照）或身份证:{{item.xinyongdaima}}
      </p>
      <p>
        主体类别id:{{item.agriculturalSubjectTypeId}}
      </p>
      <p>
        主体类别名称:{{item.agriculturalSubjectTypeName}}
      </p>
      <p>
        生产类型:{{item.shengchanleixing}}
      </p>
      <p>
        产品认证id:{{item.chanpinrenzhengId}}
      </p>
      <p>
        产品认证名称:{{item.chanpinrenzhengName}}
      </p>
      <p>
        农民邮箱:{{item.xinxiang}}
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
        url: '/agriculturalSubjectData/deleData',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            message: res.msg,
            type: 'success'
          });
          this.dialogVisible = false

          let index = this.$parent.treeDataIndex
          let id = this.$parent.subjectSelectDataList[index].id
          this.$parent.getDataList({ agriculturalSubjectTypeId: id })
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
    width: 14%;
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
    width: 14%;
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