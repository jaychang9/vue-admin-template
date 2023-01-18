import router from '@/router'
import store from '@/store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const {
    sysUser
  } = store.getters
  const hasToken = sysUser.token

  if (!hasToken) {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
    return
  }

  if (to.path === '/login') {
    // if is logged in, redirect to the home page
    next({
      path: '/'
    })
    NProgress.done()
  } else {
    const hasGetRoles = (sysUser.roles || []).length > 0
    if (!hasGetRoles) {
      try {
        console.log('permission.js await sysUser/getInfo')
        // get user info
        await store.dispatch('sys/sysUser/getInfo')
        next()
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('sys/sysUser/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
    next()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
