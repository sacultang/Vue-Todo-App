<template>
    <div>
        <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @update-todo="updateTodo"
        @delete-todo="deleteTodo"
        />
        <hr>
        <!-- <todo-item></todo-item> -->
        <todo-creator @create-todo="createTodo"/>
    </div>
</template>
<script>
import Low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
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
      todos: []
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
    deleteTodo(){
      console.log('delete')
    }
  }
}
</script>
