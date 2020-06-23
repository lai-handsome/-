<template>
  <div class="table-container"
       ref="wrapper">
    <div class="table-wrapper"
         ref="tableWrapper">
      <table ref="table">
        <thead ref="thead">
          <tr>
            <th v-if="hasCheckbox">
              <el-checkbox v-model="checkAllStatus"
                           @change="checkAll($event)"></el-checkbox>
            </th>
            <th>
              序号
            </th>
            <th v-for="column in columns"
                :key="column.key">{{column.title}}</th>
            <th v-if="operationalData">
              操作
            </th>
          </tr>
          <div class="table-fixed-right-header"></div>
        </thead>
        <tbody ref="tbody">
          <tr v-for="(row,index) in dataList"
              :key="row.id">
            <td v-if="hasCheckbox">
              <el-checkbox :value="isChecked(row.id)"
                           title="check"
                           @change="checkItems(row.id,$event)"></el-checkbox>
            </td>
            <td>
              {{index + 1}}
            </td>
            <td v-for="column in columns"
                :key="column.key">{{row[column.key]}}</td>
            <!-- <td v-if="operationalData">
              <el-button type="success"
                         @click="changeData(row)">编辑</el-button>
              <el-button type="primary"
                         @click="checkItemDetails(row)">查看</el-button>
              <el-button type="danger"
                         @click="openDeleteDialog(row.id)">删除</el-button>
            </td> -->
            <td v-if="operationalData">
              <el-button @click="changeData(row)"
                         v-permission="{name:$route.name,btnName:'compile'}">编辑</el-button>
              <el-button @click="checkItemDetails(row)"
                         v-permission="{name:$route.name,btnName:'checkDetails'}">查看</el-button>
              <el-button @click="openDeleteDialog(row.id)"
                         v-permission="{name:$route.name,btnName:'delete'}">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <el-dialog title="删除提示"
               :visible.sync="deleteDialogVisible"
               :before-close="closeDeleteDialog"
               width="300px">
      <span>确定要删除这条数据吗？</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDeleteDialog">取 消</el-button>
        <el-button type="primary"
                   @click="deleteData">确 定</el-button>
      </span>
    </el-dialog>

    <el-pagination v-if="total > 10"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="$parent.page"
                   :page-sizes="[5,10, 20]"
                   :page-size="pageSize"
                   background
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="total"></el-pagination>
  </div>
</template>

<script>
import deepClone from "@/utils/deepClone";
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    selectedItemsIds: {
      type: Array,
      default: () => []
    },
    hasCheckbox: { //是否有复选框
      type: Boolean,
      default: true
    },
    operationalData: { //是否有操作拦
      type: Boolean,
      default: true
    },
  },

  data () {
    return {
      pageSize: 10,
      page: 1,
      checkAllStatus: false,
      id: '',//存取单条数据的id
      //   deleteDialogVisible: false, //删除弹框
    }
  },
  computed: {
    deleteDialogVisible () {  //删除弹框
      return this.$store.state.crud.deleteDialog
    },
    dataList () {
      return this.$store.state.crud.dataList
    },
    total () {
      return this.$store.state.crud.total
    }
  },

  watch: {
    selectedItemsIds (to, from) {
      if (to.length === this.dataList.length && to.length !== 0) {
        this.checkAllStatus = true
      } else {
        this.checkAllStatus = false
      }
    },

    $route (to, from) {
      if (to && this.hasCheckbox) {
        this.$parent.selectedItemsIds.length = 0
        this.checkAllStatus = false
      }
      this.page = 1
      this.pageSize = 10
    },

    dataList (to, from) {  //当dataList改变，就清空选中项
      if (to) { //当dataList发生改变，更新选中存放id的数组this.selectedItemsIds
        let arr = []
        for (let item of this.dataList) {
          if (this.selectedItemsIds.includes(item.id)) {
            //selectedItemsIds数组里是否有dataList里的id，有的话就放入arr，没有的话不放
            arr.push(item.id)
          }
        }
        this.$emit("update:selectedItemsIds", arr);//更新selectedItemsIds
      }
    }
  },

  //   mounted () {

  //     if (this.dataList && this.dataList.length >= 10) {
  //       let table = this.$refs.table
  //       //   let thead = this.$refs.thead
  //       let thead = table.children[0]
  //       let wrapper = this.$refs.wrapper
  //       let tableWrapper = this.$refs.tableWrapper;
  //       let copyTable = table.cloneNode()
  //       //   tableWrapper.style.paddingTop = thead.getBoundingClientRect().height + 'px'
  //       tableWrapper.style.paddingTop = 40 + 'px'
  //       console.log(thead.getBoundingClientRect().height, 'thead.getBoundingClientRect()');
  //       copyTable.appendChild(thead)
  //       copyTable.classList.add('fix-header')

  //       let tds = Array.from(table.querySelector('tbody tr').children)
  //       let ths = Array.from(copyTable.querySelector('thead tr').children)

  //       for (const [index, value] of tds.entries()) {
  //         ths[index].style.width = value.getBoundingClientRect().width + 'px'
  //       }
  //       wrapper.appendChild(copyTable)
  //     }
  //   },

  //   destroyed () {
  //     let form = this.$parent.form
  //     for (const key in form) {
  //       form[key] = ''
  //     }
  //   },

  methods: {
    closeDeleteDialog () {// 关闭删除弹框
      this.$store.commit('crud/ONOFF_DELETE_DATA', false)
    },

    isChecked (id) {
      //   console.log(this.selectedItemsIds);
      return this.selectedItemsIds.some(item => item === id);
    },

    checkAll (e) {  //全选功能
      this.checkAllStatus = e
      if (e) {
        let checkAllArr = [];
        let i = 0;
        let length = this.dataList.length;
        for (i; i < length; i++) {
          checkAllArr.push(this.dataList[i].id);
        }
        this.$emit("update:selectedItemsIds", checkAllArr);
      } else {
        this.$emit("update:selectedItemsIds", []);
      }
    },

    checkItems (id, e) {  //单选
      let copyselectedItemsIds = deepClone(this.selectedItemsIds);
      if (e) {
        copyselectedItemsIds.push(id);
      } else {
        let index = copyselectedItemsIds.findIndex(item => item === id);
        copyselectedItemsIds.splice(index, 1);
      }
      this.$emit("update:selectedItemsIds", copyselectedItemsIds);
    },

    changeData (row) {  //编辑
      this.$parent.isCompile = true
      if (row.year) {
        row.year = `${row.year}`
      }
      this.$parent.form = { ...row }
      this.$parent.form.type = 0
      this.$store.commit('crud/ONOFF_ADDDATA_DIALOG', true)
    },

    checkItemDetails (row) { //查看
      if (row.year) {
        row.year = `${row.year}`
      }
      this.$parent.checkItemDetails(row)
    },

    openDeleteDialog (id) {// 打开删除弹框
      this.id = id
      this.$store.commit('crud/ONOFF_DELETE_DATA', true)
    },

    deleteData () { //调用父组件的删除方法
      this.$parent.deleteData(this.id)
    },

    handleCurrentChange (val) {
      this.$parent.selectedItemsIds = []
      this.page = val
      this.$parent.page = val
      this.$parent.pageNum = val
      this.$parent.getDataList()
    },
    handleSizeChange (val) {
      this.$parent.selectedItemsIds = []
      this.pageSize = val
      this.$parent.pageSize = val
      this.$parent.getDataList()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/table.scss";
</style>