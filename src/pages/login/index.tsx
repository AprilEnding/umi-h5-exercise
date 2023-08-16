import React, { useEffect } from 'react';
import {
  useDispatch,
  fetchPermission,
  selectPagePermission,
  useSelector,
  Redirect,
} from 'umi';

export default function Login() {
  const dispatch = useDispatch();
  const { loading } = useSelector(selectPagePermission);

  useEffect(() => {
    dispatch(fetchPermission('3'));
  }, []);

  return loading ? <div>login...</div> : <Redirect to="/list/sell"></Redirect>;
}
