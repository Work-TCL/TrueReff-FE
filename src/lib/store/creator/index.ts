import { ICreator } from "@/lib/types-api/creator";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ICreatorDataState {
  creator: ICreator;
  creators: ICreator[];
}

interface ICreatorStoreSetterState {
  setCreatorData: <K extends keyof ICreatorDataState>(
    key: K,
    value: ICreatorDataState[K]
  ) => void;
}

export const useCreatorStore = create<
  ICreatorDataState & ICreatorStoreSetterState
>()(
  persist(
    (set, get) => ({
      creator: {
        creatorId: "",
        accountId: "",
        full_name: "",
        user_name: "",
        title: "",
        phone: "",
        banner_image: "",
        profile_image: "",
        category: [],
        sub_category: [],
        tags: [],
        channels: [],
        completed: 0,
        short_description: "",
        long_description: "",
      },
      creators: [],
      setCreatorData: (key, value) =>
        set({ [key]: value } as Pick<ICreatorDataState, typeof key>),
    }),
    {
      name: "creator-storage",
    }
  )
);
