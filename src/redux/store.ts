import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, Storage } from "redux-persist";
import storage from "redux-persist/lib/storage";
import interviewReducer from "./slices/interviewSlice";
import settingsReducer from "./slices/settingsSlice";

const createNoopStorage = (): Storage => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value: any) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const getStorage = (): Storage => {
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  return storage;
};

const persistConfig = {
  key: "root",
  storage: getStorage(),
  whitelist: ["settings"], 
};

const rootReducer = combineReducers({
  interview: interviewReducer,
  settings: settingsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
