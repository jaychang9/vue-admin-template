import request from '@/utils/request'

/**
 * 获取路由列表
 */
export function listRoutes() {
  return request({
    url: '/api/mall-admin-web/sys_menu/routes',
    method: 'get'
  })
}
