<template>
  <div>
    <table>
      <tr>
        <th>
          <!-- <el-checkbox v-model="checkAll"
                           @change="handleCheckAllChange">全选</el-checkbox> -->
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
          产量（万吨）
        </th>
        <th>
          年末存栏数（万只/万头）
        </th>
        <th>
          年末出栏数（万只/万头）
        </th>
        <th>
          操作
        </th>
      </tr>
      <tr v-for="(item,index) in dataList"
          :key="item.id">
        <td>
          <!-- <el-checkbox-group @change="handleCheckedCitiesChange">
                <el-checkbox></el-checkbox>
              </el-checkbox-group> -->
        </td>
        <td>
          {{index+1}}
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
          {{item.yield}}
        </td>
        <td>
          {{item.numbersCunlan}}
        </td>
        <td>
          {{item.numbersChulan}}
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
</template>

<script>
export default {
  data () {
    return {
      dataList: value
    }
  },
}
</script>

<style lang="scss" scoped>
</style>