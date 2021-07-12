
<template>
    <div 
    :class="{done}"
    class="todo-item">

      <!--  에디트 모드-->
      <div v-if="isEditMode" class="item__inner item--edit">
        <input 
          ref="titleInput"
          :value="editedTitle" 
          type="text" 
          @input="editedTitle = $event.target.value" 
          @keypress.enter="editedTodo" 
          @keypress.esc="offEditMode"
        />

        <!--  버튼 -->
        <div class="item__actions">
          <button class="btn btn_done" key="complete" @click="editedTodo">
            <span class="material-icons">done</span>
          </button>
          <button class="btn btn_cancel" key="cancel" @click="offEditMode">
            <span class="material-icons">
            clear
            </span>
          </button>
        </div>
      </div>
      
      <!-- 노말 모드 -->
      <div v-else class="item__inner item--normal">
        <label>
          <input v-model="done" type="checkbox">
          <span class="icon"><i class="material-icons">check</i></span>
        </label>
        
        
        <div class="item__title-wrap">
          <div class="item__title">
            {{todo.title}}
          </div>
          <div class="item__date">
            {{date}}
          </div>
        </div>

        <!--  버튼 -->
        <div class="item__actions">
          <button class="btn btn--edit" key="update" @click="onEditMode">
            <span class="material-icons">
            edit
            </span>
          </button>
          <button class="btn btn--danger" key="delete" @click="deleteTodo">
            <span class="material-icons">
            delete
            </span>
          </button>
        </div>
      </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: {
    todo: Object
  },
  data(){
    return {
      isEditMode:false,
      editedTitle: ''
    }
  },
  computed :{
    done:{
      get(){
        return this.todo.done
      },
      set(done){
        this.updateTodo({
          done
        })
      }
    },
    date(){
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)

      if(isSame){
        return date.format('YYYY년 MM월 DD일')
      }else{
        return `${date.format('YYYY년 MM월 DD일')} (edited)`
      }
      
    }
  },
  methods :{
    
    onEditMode(){
      this.editedTitle = this.todo.title
      this.isEditMode = true
      

      this.$nextTick(()=>{
        // Vue.js가 데이터 변경 후 DOM 업데이트를 마칠 때까지 기다림.
        this.$refs.titleInput.focus()
      })
    },
    editedTodo(){

      if(this.todo.title !== this.editedTitle){
         this.updateTodo({
          title : this.editedTitle,
          updatedAt : new Date()
        })
      }
     

      this.offEditMode()
    },
    offEditMode(){
      this.isEditMode = false
    },
    updateTodo(value){
      this.$emit('update-todo',this.todo,value)
    },
    deleteTodo(){
      this.$emit('delete-todo',this.todo)
    }
  }
}
</script>



<style scoped>
  /* scoped 는 현재컴포넌트 내에서만 사용하겠다는 속성
  .todo-item{
    margin-bottom: 10px;
  }
  .item__inner {
    display: flex;
  }
  .item__date {
    font-size: 13px;
  }
  .todo-item.done .item__title {
    text-decoration: line-through;
  }
  */
</style>