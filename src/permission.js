import router from '@/router'
import store from '@/store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import '@/router/asyncRouter'
import { getAsyncRoutes } from '@/router/asyncRouter'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  console.log('a')
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const { sysUser } = store.getters
  const hasToken = sysUser.token

  if (!hasToken) {
    console.log('b')
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      console.log('c')
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
    return
  }

  // 已有token了,去登录页，直接给跳转到首页
  if (to.path === '/login') {
    console.log('d')
    // if is logged in, redirect to the home page
    next({
      path: '/'
    })
    NProgress.done()
    return
  }

  // 是否有roles
  const hasGetRoles = sysUser.roles && sysUser.roles.length > 0

  if (hasGetRoles) {
    next()
    return
  }

  // 没有roles
  try {
    const sysUser = await store.dispatch('sysUser/getInfo')
    const accessRoutes = await store.dispatch('permission/generateRoutes', sysUser.roles)
    const routes = getAsyncRoutes(accessRoutes)
    console.log(routes)
    router.addRoutes(routes)
    next({ ...to, replace: true })
  } catch (error) {
    console.log('h')
    // 移除 token 并跳转登录页
    await store.dispatch('sysUser/resetToken')
    console.log(error)
    Message.error('出错请重新尝试')
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
