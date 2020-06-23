<template>
  <div class="town-country">
    <el-col :span="11">
      <el-select v-model="townName"
                 placeholder="请选择"
                 :clearable="true"
                 :disabled="isCompile"
                 value-key="id"
                 @change="getTownItem"
                 @clear="clearTown"
                 @visible-change="getCountrySelectDataList($event,1)">
        <el-option v-for="item in townList"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>
      </el-select>
    </el-col>
    <el-col class="line"
            style="text-align:center"
            :span="2">-</el-col>
    <el-col :span="11">
      <el-select v-model="countryName"
                 placeholder="请选择"
                 :clearable="true"
                 :disabled="isCompile"
                 value-key="id"
                 @clear="clearCountry"
                 @change="getCountryItem"
                 @visible-change="getCountrySelectDataList($event,2)">
        <el-option v-for="item in countryList"
                   :key="item.id"
                   :label="item.name"
                   :value="item">
        </el-option>
      </el-select>
    </el-col>

  </div>
</template>

<script>
export default {
  props: {
    isCompile: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
      countryside: sessionStorage.countryId,// 一级乡镇id
    }
  },

  computed: {
    countryList () {
      return this.$store.state.townAndCountry.countryList
    },

    townList () {
      return this.$store.state.townAndCountry.townList
    },

    townName: {
      get () {
        return this.$store.state.townAndCountry.townName
      },
      set () {

      }
    },

    townId: {
      get () {
        return this.$store.state.townAndCountry.townId
      },
      set () {

      }
    },

    countryName: {
      get () {
        return this.$store.state.townAndCountry.countryName
      },
      set () {

      }
    }

  },

  methods: {
    clearTown () {
      this.$store.commit('townAndCountry/CLEARTOWN')
    },

    clearCountry () {
      this.$store.commit('townAndCountry/CLEARCOUNTRY')
    },

    getCountryItem (item) {
      this.$store.commit('townAndCountry/GET_COUNTRY_ITEM', { item: item })
    },

    getTownItem (item) {
      this.$store.commit('townAndCountry/GET_TOWN_ITEM', { item: item })
    },

    getCountrySelectDataList (event, val) {
      if (event) {
        if (val == 1) { //打开town的下拉框
          let data = {
            id: this.countryside
          }
          this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
        } else {
          if (this.townName == '') {
            this.$message({
              showClose: true,
              message: '请先选择乡镇',
              type: 'error'
            });
            this.$store.commit('townAndCountry/CLEARCOUNTRYLIST')
          } else {
            let data = {
              id: this.townId
            }
            this.$store.dispatch('townAndCountry/getTownOrCountryList', { data: data, val: val })
          }
        }
      }
    },
  },

}
</script>

<style lang="scss" scoped>
</style>