import {
  getUserApi,
  TRegisterData,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  getOrdersApi,
  orderBurgerApi,
  TAuthResponse
} from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';

import { TOrder } from '@utils-types';
import { RootState } from '../store';

export const initialState: Pick<TAuthResponse, 'user' | 'success'> & {
  orders: TOrder[];
  lastOrder: TOrder | null;
  orderRequestData: boolean;
  loading: boolean;
} = {
  success: false,
  user: {
    email: '',
    name: ''
  },
  orders: [],
  lastOrder: null,
  orderRequestData: false,
  loading: false
};

export const getUserAuth = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: Omit<TRegisterData, 'name'>) =>
    await loginUserApi({ email, password })
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const updateUserData = createAsyncThunk(
  'user/updateUserData',
  async (user: Partial<TRegisterData>) => await updateUserApi(user)
);

export const userLogout = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const getUserOrders = createAsyncThunk('user/getUserOrders', async () =>
  getOrdersApi()
);

export const newUserOrder = createAsyncThunk(
  'user/newUserOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    makeLoginUserSuccess: (state, action) => {
      state.success = action.payload;
    },
    setLastOrder: (state, action) => {
      state.lastOrder = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAuth.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(getUserAuth.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(getUserAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.success;
        state.user = action.payload.user;
      })

      .addCase(userLogout.pending, (state) => {
        state.loading = true;
        state.success = false;
      })
      .addCase(userLogout.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
      })
      .addCase(userLogout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = false;
        state.user = initialState.user;
      })

      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })

      .addCase(newUserOrder.pending, (state) => {
        state.loading = true;
        state.orderRequestData = true;
      })
      .addCase(newUserOrder.rejected, (state, action) => {
        state.loading = false;
        state.orderRequestData = false;
      })
      .addCase(newUserOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload.order);
        state.lastOrder = action.payload.order;
        state.orderRequestData = false;
      });
  }
});

const userSliceSelectors = (state: RootState) => state.auth;

export const getUserAuthStatus = createSelector(
  [userSliceSelectors],
  (state) => state.success
);

export const getIsAuthLoading = createSelector(
  [userSliceSelectors],
  (state) => state.loading
);

export const getUser = createSelector(
  [userSliceSelectors],
  (state) => state.user
);

export const getOrders = createSelector(
  [userSliceSelectors],
  (state) => state.orders
);

export const getOrderRequestStatus = createSelector(
  [userSliceSelectors],
  (state) => state.orderRequestData
);

export const getLastOrder = createSelector(
  [userSliceSelectors],
  (state) => state.lastOrder
);

export const { makeLoginUserSuccess, setLastOrder } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
