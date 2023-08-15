import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  antd: {
    mobile: false,
  },
  dva: {
    immer: { enableES5: true },
    hmr: true,
    lazyLoad: true,
  },
  // todo： 高清问题
  // antdMobile:{
  //   hd: true
  // },
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      // redirect: '/list/sell',
      // exact: true,
      routes: [
        {
          path: '/list/:type',
          component: '@/pages/list/index',
          wrappers: ['@/wrappers/authListPage'],
        },
        {
          path: '/detail/:id',
          component: '@/pages/detail',
        },
      ],
    },
    {
      path: '/no-permission',
      component: '@/pages/no-permission',
    },
  ],
  fastRefresh: {},
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:4523',
        pathRewrite: { '^/api': '/m1/3116646-0-default' },
      },
    },
  },
});
