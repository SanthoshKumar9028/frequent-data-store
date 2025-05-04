import { createContext } from "react";
import { IGroup, ISnippetCategory } from "../models";
import { BaseStore } from "../store-manager/base-store";

export interface IGlobalStores {
  groupStore: BaseStore<IGroup>;
  snippetCategoryStore: BaseStore<ISnippetCategory>;
}

export interface IGlobalProviderState extends IGlobalStores {
  groups: IGroup[];
  snippetCategories: ISnippetCategory[];
  loadGroups: () => Promise<IGroup[]>;
  loadSnippetCategory: () => Promise<ISnippetCategory[]>;
}

export const defaultStoreValue: IGlobalStores = {
  groupStore: new BaseStore<IGroup>(),
  snippetCategoryStore: new BaseStore<ISnippetCategory>(),
};

export const defaultGlobalValue: IGlobalProviderState = {
  ...defaultStoreValue,
  groups: [],
  snippetCategories: [],
  loadGroups: async () => [],
  loadSnippetCategory: async () => [],
};

export const GlobalProvider =
  createContext<IGlobalProviderState>(defaultGlobalValue);
