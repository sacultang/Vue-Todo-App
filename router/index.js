import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home.vue'
import About from '~/views/About.vue'
import TodoApp from '~/views/TodoApp.vue'

Vue.use(VueRouter)

const routes = [
    // config

    {
        name:'index',
        path:'/',
        component:Home
    },
    {
        name:'about',
        path:'/about',
        component:About
    },
    {
        name:'todos',
        path:'/todos',
        redirect:'/todos/all',
        component:TodoApp,
        //자식 경로
        children : [
            {
                name:'todos-filter',
                path:':id'
                //: = 부분에다 파라미터를 적용해서 어떻게 작동하겠다
            }
        ]
    }

]

export default new VueRouter({
    // mode:'history', // #이 없는 일반적 주소, 새로고침이나 직접적 주소 입력으로 접속시 문제 발생
    routes :routes
})