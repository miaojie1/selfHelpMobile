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
    axios.defaults.timeout = 10000
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
      console.log('正确---------------------')
      console.log(config)
      // 在发送请求之前做些什么
      return config
    }, function (error) {
      console.log('错误---------------------')
      console.log(error)
      // 对请求错误做些什么
      return Promise.reject(error)
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
  post: function (url, params, that) {
    return httpApi('POST', url, params, that)
  },
  put: function (url, params) {
    return httpApi('PUT', url, params)
  },
  delete: function (url, params) {
    return httpApi('DELETE', url, params)
  }
}
