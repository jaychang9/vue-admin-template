const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.sysUser.token,
  avatar: state => state.sysUser.avatar,
  name: state => state.sysUser.name
}
export default getters
