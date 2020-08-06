import axios from 'axios'
import store from '../store'

export const ENDPOINTS = Object.freeze({
    /* Auth Endpoints */
    token: { url: 'token', method: 'POST' },
    register: { url: 'register-admin', method: 'POST' },
    forgotPassword: { url: 'forgot-password', method: 'POST' },
    resetPassword: { url: 'reset-password', method: 'POST' },
    hasAdmin: { url: 'has-admin', method: 'GET' },
    login: { url: 'login', method: 'POST' },
    logout: { url: 'sign-out', method: 'POST' },

    /* Project Endpoints */
    getProjects: { url: 'projects', method: 'GET' },
    deleteProject: { url: 'projects', method: 'DELETE' },
    removeCategory: { url: 'remove-category', method: 'POST' },
    addCategory: { url: 'add-category', method: 'POST' },
    removePermission: { url: 'remove-permission', method: 'POST' },

    /* Categories */
    getCategories: { url: 'get-categories', method: 'GET' },
    createCategory: { url: 'categories', method: 'POST' },
    deleteCategory: { url: 'categories', method: 'DELETE' },
    updateCategory: { url: 'categories', method: 'PUT' },

    /* Permissions */
    getPermissions: { url: 'get-default-permissions', method: 'GET' },
    createPermission: { url: 'permissions', method: 'POST' },
    deletePermission: { url: 'permissions', method: 'DELETE' },
    updatePermission: { url: 'permissions', method: 'PUT' },

    /* User Endpoints */
    getAdmins: { url: 'get-admins', method: 'GET' },
    getUsers: { url: 'get-users', method: 'GET' },
    getUser: { url: 'users', method: 'GET' },
    createUser: { url: 'users', method: 'POST' },
    deleteUser: { url: 'users', method: 'DELETE' },
    updateUser: { url: 'update-profile', method: 'PUT' },
    updatePassword: { url: 'update-password', method: 'PUT' },
    updateAvatar: { url: 'update-avatar', method: 'PUT' },
})

export const Api = {
    /**
     * @param { string } resource - Endpoint Resource
     * @param { object } options -  Api options { data: object, params: array, query: object  }
     */
    call: async (resource, options = {}) => {
        let expiredToken = false
        const { data, params, query, headers } = options

        const axiosOpt = {
            url: resource.url,
            method: resource.method,
        }

        if (headers) axiosOpt.headers = headers

        if (data) axiosOpt.data = data
        if (params) {
            params.forEach((elem) => {
                axiosOpt.url += `/${elem}`
            })
        }
        if (query) {
            Object.keys(query).forEach((elem, index) => {
                let connector = '&'
                if (index === 0) connector = '?'
                axiosOpt.url += `${connector}${elem}=${query[elem]}`
            })
        }

        try {
            const response = await axios(axiosOpt)
            return response.data
        } catch (err) {
            const errData = err.response.data || { confirmation: 'fail', message: 'Something went wrong!' }
            const originalRequest = err.response.config
            const status = err.response.status

            if (originalRequest.url.includes('token')) {
                return errData
            }
            if (status === parseInt(process.env.VUE_APP_ERROR_CODE_TOKEN)) {
                expiredToken = true
            } else {
                return errData
            }
        }
        if (expiredToken) {
            const isRefreshed = await store.dispatch('auth/AUTH_REFRESH_TOKEN')
            if (isRefreshed) {
                return await Api.call(resource, options)
            }
        }
    },
}

export default { Api, ENDPOINTS }