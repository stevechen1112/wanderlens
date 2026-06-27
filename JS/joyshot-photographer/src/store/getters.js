const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.profile.token,
    username: state => state.user.username,
    userId: state => state.user.userId,
    menus: state => state.login.userMenus,
    userInfo: state => state.login.userInfo,
}
export default getters
