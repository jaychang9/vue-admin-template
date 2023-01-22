import { constantRoutes } from '@/router'
import { listRoutes } from '@/api/sys/sysMenu'

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
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterDynamicRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

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
