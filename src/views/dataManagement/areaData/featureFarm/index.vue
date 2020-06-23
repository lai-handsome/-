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
          this.$parent.getDataList({ regionalTypeId: this.$parent.selectDataList[3].id })
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