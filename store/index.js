import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
    // strict:true //배포할때는 false로 해야함

    strict: process.env.NODE_ENV !== 'production',
    
    modules: {
        todoApp
    }

})