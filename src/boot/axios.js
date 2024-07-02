import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VITE_INV_SERVCE_API,
  headers: {
    Accept: ['application/json'],
    'Access-Control-Allow-Origin': '*'
  }
})

// axios interceptor to handle token/security authorization being added to our requests
api.interceptors.request.use((config) => {
  // check if we have a user in localstorage and if that user has an auth based token
  const userAuth = JSON.parse(localStorage.getItem('user'))
  if (userAuth && userAuth.token) {
    // if there is an access token in our stored user we attach that to our requests
    config.headers.Authorization = 'Bearer ' + userAuth.token
  }
  return config
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

// exposes our api reference to areas outside of the vue files such as pinia
export { api }
