import request from '@/utils/request'

export function login(data) {
  data = Object.assign(data, { 'grant_type': 'password', 'scope': 'all', 'client_id': 'mall-admin-web', 'client_secret': '123456' })
  return request({
    url: '/api/meeleet-auth/oauth/token',
    method: 'post',
    params: data
  })
}

export function getInfo() {
  return request({
    url: '/api/mall-admin-web/sys_user/me',
    method: 'get'
  })
}

export function logout() {
  console.log('invoke sysUser api logout')
  return request({
    url: '/api/meeleet-auth/oauth/logout',
    method: 'post'
  })
}
