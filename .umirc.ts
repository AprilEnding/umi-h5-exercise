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
  // todo： 高清
  // antdMobile:{
  //   hd: true
  // },
  routes: [
    {
      path: '/login',
      component: '@/pages/login',
    },
    {
      path: '/no-permission',
      component: '@/pages/no-permission',
    },
    {
      path: '/',
      component: '@/layouts/index',
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
        {
          path: '/404',
          component: '@/pages/404',
          title: '404',
        },
      ],
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
