<template>
    <div class="creator-wrap">
        
        <input
            :value="title"
            :placeholder="placeholder"
            type="text"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        />
        <button @click="createTodo">Add</button>
    </div>
</template>
<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요'
    }
  },
  methods: {
    createTodo () {
      // 생성
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지 않은 제목입니다!')
        this.title = this.title.trim()
        return
      }

      // this.$emit('create-todo', this.title)
      this.$store.dispatch('todoApp/createTodo', this.title) //action에 접근할때는 dispatch mutation은 commit
      this.title = ''

      this.$nextTick(() => {
        var listScroll = document.querySelector('.todo-app__list')
        listScroll.scrollTo(0,document.body.scrollHeight)
      })
    }
  }
}
</script>
