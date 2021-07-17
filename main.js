import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  router,
  // render (createElement){
  //     return createElement(App)
  // } 축약형
  // render: (h) => {
  //     return h(App)
  // } 축약형
  store,
  render: h => h(App)
})
