import Vue from 'vue';
import Vuex from 'vuex';
import crud from './modules/crud';
import permission from './modules/permission';
import townAndCountry from './modules/townAndCountry';

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        crud,
        permission,
        townAndCountry
    }
})
export default store