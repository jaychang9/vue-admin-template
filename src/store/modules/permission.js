import { constantRoutes } from '@/router'
import { listRoutes } from '@/api/sys/sysMenu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    // route.meta为null或 route.meta.roles为null,说明访问该路由无需检查角色,所以返回true就可以了
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterDynamicRoutes(routes, roles) {
  console.log('filterDynamicRoutes start')
  const res = []
  // 遍历路由数组去重组可用的路由
  routes.forEach(route => {
    const tmp = { ...route }
    // 如果有有权限
    if (hasPermission(roles, tmp)) {
      if (tmp.component) {
        // 判断 item.component 是否等于 'Layout',若是则直接替换成引入的 Layout 组件
        if (tmp.component === 'Layout') {
          tmp.component = Layout
        } else {
          //  tmp.component 不等于 'Layout',则说明它是组件路径地址，因此直接替换成路由引入的方法
          // tmp.component = resolve => require([`@/views/${tmp.component}`], resolve)
          // 此处用reqiure比较好，import引入变量会有各种莫名的错误
          tmp.component = () => import('@/views/system/dict/index')
        }
      }
      if (tmp.children) {
        tmp.children = filterDynamicRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  console.log('filterDynamicRoutes end')
  console.log(res)
  return res
}

const state = { routes: [], addRoutes: [] }

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      listRoutes().then((response) => {
        const dynamicRoutes = response.data
        const accessedRoutes = filterDynamicRoutes(dynamicRoutes, roles)
        console.log('accessedRoutes')
        console.log(accessedRoutes)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
