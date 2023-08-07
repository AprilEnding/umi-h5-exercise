import { extend, ResponseError, RequestOptionsInit } from "umi-request"
import { Toast } from 'antd-mobile'

const codeMessage: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 错误处理 响应码非2xx系列

function errorHandler(error: ResponseError<any>) {
  const { response } = error
  if (response?.status) {
    const errorText = codeMessage[response.status] || response.statusText
    Toast.show({
      content: errorText,
      position: 'top',
      maskClickable: false,
    })
  } else if (!response) {
    Toast.show({
      content: '网络异常，请稍后重试！',
      position: 'top',
      maskClickable: false,
    })
    console.log(error)
  }

  return response
}

// 默认配置
const request = extend({
  prefix: '/api',
  timeout: 60000,
  errorHandler,
})

// 请求拦截器
request.interceptors.request.use((url, options) => {
  const token = localStorage.getItem('authToken')
  return {
    url,
    options: {
      ...options,
      headers: {
        ...(options?.headers || {}),
        Authorization: `Bearer ${token}`,
      }
    }
  }
}, {
  global: false
})

// 响应拦截器
request.interceptors.response.use(async (response) => {
  try {
    const data = await response.clone().json()
    console.log('data', data)
    if (data.responseCode !== '1') {
      Toast.show({
        content: '接口报错了！',
        maskClickable: false,
      })
    }
  } catch (error) {

  }
  return response
}, {
  global: false
})

type Method = 'get' | 'post' | 'delete' | 'put' | 'patch' | 'head' | 'options'

const enhancerRequest = (method: Method) => (url: string) => (options?: RequestOptionsInit) => request[method](url, options)

export default {
  get: enhancerRequest('get'),
  post: enhancerRequest('post'),
  delete: enhancerRequest('delete'),
  put: enhancerRequest('put'),
  patch: enhancerRequest('patch'),
  head: enhancerRequest('head'),
  options: enhancerRequest('options'),
}