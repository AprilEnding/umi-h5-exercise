import { getPermission } from '@/api';
import { Effect, ImmerReducer } from 'umi';

export interface PermissionModelState {
  pagePermission: {
    rentListPage: boolean;
    sellListPage: boolean;
  };
  isLogin: boolean;
}

export interface PermissionModelType {
  namespace: 'permission';
  state: PermissionModelState;
  effects: {
    [key: string]: Effect;
  };
  reducers: {
    [key: string]: ImmerReducer<PermissionModelState>;
  };
}

const PermissionModel: PermissionModelType = {
  namespace: 'permission',
  state: {
    pagePermission: {
      rentListPage: false,
      sellListPage: false,
    },
    isLogin: false,
  },
  reducers: {
    setPagePermission: (state, action) => {
      state.pagePermission = action.payload;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
  effects: {
    *fetchPermission(action, { call, put }) {
      const res = yield call(getPermission, {
        params: { userId: action.payload },
      });
      yield put(setPagePermission(res?.data));
      yield put(setIsLogin(true));
    },
  },
};

export default PermissionModel;

export const setIsLogin = (isLogin: boolean) => ({
  type: 'setIsLogin',
  payload: isLogin,
});

export const setPagePermission = (permission: { [key: string]: boolean }) => ({
  type: 'setPagePermission',
  payload: permission,
});
export const fetchPermission = (userId: string) => ({
  type: 'permission/fetchPermission',
  payload: userId,
});

export const selectPagePermission = (state: {
  permission: PermissionModelState;
}) => {
  return {
    pagePermission: state?.permission?.pagePermission,
    loading: ((state as any)?.loading?.effects || {})[
      'permission/fetchPermission'
    ],
  };
};

export const selectIsLogin = (state: { permission: PermissionModelState }) =>
  state?.permission?.isLogin;
