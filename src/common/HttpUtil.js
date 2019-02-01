import {MessageBox} from 'mint-ui'
var axios = require('axios')
// 本地
// var root = 'http://192.168.4.64:8198/aprilcode-selfhelp/'
// 服务器
// var root = 'http://192.168.248.156:8199/aprilcode-selfhelp/'
// 外网
var root = 'http://hcm.pansoft.com/snape-mobile/'
function httpApi (method, url, params, that) {
  return new Promise((resolve, reject) => {
    // 设置超时时间
    axios.defaults.retry = 4
    axios.defaults.retryDelay = 1000
    axios.defaults.timeout = 20000
    // 添加请求拦截器
    axios.interceptors.request.use(config => {
      // 在发送请求之前做些什么
      return config
    }, error => {
      MessageBox({
        title: '错误',
        message: '请求超时！',
        showCancelButton: true
      })
      // 对请求错误做些什么
      return Promise.reject(error)
    })
    // axios.interceptors.response.use(data => {
    //   if (data.status !== 200) {
    //     MessageBox({
    //       title: '错误',
    //       message: data.data.msg,
    //       showCancelButton: true
    //     })
    //   }
    //   return data
    // }, function axiosRetryInterceptor (err) {
    //   var config = err.config
    //   // If config does not exist or the retry option is not set, reject
    //   if (!config || !config.retry) return Promise.reject(err)
    //   // Set the variable for keeping track of the retry count
    //   config.__retryCount = config.__retryCount || 0
    //   // Check if we've maxed out the total number of retries
    //   if (config.__retryCount >= config.retry) {
    //     // Reject with the error
    //     return Promise.reject(err)
    //   }
    //   // Increase the retry count
    //   config.__retryCount += 1
    //   // Create new promise to handle exponential backoff
    //   var backoff = new Promise(function (resolve) {
    //     setTimeout(function () {
    //       resolve()
    //     }, config.retryDelay || 1)
    //   })
    //   // Return the promise in which recalls axios to retry the request
    //   return backoff.then(function () {
    //     return axios(config)
    //   })
    // }, config => {
    //   console.log(config)
    // })
    axios.interceptors.response.use(data => {
      if (data.status !== 200) {
        MessageBox({
          title: '错误',
          message: data.data.msg,
          showCancelButton: true
        })
      }
      return data
    }, error => {
      if (error.response.status === 504 || error.response.status === 404) {
        MessageBox({
          title: '错误',
          message: '服务器被吃了⊙﹏⊙∥',
          showCancelButton: true
        })
      }
      // 对请求错误做些什么
      return error
    })
    axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: true
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
      if (err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1) {
        that.$messagebox('请求超时！')
      } else {
        that.$messagebox('请求出错了！')
      }
      reject(err)
    })
  })
}
export default{
  get: function (url, params) {
    return httpApi('GET', url, params)
  },
  post: function (url, params) {
    return httpApi('POST', url, params)
  },
  put: function (url, params) {
    return httpApi('PUT', url, params)
  },
  delete: function (url, params) {
    return httpApi('DELETE', url, params)
  }
}
