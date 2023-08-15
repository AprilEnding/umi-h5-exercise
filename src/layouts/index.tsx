import React, { PropsWithChildren, useEffect } from 'react';
import {
  useDispatch,
  fetchPermission,
  selectPagePermission,
  useSelector,
  history,
} from 'umi';

export default function Layout(props: PropsWithChildren<any>) {
  const dispatch = useDispatch();
  const { pagePermission, loading } = useSelector(selectPagePermission);

  useEffect(() => {
    dispatch(fetchPermission('3'));
  }, []);

  return loading ? <div>loading...</div> : <>{props.children}</>;
}
