import request from '@/utils/request'

export function login(data) {
  data = Object.assign(data, { 'grant_type': 'password', 'scope': 'all', 'client_id': 'mall-admin-web', 'client_secret': '123456' })
  return request({
    url: '/api/meeleet-auth/oauth/token',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// TODO
  return {}
}

export function logout() {
  return request({
    url: '/api/meeleet-auth/oauth/logout',
    method: 'post'
  })
}
