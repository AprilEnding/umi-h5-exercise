import React, { PropsWithChildren } from 'react';
import {
  Redirect,
  useLocation,
  useParams,
  useSelector,
  selectPagePermission,
} from 'umi';

export default function AuthListPage(props: PropsWithChildren<any>) {
  const location = useLocation();
  const { type } = useParams() as { type: 'rent' | 'sell' };
  const { pagePermission, loading } = useSelector(selectPagePermission);

  // console.log('location', location)
  console.log('type', type);
  console.log('pagePermission', pagePermission);
  console.log('loading', loading);

  console.log(
    '===>',
    (type === 'rent' && pagePermission.rentListPage && loading === false) ||
      (type === 'sell' && pagePermission.sellListPage && loading === false),
  );

  if (
    (type === 'rent' && pagePermission.rentListPage && loading === false) ||
    (type === 'sell' && pagePermission.sellListPage && loading === false)
  ) {
    return <>{props.children}</>;
  } else {
    return <Redirect to="/no-permission" />;
  }
}
