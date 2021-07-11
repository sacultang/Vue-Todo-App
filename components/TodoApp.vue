<template>
    <div class="todo-app">

        <div class="todo-app__actions">
          <div class="filters">
            <button :class="{active: filter ==='all'}" @click="changeFilter('all')">모든항목 ({{total}})</button>
            <button :class="{active: filter ==='active'}" @click="changeFilter('active')">해야 할 항목 ({{activeCount}})</button>
            <button :class="{active: filter ==='completed'}" @click="changeFilter('completed')">완료된 항목 ({{completedCount}})</button>
          </div>
          <div class="actions">
            <input v-model="allDone" type="checkbox">
            <button @click="clearCompleted">완료된 항목 삭제</button>
          </div>
        </div>

        <div class="todo-app__list">
          <todo-item
          v-for="todo in filteredTodos"
          :key="todo.id"
          :todo="todo"
          @update-todo="updateTodo"
          @delete-todo="deleteTodo"
          />
        </div>
        <hr>
        <!-- <todo-item></todo-item> -->
        <todo-creator class="todo-app_creator" @create-todo="createTodo"/>
    </div>
</template>
<script>
import Low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
// import _remove from 'lodash/remove'
import _forEachRight from 'lodash/forEachRight'
import _findIndex from 'lodash/findIndex'
import TodoCreator from './TodoCreator.vue'
import TodoItem from './TodoItem.vue'

export default {
  components: {
    TodoCreator,
    TodoItem
  },
  data () {
    return {
      db: null,
      todos: [],
      filter:'all'
    }
  },

  //done 체크 여부에 따라 filter 
  computed:{
    filteredTodos() {
      switch (this.filter) {
        case 'all' :
        default:
          return this.todos
        case 'active' : //해야 할 항목
          return this.todos.filter(todo => !todo.done)
        case 'completed' :
          return this.todos.filter(todo => todo.done)
        
      }
    },

    //괄호안의 숫자 구하기
    total (){
      return this.todos.length
    },
    activeCount (){
      return this.todos.filter(todo => !todo.done).length
    },
    completedCount (){
      return this.total - this.activeCount
    },
    allDone: {
      get(){
        return this.total === this.completedCount && this.total > 0
      },
      set(checked){
        this.completeAll(checked)
      }
    }
  },
  created () {
    this.initDB()
  },
  methods: {
    initDB () {
      const adapter = new LocalStorage('todo-app')
      this.db = Low(adapter)

      // console.log(this.db)

      // todos DB에 데이터가 있는지 체크
      // has() lodash 에서 제공하는 있는지 없는지 체크'만'하는 메소드
      // value()를 붙여야 해당하는 값을 가져 올 수 있음
      const hasTodos = this.db.has('todos').value()
      if (hasTodos) {
        this.todos = _cloneDeep(this.db.getState().todos)
      } else {
        // local DB 초기화
        this.db
          .defaults({
            todos: [] // Collection
          })
          .write()
      }
    },
    createTodo (title) {
      const newTodo = {
        id: cryptoRandomString({ length: 10, type: 'numeric' }),
        title: title,
        createdAt: new Date(),
        updatedAt: new Date(),
        done: false
      }

      //Create DB
      this.db
        .get('todos') // lodash에서 제공하는 문법
        .push(newTodo) // ``
        .write() //lowdb

      //Create Client
      this.todos.push(newTodo)
    },
    updateTodo (todo , value){
      this.db
      .get('todos')
      .find({id:todo.id})
      .assign(value)
      .write()

      const foundTodo = _find(this.todos,{id:todo.id})
     //Object.assign(foundTodo, value) 자바 문법
     _assign(foundTodo,value)
    },
    deleteTodo(todo){
      this.db
      .get('todos')
      .remove({id:todo.id})
      .write()

      //_remove(this.todos,{id:todo.id}) //화면이 갱신 되지 않음 반응성을 유지하면서 데이터를 수정하려면 native 메소드를 사용해야함

      // lodash를 이용해서 인덱스 찾기
      const foundIdex = _findIndex(this.todos,{id:todo.id})
      //$delete() vue에서 제공하는 메소드
      this.$delete(this.todos , foundIdex)
    },
    changeFilter (filter){
      this.filter = filter
    },
    completeAll (checked){
      //DB갱신
      const newTodos = this.db
                      .get('todos')
                      .forEach(todo => {todo.done = checked})
                      .write()
      //Local todos 갱신
      //this.todos.forEach(todo => {todo.done = checked})

      this.todos = _cloneDeep(newTodos)
    },
    clearCompleted (){
      //1. 배열을 앞에서 부터 지움 > 문제 배열이 앞으로 쏠리면서 뒤에 인덱스가 정상적으로 삭제 되지 않음
      // this.todos.forEach(todo => {
      //   if(todo.done){
      //     this.deleteTodo(todo)
      //   }
      // })

      //2. 자바스크립트로 뒤에서부터 지우는 방법
      // this.todos
      // .reduce((list,todo,index) => {
      //   if(todo.done){
      //     list.push(index)
      //   }
      //   return list
      // },[]) 
      // .reverse()
      // .forEach(index => {
      //   this.deleteTodo(this.todos[index])
      // })

      //3.lodash 라이브러리를 사용하여 뒤에서 부터 지움
      _forEachRight(this.todos, todo => {
        if(todo.done){
          this.deleteTodo(todo)
        }
      })
    
    }
  }
}
</script>

<style>
  @import "../css/_style.css"
</style>
