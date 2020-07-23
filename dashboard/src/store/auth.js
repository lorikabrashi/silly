import Vue from 'vue'
import VueCookies from 'vue-cookies'
import { Api, ENDPOINTS } from '@/core/Api'
import axios from 'axios'
import router from '../Routes'

Vue.use(VueCookies)
axios.defaults.headers.common['Content-Type'] = 'application/json'

const API_URL = process.env.VUE_APP_API_URL
const API_ADMIN_URL = process.env.VUE_APP_ADMIN_API_URL

const setAxiosTokenDefaults = (resp) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${resp.accessToken}`
    axios.defaults.baseURL = API_ADMIN_URL
}
const removeAxiosTokenDefaults = () => {
    axios.defaults.headers.common['Authorization'] = null
    axios.defaults.baseURL = API_URL
}
const setTokenCookie = (resp) => {
    setAxiosTokenDefaults(resp)
    Vue.$cookies.set('silly_user_session', resp, '5d')
}
const removeTokenCookie = () => {
    removeAxiosTokenDefaults()
    Vue.$cookies.remove('silly_user_session')
    router.push('/login')
}

const userSession = Vue.$cookies.get('silly_user_session')
const state = userSession
    ? {
          accessToken: userSession.accessToken,
          refreshToken: userSession.refreshToken,
          user: userSession.user,
      }
    : {}
userSession ? setAxiosTokenDefaults(userSession) : removeAxiosTokenDefaults()

export default {
    namespaced: true,
    state,
    mutations: {
        AUTH_SUCCESS: (state, resp) => {
            state.accessToken = resp.accessToken
            state.refreshToken = resp.refreshToken
            state.user = resp.user
        },
        AUTH_LOGOUT: (state) => {
            state.accessToken = null
            state.refreshToken = null
            state.user = {}
        },
    },
    actions: {
        AUTH_LOGIN: async ({ commit }, options) => {
            const response = await Api.call(ENDPOINTS.login, options)

            if (response.confirmation.toLowerCase() !== 'success') {
                return response
            }
            const result = response.results

            commit('AUTH_SUCCESS', result)
            setTokenCookie(result)

            return true
        },
        AUTH_LOGOUT: async ({ state, commit }) => {
            const options = {
                data: { refreshToken: state.refreshToken },
            }
            const response = await Api.call(ENDPOINTS.logout, options)

            if (response.confirmation.toLowerCase() !== 'success') {
                return response
            }
            commit('AUTH_LOGOUT')

            removeTokenCookie()
            return true
        },
        AUTH_REFRESH_TOKEN: async ({ state, commit }) => {
            const options = {
                data: { refreshToken: state.refreshToken },
            }
            const response = await Api.call(ENDPOINTS.token, options)

            if (response.confirmation.toLowerCase() !== 'success') {
                //Force Logout
                commit('AUTH_LOGOUT')
                removeTokenCookie()

                return false
            }

            const result = response.results
            commit('AUTH_SUCCESS', result)
            setTokenCookie(result)

            return true
        },
    },
}
