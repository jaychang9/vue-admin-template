const articles = [
  {
    id: 1,
    title: '文章标题1',
    publicTime: '2022-12-01 10:33:33',
    author: '作者1'
  },
  {
    id: 2,
    title: '文章标题2',
    publicTime: '2022-12-02 12:33:33',
    author: '作者2'
  }
]

module.exports = [
  // getList 的 mock
  {
    // url 必须能匹配你的接口路由
    // 比如 getList 对应的路由是 /vue-admin-template/article/list
    // 所以你需要通过正则来进行匹配
    url: '/vue-admin-template/article/list',
    type: 'get', // 必须和你接口定义的类型一样
    response: (req, res) => {
      // 返回的结果
      // req and res detail see
      // https://expressjs.com/zh-cn/api.html#req
      return {
        code: 20000,
        data: articles
      }
    }
  }
]

