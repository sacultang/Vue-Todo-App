import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home.vue'
import About from '~/views/About.vue'
import TodoApp from '~/views/TodoApp.vue'

Vue.use(VueRouter)

const routes = [
    // config

    {
        path:'/',
        component:Home
    },
    {
        path:'/about',
        component:About
    },
    {
        path:'/todos',
        component:TodoApp
    }

]

export default new VueRouter({
    routes :routes
})