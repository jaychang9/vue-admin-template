import request from '@/utils/request'


export function getList() {
  return request({
    url: '/api/mall-admin-web/table/list',
    method: 'get'
  })
}
