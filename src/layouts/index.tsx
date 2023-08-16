import React, { PropsWithChildren } from 'react';
import { useSelector, Redirect, selectIsLogin } from 'umi';

export default function Layout(props: PropsWithChildren<any>) {
  const isLogin = useSelector(selectIsLogin);

  return isLogin ? <>{props.children}</> : <Redirect to="/login" />;
}
