<template>

    <div class="todo-app">

        <!-- Todo Creator-->
        <todo-creator class="todo-app_creator"/>

        <!-- filter Box -->
        <div class="todo-app__actions">
          <div class="filters">
            <!-- <button :class="{active: filter ==='all'}" @click="changeFilter('all')">모든항목 ({{total}})</button> -->
            <router-link to="/todos/all" tag="button">모든항목 ({{total}})</router-link>
            <!-- <button :class="{active: filter ==='active'}" @click="changeFilter('active')">해야 할 항목 ({{activeCount}})</button> -->
            <router-link to="/todos/active" tag="button">해야 할 항목 ({{activeCount}})</router-link>
            <!-- <button :class="{active: filter ==='completed'}" @click="changeFilter('completed')">완료된 항목 ({{completedCount}})</button> -->
            <router-link to="/todos/completed" tag="button">완료된 항목 ({{completedCount}})</router-link>
          </div>
          <div class="actions clearfix">
            <div class="float--left">
              <label>
                <input v-model="allDone" type="checkbox" >
                <span class="icon">
                  <span class="material-icons">
                  done_all
                  </span>
                </span>
              </label>
            </div>
            
            
            <div class="up-down-delete float--right">
              <button class="btn btn--edit">
                <i @click="scrollToTop" class="material-icons">expand_less</i>
              </button>
              <button @click="scrollToBottom" class="btn btn--edit">
                <i class="material-icons">expand_more</i>
              </button>
              <button @click="clearCompleted" class="btn btn--danger">
                <i class="material-icons">delete_sweep</i>
              </button>
            </div>
            
          </div>
        </div>

        <!-- Todo List(TodoItem) -->
        <div class="todo-app__list">
          <todo-item
            v-for="todo in filteredTodos"
            :key="todo.id"
            :todo="todo"
          />
        </div>
    </div>
</template>
<script>
import {mapState, mapGetters ,mapMutations, mapActions} from 'vuex'
// import _remove from 'lodash/remove'

import scrollTo from 'scroll-to'
import TodoCreator from '~/components/TodoCreator.vue'
import TodoItem from '~/components/TodoItem.vue'


export default {
  components: {
    TodoCreator,
    TodoItem
  },
  

  //done 체크 여부에 따라 filter 
  computed:{

    //Helpers
    ...mapState('todoApp',[
      'db',
      'todos'
    ]),
    ...mapGetters('todoApp',[
      'total',
      'activeCount',
      'completedCount',
      'filteredTodos'
    ]),
    
    allDone: {
      get(){
        return this.total === this.completedCount && this.total > 0
      },
      set(checked){
        this.completeAll(checked)
      }
    }
  },
  watch: {
    $route (){
      //state.filter = this.$router.params.id
      //this.$store.commit('todoApp/updateFilter', this.$router.params.id)
      this.updateFilter(this.$route.params.id)
    }
  },
  created () {
    this.initDB()
    
  },
  methods: {
    // changeFilter (filter){
    //   this.filter = filter
    // },
    ...mapMutations('todoApp',[
      'updateFilter'
    ]),
    ...mapActions('todoApp',[
      'initDB',
      'completeAll',
      'clearCompleted'
    ]),
    scrollToTop(){
      let docElem = document.querySelector('.todo-app__list')
      //console.log('click')
      docElem.scrollTo(0,0,{
        duration:300,
        ease:'linear'
      })
    },
    
    // scrollToTop(){
    //   let docElem = document.documentElement
    //   let docScrollTop = docElem.scrollTop
    //   //docScrollTop = 0;
      
    // },
    scrollToBottom(){
      let docElem = document.querySelector('.todo-app__list')
      
      //console.log(bodyHeight)
      docElem.scrollTo(0,docElem.scrollHeight,{
        duration:300,
        ease:'linear'
      })
    }
  }
}
</script>

<style>
  @import "../css/style.css";

  .filters button.router-link-active{
    background: rgb(34, 209, 136);
    color:white;
  }
</style>
