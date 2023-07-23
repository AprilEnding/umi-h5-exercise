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
  ],
  fastRefresh: {},
});
