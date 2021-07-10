<template>
    <div class="todo-item">

        <input v-model="done" type="checkbox">

        <!-- 제목/날짜 -->
        <div class="item_title-wrap">
            <div class="item_title">
              {{todo.title}}
            </div>
            <div class="item_date">
              {{date}}
            </div>
        </div>

        <!-- 수정/삭제 버튼 -->
        <div class="item_actions">
            <button @click="onEditMode">수정</button>
            <button @click="deleteTodo">삭제</button>
        </div>
    </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  props: {
    todo: Object
  },
  computed:{
    done:{
      get (){
        return this.todo.done
      },
      set (done){
        this.updateTodo({
          done
        })
      }
    },
    date (){
                        //1.특정 시간 데이타
      const date = dayjs(this.todo.createdAt)
      const isSame = date.isSame(this.todo.updatedAt)
      return date.format('YYYY년 MM월 DD일')
    }
  },
  methods: {
    onEditMode () {

    },
    updateTodo(value){
      this.$emit('update-todo',this.todo,value)
    },
    deleteTodo () {
      this.$emit('delete-todo',this.todo)
    }
  }
}
</script>
