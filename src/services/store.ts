import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector
} from 'react-redux';

import { ingredientsSliceReducer } from './slices/ingredientsSlice';
import { burgerConstructorSliceReducer } from './slices/burgerConstrSlice';
import { userSliceReducer } from './slices/userSlice';
import { feedsSliceReducer } from './slices/feedSlice';
export const rootReducer = combineReducers({
  ingredients: ingredientsSliceReducer,
  constructorItems: burgerConstructorSliceReducer,
  auth: userSliceReducer,
  feeds: feedsSliceReducer
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useReduxDispatch;
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export default store;
