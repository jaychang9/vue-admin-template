const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.sysUser.token,
  sysUser: state => state.sysUser,
  avatar: state => state.sysUser.avatar,
  name: state => state.sysUser.name,
  roles: state => state.sysUser.roles,
  permission_routes: state => state.permission.routes
}
export default getters
