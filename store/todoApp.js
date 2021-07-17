import low from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage'
import cryptoRandomString from 'crypto-random-string'
import _find from 'lodash/find'
import _assign from 'lodash/assign'
import Vue from 'vue'
import _cloneDeep from 'lodash/cloneDeep'
import _forEachRight from 'lodash/forEachRight'
import _findIndex from 'lodash/findIndex'

export default {
    namespaced:true,

    //data는 함수여야 한다 state는 데이터
    state:() => {
        return {
            db: null,
            todos: [],
            filter:'all'
        }
    },

    //Computed
    getters:{
        filteredTodos(state) {
            switch (state.filter) {
              case 'all' :
              default:
                return state.todos
              case 'active' : //해야 할 항목
                return state.todos.filter(todo => !todo.done)
              case 'completed' :
                return state.todos.filter(todo => todo.done)
              
            }
          },
        //괄호안의 숫자 구하기
        total (state){ //state가 뭔지 모르기때문에 state를 인수로 전달해줘야함
            return state.todos.length
        },
        activeCount (state){
            return state.todos.filter(todo => !todo.done).length
        },
        completedCount (state,getters){ //total과 activeCount는 getters안에 있기떄문에
            //두번째 인자로 getters를 받아와야 함
            return getters.total - getters.activeCount
        }
        

    },

    //Methods
    //실제 값을 변경할떄 사용(비동기X)
    mutations:{
        assignDB (state, lowdb){
            state.db = lowdb
        },
        createDB(state,newTodo){
            //Create DB
            state.db
              .get('todos') // lodash에서 제공하는 문법
              .push(newTodo) // ``
              .write() //lowdb
        },
        updateDB(state,{todo,value}){
            state.db
            .get('todos')
            .find({id:todo.id})
            .assign(value)
            .write()
        },
        deleteDB(state, todo){
            state.db
            .get('todos')
            .remove({id:todo.id})
            .write()
        },
        assignTodos (state, todos){
            state.todos = todos
        },
        pushTodo (state,newTodo){
            state.todos.push(newTodo)
        },
        assignTodo (state, payload){
             //Object.assign(foundTodo, value) 자바 문법
            //_assign(foundTodo,value)
            const { foundTodo, value } = payload
        },
        deleteTodo(state,index){
            // state.todos.splice(index, 1)
            Vue.delete(state.todos, index)
        },
        updateTodo (state,{todo,key,value}){
            todo[key] = value
        },
        updateFilter (state,filter){
            state.filter = filter
        }
    },

    //Methods
    //일반 로직(비동기)
    //actions 에서는 데이터 변경이 불가능 하다
    actions:{
        initDB ({state , commit}) {
            
            const adapter = new LocalStorage('todo-app')


            //mutations를 실행할때는 commit이라는 함수가 필요하고 (실행할 mutatins,전달한인자)
            commit('assignDB' , low(adapter))
            //state.db = Low(adapter)
            
            // console.log(this.db)
      
            // todos DB에 데이터가 있는지 체크
            // has() lodash 에서 제공하는 있는지 없는지 체크'만'하는 메소드
            // value()를 붙여야 해당하는 값을 가져 올 수 있음
            const hasTodos = state.db.has('todos').value()
            if (hasTodos) {
              //state.todos = _cloneDeep(state.db.getState().todos)
                commit('assignTodos',_cloneDeep(state.db.getState().todos))
            } else {
              // local DB 초기화
                state.db
                    .defaults({
                    todos: [] // Collection
                    })
                    .write()
            }
          },
        createTodo ({state, commit},title) {
            const newTodo = {
                id: cryptoRandomString({ length: 10, type: 'numeric' }),
                title: title,
                createdAt: new Date(),
                updatedAt: new Date(),
                done: false
            }
      
            //Create DB
            commit('createDB',newTodo)

            //Create Client
            commit('pushTodo',newTodo)
        },
        updateTodo ({state,commit}, payload){
            const {todo,value} = payload
            //UpdateDb
            commit('updateDB',payload)
      
            const foundTodo = _find(state.todos,{id:todo.id})
            commit('assignTodo', {foundTodo, value})
        },
        deleteTodo({state, commit},todo){
            
            //DeleteDB
            commit('deleteDB' , todo)
            //_remove(this.todos,{id:todo.id}) //화면이 갱신 되지 않음 반응성을 유지하면서 데이터를 수정하려면 native 메소드를 사용해야함
            
            // lodash를 이용해서 인덱스 찾기
            const foundIndex = _findIndex(state.todos,{id:todo.id})
            //$delete() vue에서 제공하는 메소드
            //deleteClient
            commit('deleteTodo', foundIndex)
        },
        completeAll ({state,commit},checked){
            //DB갱신 
            //commit mutations은 반환값을 만들어낼 수 없음
            const newTodos = state.db
                            .get('todos')
                            .forEach(todo => {
                                //todo.done = checked
                                commit('updateTodo', {
                                    todo,
                                    key:'done',
                                    value:checked
                                })
                            })
                            .write()
            //Local todos 갱신
            //this.todos.forEach(todo => {todo.done = checked})
      
            //state.todos = _cloneDeep(newTodos)
            commit('assignTodos', _cloneDeep(newTodos))
        },
        clearCompleted ({state,commit,dispatch}){
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
            _forEachRight(state.todos, todo => {
              if(todo.done){
                //this.deleteTodo(todo)
                dispatch('deleteTodo',todo)
              }
            })
          
          }
    }

}