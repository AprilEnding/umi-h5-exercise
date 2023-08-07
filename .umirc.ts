import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {
    mobile: false
  },
  // todo： 高清问题
  // antdMobile:{
  //   hd: true
  // },
  routes: [
    {
      path: '/',
      component: '@/pages/index',
      redirect: '/list/sell'
    },
    {
      path: '/list/:type',
      component: '@/pages/list/index',
    },
    {
      path: '/detail/:id',
      component: '@/pages/detail'
    }
  ],
  fastRefresh: {},
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4523',
        pathRewrite: { '^/api':  '/m1/3116646-0-default' },
      }
    }
  }
});
