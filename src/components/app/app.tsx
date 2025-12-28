import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protectedRoute';
import {
  ConstructorPage,
  Feed,
  Profile,
  ProfileOrders,
  Login,
  ForgotPassword,
  ResetPassword,
  Register,
  NotFound404
} from '@pages';
import { useEffect } from 'react';
import { useDispatch } from '../../services/store';
import { getIngredients } from '../../services/slices/ingredientsSlice';
import { getUserAuth, getUserOrders } from '../../services/slices/userSlice';
import { getAllFeeds } from '../../services/slices/feedSlice';

const App = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const backgroundLocation = location?.state?.background;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getAllFeeds());
    dispatch(getUserAuth());
    dispatch(getUserOrders());
  }, [dispatch]);
  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal title={''} onClose={() => navigate('/feed')}>
              <OrderInfo />
            </Modal>
          }
        />

        <Route
          path='/ingredients/:id'
          element={
            <Modal title={'Детали ингредиента'} onClose={() => navigate('/')}>
              <IngredientDetails />
            </Modal>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <Modal title={''} onClose={() => navigate('/profile/orders')}>
                <OrderInfo />
              </Modal>
            </ProtectedRoute>
          }
        />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />

        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={'Детали ингредиента'} onClose={() => navigate('/')}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={''} onClose={() => navigate('/profile/orders')}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
