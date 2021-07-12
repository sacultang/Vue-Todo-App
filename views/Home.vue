<template>
    <section class="home">
        <div>
            <h1>OJ's HOMEPAGE!</h1>
            <h2 @click="$router.push('/about')">About</h2><!-- 메소드부분 작성 안하고 바로 클릭에 넣기 가능 -->
            <!--<h2 @click="$router.push('/todos')">Todo App</h2> 아래와 같이 작성 가능--> 
            <router-link to="/todos" tag="h2">Todo App</router-link> <!--tag = "어떤 태그로 완성이 되어 작동이 될지" -->
        </div>
    </section>
</template>
<script>
export default {
    // methods: {
    //     toAbout(){
    //         this.$router.push('/about')
    //     },
    //     toTodoApp(){
    //         this.$router.push('/todos')
    //     }

    // }
}
</script>