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
        email: "",
        phone: "",
        dob: "",
        gender: "",
        state: "",
        city: "",
        category: [],
        sub_category: [],
        tags: [],
        channels: [],
        completed_step: 2,
        status: "IN_PROGRESS",
        createdAt: "",
        updatedAt: "",
        completed: 0,
        instagram_link: "",
        youtube_link: "",
        banner_image: "",
        profile_image: "",
        store_description: "",
        store_name: "",
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
