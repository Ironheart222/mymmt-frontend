import { combineReducers, configureStore, Draft, PayloadAction } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice';
import parentReducer from './slices/parentSlice';
import childReducer from './slices/childSlice';
import notificationReducer from './slices/notificationSlice';
import apolloClientReducer from './slices/apolloClientSlice';
import childLessonReducer from './slices/lessonSlice';
import loadingReducer from './slices/loadingSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import calendarReducer from './slices/admin/calendarSlice';
import adminReducer from './slices/admin/adminAuthSlice';
import lessonReducer from './slices/admin/lessonSlice';
import discountReducer from './slices/admin/DiscountSlice';
import adminSubscriptionSlice from './slices/admin/subscription';
import analyticsSlice from './slices/admin/anlyaticsSlice';
import resourceSlice from './slices/admin/resourceSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const combinedReducer = combineReducers({
  apolloClientReducer,
  userReducer,
  notificationReducer,
  parentReducer,
  childReducer,
  adminReducer,
  calendarReducer,
  loadingReducer,
  lessonReducer,
  childLessonReducer,
  discountReducer,
  subscriptionSlice,
  adminSubscriptionSlice,
  analyticsSlice,
  resourceSlice
});

const rootReducer = (state: Draft<any>, action: PayloadAction<any>) => {
  if (action.type === 'client/logout' || action.type === 'admin_client/adminLogout') {
    state = undefined;
  }
  return combinedReducer(state,action);
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
