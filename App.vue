<template>
  <div>
    <router-link to="/" class="to-home">
      <i class="material-icons">home</i>
    </router-link>
    <router-view></router-view>
  </div>
</template>

// <script>
// import TodoApp from './views/TodoApp.vue'
// export default {
//   components: {
//     TodoApp // TodoApp : TodoApp //이름이 같으면 생략 가능
//   }
// }
// </script>

<script>
export default {
  created(){
    console.log('router',this.$router)
    console.log('route',this.$route)
  }
}
</script>
<style>
  .to-home.router-link-exact-active {
    display: none;
  }
</style>