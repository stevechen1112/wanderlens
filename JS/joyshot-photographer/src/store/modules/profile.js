const profile = {
    state: {
        token: localStorage.getItem('JS_P_TOKEN'),
        username: localStorage.getItem('username')
    },

    mutations: {
        BIND_LOGIN: (state, data) => {
            localStorage.setItem('JS_P_TOKEN', data)
            state.token = data
        },
        BIND_LOGOUT: () => {
            localStorage.removeItem('JS_P_TOKEN')
            localStorage.removeItem('JS_P_ROLE_MENU')
        },
        SAVE_USER: (state, data) => {
            localStorage.setItem('username', data)
            state.username = data
        }
    },

    // actions: {
    //   bindLogin({ commit }, data){
    //     commit('BIND_LOGIN', data)
    //   },
    //   bindLogout({ commit }){
    //     commit('BIND_LOGOUT')
    //   },
    //   saveUser({ commit }, data){
    //     commit('SAVE_USER', data)
    //   }
    // }
}

export default profile
