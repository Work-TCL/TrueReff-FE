import { create } from "zustand";

interface INotificationDataState {
  vendor: { [key: string]: any };
  creator: { [key: string]: any };
}

interface INotificationStoreSetterState {
  setNotificationData: <K extends keyof INotificationDataState>(
    key: K,
    value: any
  ) => void;
}

export const useNotificationStore = create<
  INotificationDataState & INotificationStoreSetterState
>()(
    (set) => ({
      vendor: {
        // Initialize vendor notifications
        collaboration: false
      },
      creator: {
        // Initialize creator notifications
        collaboration: false
      },
      setNotificationData: (key, value) =>
        set({ [key]: value } as Pick<INotificationDataState, typeof key>),
    })
);
