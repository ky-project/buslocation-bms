import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const types = {
    SET_USER: 'SET_USER',
    SET_AUTHORITY: 'SET_AUTHORITY',
}

const state = {
    user: {},
    authority: {},
}

const getters = {
    user: (state) => {
        return state.user;
    },
    authority: (state) => {
        return state.authority;
    }
}

const mutations = {
    [types.SET_USER](state, user) {
        if (user) {
            state.user = user;
        } else {
            state.user = {};
        }
    },
    [types.SET_AUTHORITY](state, authority) {
        if (authority) {
            state.authority = authority;
        } else {
            state.authority = {};
        }
    }
}

const actions = {
    setUser: ({ commit }, user) => {
        commit(types.SET_USER, user);
    },
    setAuthority: ({ commit }, authority) => {
        commit(types.SET_AUTHORITY, authority);
    }
}

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
})