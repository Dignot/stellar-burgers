import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getOrdersData, getAllFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getOrdersData);
  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(getAllFeeds())} />
  );
};
