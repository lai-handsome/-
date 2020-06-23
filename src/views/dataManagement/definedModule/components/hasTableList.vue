<template>
  <div class="content-main">
    <div class="table-list"
         v-if="(dataList && dataList.length>0) || isQuery">
      <div class="header">
        <div class="header-left"
             v-permission="{name:$route.name,btnName:'query'}">
          <span>表格名称：</span>
          <el-input v-model="tableName"
                    @keyup.enter.native="queryDataList"
                    placeholder="请输入表格名称"></el-input>
        </div>

        <div class="header-right"
             v-permission="{name:$route.name,btnName:'addTable'}">
          <el-button type="warning"
                     @click="openTableDialog(false)">新增表格</el-button>
        </div>

        <div class="header-right"
             v-permission="{name:$route.name,btnName:'query'}">
          <el-button type="primary"
                     @click="queryDataList">查询</el-button>
        </div>
      </div>

      <ul class="list">
        <li class="item"
            v-for="item in dataList"
            :key="item.id"
            @click="toTableItemDetails(item)">
          <span>{{item.description}}</span>
          <div class="item-right">
            <el-button plain
                       v-permission="{name:$route.name,btnName:'changeTableIndex'}"
                       @click.stop="openTableDialog(true,item)">编辑表格指标</el-button>
            <el-button plain
                       v-permission="{name:$route.name,btnName:'deleteTable'}"
                       @click.stop="openDeleteDialog(item)">删除</el-button>
          </div>
        </li>
      </ul>
    </div>

    <div class="has-table"
         v-else-if="Array.isArray(dataList) && dataList.length === 0 && !isQuery">
      <img src="../../../../assets/dataManagement/bg-hastable.png"
           alt="">
      <p>
        暂无表格模板，<span @click="openTableDialog(false)">点击添加</span>
      </p>
    </div>

    <el-dialog title="表头指标设置"
               :close-on-click-modal="false"
               :visible.sync="tableDialog"
               :before-close="closeTableDialog">
      <p class="dialog-title"><i class="el-icon-s-data"></i> 编辑表格名称</p>
      <div class="bottom20">
        <el-input v-model="dialogForm.description"
                  autofocus
                  placeholder="请输入表格名称"></el-input>
      </div>
      <p class="dialog-title"><i class="el-icon-s-data"></i> 编辑表格指标</p>
      <div class="bottom20">
        <span>地区：</span>
        <el-checkbox-group v-model="checkedArea">
          <!-- <el-checkbox label="乡/镇/街道"></el-checkbox>
          <el-checkbox label="村"
                       :disabled="areaCheckGroup[0] === '乡/镇/街道' ? false :true"></el-checkbox> -->
          <el-checkbox :label="item.chineseName"
                       @change="onOffChecked({index:index,chineseName:item.chineseName,type:'checkedArea',checkGroup:'areaCheckGroup',typeLength:'areaCheckLength'})"
                       v-for="(item,index) in areaCheckGroup"
                       :key="item.chineseName">
            {{item.chineseName}}
          </el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="bottom20">
        <span>时间：</span>
        <el-checkbox-group v-model="checkedDate">
          <el-checkbox :label="item.chineseName"
                       @change="onOffChecked({index:index,chineseName:item.chineseName,type:'checkedDate',checkGroup:'dateCheckGroup',typeLength:'dateCheckLength'})"
                       v-for="(item,index) in dateCheckGroup"
                       :key="item.chineseName">
            {{item.chineseName}}
          </el-checkbox>
          <!-- <el-checkbox label="月"
                       :disabled="dateCheckGroup[0] === '年'?false:true"></el-checkbox>
          <el-checkbox label="日"
                       :disabled="dateCheckGroup[1] === '月'?false:true"></el-checkbox> -->
        </el-checkbox-group>
      </div>

      <div class="bottom20">
        <span>添加其它指标：</span>
        <el-input placeholder="请输入指标名称"
                  ref="tagInput"
                  clearable
                  @keyup.enter.native="addTag"
                  v-model="lineName"></el-input>
        <span>——</span>
        <el-input placeholder="请输入单位名称"
                  v-model="unitName"
                  clearable
                  @keyup.enter.native="addTag"></el-input>
        <el-button size="small"
                   plain
                   @click="addTag">确定</el-button>
      </div>

      <div class="bottom20">
        <p class="hint-title"
           v-if="tags&&tags.length>0">已设置指标</p>
        <div class="tag-group">
          <span v-for="(tag,index) in tags"
                :key="index">
            <el-tag v-if="tag.deleteFlag === 0"
                    closable
                    @close="deleteTag({index:index,tag:tag})">
              {{tag.chineseName}}
            </el-tag>
          </span>
        </div>
      </div>

      <p class="dialog-title"><i class="el-icon-s-data"></i> 编辑经纬度</p>

      <div class="switch-dec">
        <span style="vertical-align: middle;">是否含有经纬度信息：</span>
        <el-switch v-model="isMap"
                   :active-value="0"
                   :inactive-value="1"
                   :width='58'
                   @change="switchMap"
                   active-text="含有"
                   inactive-text="不含">
        </el-switch>
        <p class="switch-warning">（按钮开启会在“一张图”地图上展示）</p>
      </div>

      <span slot="footer"
            class="dialog-footer">
        <el-popconfirm confirmButtonText='好的'
                       cancelButtonText='不用了'
                       confirmButtonType="danger"
                       @onConfirm="emptyTableData({type: 0, moduleTypeId: dataItemId})"
                       icon="el-icon-info"
                       iconColor="red"
                       title="确定要清空表格的所有字段吗？">
          <el-button slot="reference">清 空</el-button>
        </el-popconfirm>
        <el-button type="info"
                   @click="previewTable">预 览</el-button>
        <el-button type="primary"
                   @click="addTableItem">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 预览表头 -->
    <el-dialog :title="dialogForm.description"
               :visible.sync="tableHeaderDialog"
               :center="true"
               width="80%">
      <p class="table-header"
         v-html="tableHeaderHtml"></p>
    </el-dialog>
    <!-- 提示弹框 -->
    <hint-dialog v-if="hintDialog"
                 :hintDialog="hintDialog"
                 :dialogTitle="dialogTitle"
                 :description="description"
                 :buttonType="buttonType"
                 :cbFnName="cbFnName"
                 :cbFnArguments="cbFnArguments"
                 :cancelFn="cancelFn"
                 :cancelFnArguments="cancelFnArguments"></hint-dialog>
  </div>
</template>

<script>
const strItem = (id, moduleTypeId, chineseName, typeDiy, isNull, deleteFlag) => {
  return {
    id: id,   // 字段id
    moduleTypeId: moduleTypeId,//表格id
    chineseName: chineseName,//中文名
    typeDiy: typeDiy,//1镇，2县，3村，4年，5月，6日，7经度，8纬度，9其他
    isNull: isNull, //经度，纬度，时间，地区为0，其它为1
    deleteFlag: deleteFlag //  删除为1 其他为0
  }
}

import request from '@/request/request'
import hintDialog from '@/views/components/hintDialog'
export default {
  components: {
    hintDialog,
  },
  data () {
    return {
      hintDialog: false,
      dialogTitle: '', //提示 框标题
      description: '', //提示框描述
      buttonType: '', //提示框按钮类型
      cbFnName: '', //提示框确定按钮函数名
      cbFnArguments: {}, //提示框调用函数参数
      cancelFn: '', //取消按钮调用的回调函数
      cancelFnArguments: {},//取消按钮调用的回调函数的参数

      tableHeaderHtml: '',//预览表头
      tableHeaderDialog: false, //表头弹框
      isQuery: false, //是否通过调用查询
      dataList: null,
      dataItemId: '', //这个表格的id
      tableName: '',
      tableDialog: false,
      isMap: 1,  //1是不显示地图，0是显示问题
      isCompile: false,
      deleteDialog: false,
      deleteTagDialog: false,
      dialogForm: {
        description: '' //表格名称
      },
      lineName: '',  //列的名称，指标的名称
      unitName: '',  //添加的单位名称
      tags: [],
      deleteTagArr: [],
      areaCheckGroup: [
        {
          chineseName: '乡/镇/街道',
          isHaveData: 1, //1表示没有数据，可以直接删除，0表示有数据
          index: 0
        },
        {
          chineseName: '村',
          isHaveData: 1, //1表示没有数据，可以直接删除，0表示有数据
          index: 0
        }
      ],
      areaCheckLength: 0,
      checkedArea: [],
      dateCheckGroup: [
        {
          chineseName: '年',
          isHaveData: 1, //1表示没有数据，可以直接删除，0表示有数据
          index: 0
        },
        {
          chineseName: '月',
          isHaveData: 1, //1表示没有数据，可以直接删除，0表示有数据
          index: 1
        },
        {
          chineseName: '日',
          isHaveData: 1, //1表示没有数据，可以直接删除，0表示有数据
          index: 2
        },
      ],
      dateCheckLength: 0,
      checkedDate: [],
      oldCheckArr: [],
      fieldTypeArr: {
        '乡/镇/街道': 1,
        '村': 3,
        '年': 4,
        '月': 5,
        '日': 6,
        '经度': 7,
        '纬度': 8
      },
      checkGroupObj: {}, //查看放表格本身有的时间，地区，经纬度的数据
      checkTagName: ''
    }
  },

  mounted () {
    this.getDataList();
  },

  watch: {
    lineName (to, from) {
      if (!to) this.unitName = ''
    },

    hintDialog (to, from) {
      if (!to) this.deleteTagArr = []
    },

    checkedArea (to, from) {
      if (to.length < from.length) {
        this.oldCheckArr = from
      }
    },

    checkedDate (to, from) {
      if (to.length < from.length) {
        this.oldCheckArr = from
      }
    },

    tableDialog (to, from) {
      if (!to) {
        this.checkGroupObj = {}
        this.tags = []
        // this.dateCheckGroup = []
        this.checkedArea = []
        this.checkedDate = []
        this.isMap = 1
        this.dialogForm.description = ''
      }
    },
  },

  methods: {
    getDataList () {
      let data = {
        moduleId: this.$route.query.routeId
      }
      request({
        url: '/tableZiDuan/getIndex',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.isQuery = false
          this.dataList = res.data
        }
      })
    },

    queryDataList () {
      let data = {
        moduleId: this.$route.query.routeId,
        string: this.tableName
      }
      request({
        url: '/tableZiDuan/findByLike',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.isQuery = true
          this.dataList = res.data
        }
      })
    },

    deleteTag (obj) {
      if (!obj.tag.hasOwnProperty('isHaveData')) {
        this.tags.splice(obj.index, 1)
      } else {
        if (obj.tag.isHaveData === 0 && obj.tag.deleteFlag === 0 && !obj.hasOwnProperty('deleteFlag')) {
          this.hintDialog = true
          this.dialogTitle = '删除提示'
          this.description = '该标签有数据，确定要删除吗？'
          this.cbFnName = 'deleteTag'
          this.buttonType = 'danger'
          this.cbFnArguments = { tag: obj.tag, index: obj.index, deleteFlag: 1 }
        } else if (obj.tag.isHaveData === 1) {
          obj.tag.deleteFlag = 1
        } else if (obj.deleteFlag === 1) {
          obj.tag.deleteFlag = 1
          this.hintDialog = false
        }
      }
    },

    previewTable () {
      let tableHeaderHtml = '<span>序号</span>'
      let date = this.checkedDate.join('/')
      for (const chineseName of this.checkedArea) {
        tableHeaderHtml += `<span>${chineseName}</span>`
      }
      if (this.checkedDate.length > 0) {
        tableHeaderHtml += `<span>${date}</span>`
      }
      if (this.isMap === 0) {
        tableHeaderHtml += '<span>经度</span><span>纬度</span>'
      }
      for (const item of this.tags) {
        if (item.deleteFlag === 0) {
          tableHeaderHtml += `<span>${item.chineseName}</span>`
        }
      }
      this.tableHeaderHtml = tableHeaderHtml
      this.tableHeaderDialog = true
    },

    openDeleteDialog (item) {
      if (item.tableHaveData === 0) { //0为有数据
        this.openHintDialog({
          hintDialog: true,
          dialogTitle: '删除提示',
          description: '该表格已有数据，确定删除吗？',
          cbFnName: 'deleteData',
          buttonType: 'danger',
          cbFnArguments: { type: 1, moduleTypeId: item.id }
        })
      } else {
        this.openHintDialog({
          hintDialog: true,
          dialogTitle: '删除提示',
          description: '确定删除该表格吗？',
          cbFnName: 'deleteData',
          buttonType: 'danger',
          cbFnArguments: { type: 1, moduleTypeId: item.id }
        })
      }
    },

    openHintDialog (obj) {
      //   Object.keys(obj).forEach(key => this[key] = obj[key])
      for (const key in obj) {
        this[key] = obj[key]
      }
    },

    emptyTableData (obj) { //清空表格数据
      if (this.isCompile) {
        let data = {
          type: obj.type,
          moduleTypeId: obj.moduleTypeId
        }
        request({
          method: 'post',
          url: '/tableZiDuan/deleteTableZiDuans',
          data
        }).then(res => {
          if (res.code == '10000') {
            if (res.replace) {
              this.openHintDialog({
                hintDialog: true,
                dialogTitle: '清空提示',
                description: res.msg,
                cbFnName: 'emptyTableData',
                buttonType: 'danger',
                cbFnArguments: { type: 1, moduleTypeId: this.dataItemId },
              })
              return
            }
            this.hintDialog = false
            this.tableDialog = false
            this.getDataList()
          }
        })
      } else {
        this.tags = []
        this.checkedArea = []
        this.checkedDate = []
        this.isMap = 1
      }
    },

    deleteData (obj) {
      let data = {
        moduleTypeId: obj.moduleTypeId,
        type: 1
      }
      request({
        url: '/tableZiDuan/deleteTable',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.$message({
            type: 'success',
            message: res.msg,
            showClose: true
          })
          this.hintDialog = false
          this.getDataList()
        }
      })
    },

    addTableItem () {
      let moduleTypeId = this.isCompile ? this.dataItemId : ''
      let str = []
      let tableName = this.dialogForm.description
      if (!tableName) {
        this.$message({
          type: 'error',
          message: '表格名称不能为空',
          showClose: true,
        })
        return
      }
      if (this.tags.length === 0 && this.isMap === 1 && this.checkedDate.length === 0 && this.checkedArea.length === 0) {
        this.$message({
          type: 'error',
          message: '表格里最少添加一个字段',
          showClose: true,
        })
        return
      }
      if (this.isCompile) {
        let checkArr = this.checkedDate.concat(this.checkedArea)
        if (this.isMap === 0) {
          checkArr.push('经度', '纬度')
        }
        for (const item of checkArr) {
          let id = ''
          if (this.checkGroupObj.hasOwnProperty(item)) {
            id = this.checkGroupObj[item].id
          }
          str.push(strItem(id, moduleTypeId, item, this.fieldTypeArr[item], 0, 0))
        }

        for (const key in this.checkGroupObj) {
          if (!checkArr.includes(key)) {
            str.push(strItem(this.checkGroupObj[key].id, moduleTypeId, key, this.fieldTypeArr[key], 0, 1))
          }
        }
      } else {
        if (this.isMap === 0) str.push(strItem('', moduleTypeId, '经度', 7, 0, 0), strItem('', moduleTypeId, '纬度', 8, 0, 0))
        // this.checkedArea.forEach((item) => {
        //   let typeDiyArr = [1, 3]
        //   str.push(strItem('', moduleTypeId, item, typeDiyArr[index], 0, 0))
        // })
        this.checkedArea.forEach(key => str.push(strItem('', moduleTypeId, key, this.fieldTypeArr[key], 0, 0)))

        // this.checkedDate.forEach((item, index) => str.push(strItem('', moduleTypeId, item, 4 + index, 0, 0)))
        this.checkedDate.forEach(key => str.push(strItem('', moduleTypeId, key, this.fieldTypeArr[key], 0, 0)))
      }

      this.tags.forEach(item => str.push(strItem(item.id, moduleTypeId, item.chineseName, 9, 1, item.deleteFlag)))

      let data = {
        str: JSON.stringify(str),
        tableId: moduleTypeId,//表格id(若新增则为空)
        tableName: tableName,//表格名称
        isMap: this.isMap,//是否在一张图上显示 0显示，1不显示
        parentId: this.$route.query.routeId,//表格上级模块id
      }

      request({
        url: '/tableZiDuan/saveTableZiDuan',
        method: 'post',
        data
      }).then(res => {
        if (res.code == '10000') {
          this.getDataList()
          this.tableDialog = false
        }
      })
    },

    toTableItemDetails (item) {
      if (item.tableZiDuanList.length === 0) {
        this.$message({
          type: 'error',
          message: '请先编辑表格指标',
          showClose: true,
        })
        return
      }
      this.$parent.componentName = 'tableItemDetail'
      this.$parent.tableItem = item
      //   this.$store.commit('crud/GET_DATALIST', { dataList: null })
    },

    cancelCheckbox (obj) {
      this[obj.type] = []
      this.oldCheckArr.forEach(item => this[obj.type].push(item))
    },

    cancelSwitchMap (obj) {
      this.isMap = 0
    },

    sureSwithchMap (obj) {
      this.checkGroupObj['经度'].isHaveData = this.isMap
      this.checkGroupObj['纬度'].isHaveData = this.isMap
      this.hintDialog = false
    },

    onOffChecked (obj) {
      let { index, chineseName, type, checkGroup, typeLength } = obj
      /**
       * @param index 选中复选框索引的值
       * @param chineseName 当前操作复选框的中文名
       * @param type 对应的双项绑定的不同复选框的数组
       * @param checkGroup 对应的复选框组
       * @param typeLength 对应双项绑定的复选框的上次被选中的数组长度
       */
      let i = 0
      let checkDateLength = this[type].length
      if (checkDateLength > this[typeLength]) {
        this[type] = []
        for (i; i <= index; i++) {
          this[type].push(this[checkGroup][i].chineseName)
        }
      } else if (checkDateLength < this[typeLength]) {
        let i = index
        if (this.checkGroupObj[chineseName] && this.checkGroupObj[chineseName].isHaveData == 0 && !this.hintDialog) {
          this.openHintDialog({
            hintDialog: true,
            dialogTitle: '删除提示',
            description: '该标签有数据，确定要删除吗？',
            buttonType: 'danger',
            cbFnName: 'onOffChecked',
            cbFnArguments: { index: index, chineseName: chineseName, type: type, checkGroup: checkGroup, typeLength: typeLength },
            cancelFn: 'cancelCheckbox',
            cancelFnArguments: { type: type }
          })
          return
        }
        this.hintDialog = false
        if (this.checkGroupObj[chineseName]) this.checkGroupObj[chineseName].isHaveData = 1
        for (i; i < this[checkGroup].length; i++) {
          this[type].splice(index, 1)
        }
      }
      this[typeLength] = this[type].length
    },

    switchMap (value) {
      if (value == 1) {
        if (this.checkGroupObj.hasOwnProperty('经度') && this.checkGroupObj['经度'].isHaveData === 0) {
          this.hintDialog = true
          this.dialogTitle = '删除提示'
          this.buttonType = 'danger'
          this.description = '该标签有数据，确定要删除吗？'
          this.cbFnName = 'sureSwithchMap'
          this.cbFnArguments = {}
          this.cancelFn = 'cancelSwitchMap'
          this.cancelFnArguments = {}
        }
      }
    },

    addTag (Arr, name) {
      if (this.lineName == '') {
        this.$message({
          message: '请输入指标名称！',
          type: 'error',
          showClose: true
        })
        return
      }
      if (this.tags.length > 60) {
        this.$message({
          message: '最多添加60个标签！',
          type: 'error',
          showClose: true
        })
        return
      }
      if (this.lineName) {
        this.tags.push({
          chineseName: this.unitName ? this.lineName.replace(/\s+/g, "") + `(${this.unitName.replace(/\s+/g, "")})` : this.lineName,
          deleteFlag: 0,
          id: ''
        })
        this.lineName = ''
        this.unitName = ''
        this.$refs.tagInput.focus()
      }
    },

    openTableDialog (bool, item) {
      if (!bool && Array.isArray(this.dataList) && this.dataList.length >= 5) {
        this.$message({
          message: '最多只能添加5个表格',
          type: 'error',
          showClose: true
        })
        return
      }
      this.tableDialog = true
      this.isCompile = bool
      this.hintDialog = false
      if (bool) {
        this.dataItemId = item.id
        this.dialogForm.description = item.description
        let tableZiDuanList = item.tableZiDuanList
        this.tags = []
        this.checkedDate = []
        this.checkedArea = []
        this.checkGroupObj = {}
        for (const value of tableZiDuanList) {
          let { chineseName, isNull } = value
          if (isNull == 0) {
            if (chineseName === '经度' || chineseName === '纬度') {
              this.isMap = 0
              this.checkGroupObj[chineseName] = value
            } else if (chineseName === '乡/镇/街道' || chineseName === '村') {
              this.checkedArea.push(chineseName)
              this.checkGroupObj[chineseName] = value
            } else if (chineseName === '年' || chineseName === '月' || chineseName === '日') {
              this.checkedDate.push(chineseName)
              this.checkGroupObj[chineseName] = value
            }
          } else if (isNull == 1) {
            this.tags.push(value)
          }
        }
        this.areaCheckLength = this.checkedArea.length
        this.dateCheckLength = this.checkedDate.length
      }
    },

    closeTableDialog () {
      this.tableDialog = false
      this.getDataList()
    }
  },
}
</script>

<style lang="scss" scoped>
.content-main {
  min-height: 600px;
  .el-input {
    width: 200px;
  }
  .el-select {
    width: 200px;
  }
  .header {
    background: #fff;
    border-radius: 4px;
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    font-weight: 600;
    padding-top: 20px;
    margin-bottom: 20px;

    &-left {
      float: left;
    }

    &-right {
      float: right;
      margin-left: 40px;
    }
  }
  .dialog-title {
    font-size: 18px;
    color: #0174ff;
    height: 40px;
    line-height: 40px;
  }

  .el-button {
    margin-left: 10px;
  }

  .switch-dec {
    line-height: 28px;
  }
  .switch-warning {
    color: #f00;
  }

  .bottom20 {
    margin-bottom: 20px;
    span {
      font-size: 16px;
    }
  }

  .el-checkbox-group {
    display: inline-block;
  }

  .hint-title {
    line-height: 40px;
    font-size: 16px;
    height: 40px;
  }
  .el-tag {
    margin-right: 20px;
  }
  .tag-group {
    line-height: 40px;
    min-height: 40px;
  }

  .table-list {
    .list {
      font-size: 16px;
    }
    .item {
      font-weight: 600;
      width: 100%;
      height: 80px;
      line-height: 80px;
      background: #f4f7fe;
      color: #0174ff;
      border-radius: 2px;
      padding: 0 32px;
      box-sizing: border-box;
      margin-bottom: 20px;
      cursor: pointer;
      &-right {
        float: right;
      }
    }
  }

  .has-table {
    text-align: center;
    padding-top: 100px;
    p {
      text-align: center;
      font-size: 18px;
    }
    span {
      color: #409eff;
      cursor: pointer;
      padding-bottom: 4px;
      &:hover {
        border-bottom: 1px solid #409eff;
      }
    }
  }

  .table-header {
    text-align: center;
    background: #f5f5f5;
    border-bottom: 1px solid #ededed;
    border-top: 1px solid #ededed;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    display: flex;
    justify-content: space-around;
  }

  >>> .el-switch__label--left {
    position: absolute;
    z-index: -111;
    left: 20px;
    margin-right: 0;
  }
  >>> .el-switch__label--right {
    position: absolute;
    z-index: -111;
    margin-left: 6px;
    color: #fff;
  }

  >>> .el-switch__label--right.is-active {
    z-index: 1111;
    color: #fff !important;
  }
  >>> .el-switch__label--left.is-active {
    z-index: 1111;
    color: #9c9c9c !important;
  }
}
</style>