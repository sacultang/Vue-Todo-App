
<template>
    <div class="todo-item">

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
          <button key="complete" @click="editedTodo">완료</button>
          <button key="cancel" @click="offEditMode">취소</button>
        </div>
      </div>
      
      <!-- 노말 모드 -->
      <div v-else class="item__inner item--normal">
        <input v-model="done" type="checkbox">
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
          <button key="update" @click="onEditMode">수정</button>
          <button key="delete" @click="deleteTodo">삭제</button>
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