import { init, RematchDispatch, RematchRootState } from '@rematch/core';
import { models, RootModel } from './models';
import loading, { ExtraModelsFromLoading } from '@rematch/loading';
import persistPlugin from "@rematch/persist";
import storage from "redux-persist/lib/storage";

type FullModel = ExtraModelsFromLoading<RootModel>;

const persistConfig = {
  key: "root",
  storage,
  version: 2
};

export const store = init<RootModel, FullModel>({
  models,
  plugins: [loading(), persistPlugin(persistConfig)]
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
