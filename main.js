import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  // render (createElement){
  //     return createElement(App)
  // } 축약형
  // render: (h) => {
  //     return h(App)
  // } 축약형
  render: h => h(App)
})
