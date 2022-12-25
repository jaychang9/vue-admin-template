import request from '@/utils/request'


export function getList() {
  return request({
    url: '/api/mall-admin-web/table/list',
    method: 'get'
  })
}

export function getPage(listQuery) {
  const {page,limit} = listQuery
  return request({
    url: '/api/mall-admin-web/table/page',
    method: 'get',
    params: {'current':page,'size':limit}
  })
}
