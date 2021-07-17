export default {
    namespaced:true,
    //Data
    state:()=>({
        a:123,
        b:[]
    }),
    
    //computed
    getters :{
        someGetter1 (state,getters){
            return state.a + 1
        },
        someGetter2 (state,getters){
            return state.a + getters.someGetter1
        }
    },

    //methods
    muttions:{
        someMutatins(state,payload){
            state.a = 789
            state.b.push(payload)
        }
    },
    actions:{
                    //context = {state,getters,commit,dispatch}
        someAction ({state,getters,commit,dispatch}, payload){
            // state.a = 789 //error actions에서 수정할때는 mutations 도움을 받아야 함
            state.b.push(payload) //Error
            commit('someMutatins', payload)
        },
        someAction2 (context,payload){
            context.commit('someMutatins')
            context.dispatch('someAction' , payload)
        }
    }
}