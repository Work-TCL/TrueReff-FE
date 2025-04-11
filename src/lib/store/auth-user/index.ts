import { create } from "zustand";
import { persist } from "zustand/middleware";

const USER_TYPE = {
  USER: "user",
  Vendor: "vendor",
  Creator: "creator",
};

interface IAuthDataState {
  account: {
    name: string;
    email: string;
    id: string;
    role: (typeof USER_TYPE)[keyof typeof USER_TYPE];
  };
  status: string;
  token: string;
}

interface IAuthStoreSetterState {
  setAccountData: (data: {
    name: string;
    email: string;
    id: string;
    role: (typeof USER_TYPE)[keyof typeof USER_TYPE];
  }) => void;
  setIsAuthStatus: (
    status: "unauthanticated" | "loading" | "authanticated"
  ) => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<IAuthDataState & IAuthStoreSetterState>()(
  persist(
    (set, get) => ({
      account: {
        name: "",
        email: "",
        id: "",
        role: USER_TYPE.Vendor,
      },
      token: "",
      status: "unauthanticated",
      setAccountData: (data) => set({ account: data }),
      setIsAuthStatus: (
        status: "unauthanticated" | "loading" | "authanticated"
      ) => set({ status }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "user-storage",
    }
  )
);
