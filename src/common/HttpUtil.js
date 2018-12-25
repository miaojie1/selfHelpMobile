var axios = require('axios')
// 本地
// var root = 'http://192.168.4.64:8198/aprilcode-selfhelp/'
// 服务器
// var root = 'http://192.168.248.156:8199/aprilcode-selfhelp/'
// 外网
var root = 'http://hcm.pansoft.com/snape-mobile/'
function httpApi (method, url, params) {
  return new Promise((resolve, reject) => {
    // 执行代码
    axios({
      method: method,
      url: url,
      data: method === 'POST' || method === 'PUT' ? params : null,
      params: method === 'GET' || method === 'DELETE' ? params : null,
      baseURL: root,
      withCredentials: false
    // then,catch后为处理结果
    }).then((res) => {
      resolve(res)
    }).catch((err) => {
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
