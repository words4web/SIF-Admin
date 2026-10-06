import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import authReducer from "@/store/authSlice";
import notificationReducer from "@/store/notificationSlice";

const authPersistConfig = {
  key: "auth",
  storage: localStorage,
};

const notificationPersistConfig = {
  key: "notification",
  storage: localStorage,
  whitelist: ["isToggledOn"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(
  notificationPersistConfig,
  notificationReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    notification: persistedNotificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
