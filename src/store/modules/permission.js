import { constantRoutes, route404 } from '@/router'
import { listRoutes } from '@/api/sys/sysMenu'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  console.log('hasPermission', roles, route)
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
export function filterAsyncRoutes(routes, roles) {
  console.log('filterAsyncRoutes start')
  const res = []
  // 遍历路由数组去重组可用的路由
  routes.forEach(route => {
    // route如果为undefined，那么tmp = { ...route } 相当于 tmp = {}
    const tmp = { ...route }
    console.log('tmp', tmp)
    // 如果有有权限
    if (hasPermission(roles, tmp)) {
      if (tmp.component) {
        // 判断 item.component 是否等于 'Layout',若是则直接替换成引入的 Layout 组件
        if (tmp.component === 'Layout') {
          tmp.component = Layout
        } else {
          console.log('创建动态路由' + tmp.component)
          //  tmp.component 不等于 'Layout',则说明它是组件路径地址，因此直接替换成路由引入的方法
          // 此处用reqiure比较好，import引入变量会有各种莫名的错误
          const componentStr = `views/${tmp.component}`
          tmp.component = (resolve) => require([`@/${componentStr}.vue`], resolve)
        }
      }
      if (tmp.children && tmp.children.length > 0) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  console.log('filterAsyncRoutes end')
  console.log(res)
  return res
}

const state = { routes: [], addRoutes: [] }

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    // ['a','b'].concat([]) => ['a','b']
    state.routes = constantRoutes.concat(routes).concat(route404)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve, reject) => {
      listRoutes().then((response) => {
        // 后端返回的登录用户可访问的路由列表,即动态路由
        const dynamicRoutes = response.data
        let accessedRoutes
        // 超级管理员角色ROOT 拥有所有菜单权限
        if (roles.includes('ROOT')) {
          accessedRoutes = dynamicRoutes || []
        } else {
          accessedRoutes = filterAsyncRoutes(dynamicRoutes, roles)
        }
        console.log('generateRoutes', accessedRoutes)
        // commit('SET_ROUTES')时accessedRoutes不能带静态路由信息
        commit('SET_ROUTES', accessedRoutes)
        // 带上静态路由信息
        // accessedRoutes = constantRoutes.concat(accessedRoutes).concat(route404)
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
