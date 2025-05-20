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
    status: "unauthenticated" | "loading" | "authenticated"
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
        role: "",
      },
      token: "",
      status: "unauthenticated",
      setAccountData: (data) => set({ account: data }),
      setIsAuthStatus: (
        status: "unauthenticated" | "loading" | "authenticated"
      ) => set({ status }),
      setToken: (token: string) => set({ token }),
    }),
    {
      name: "user-storage",
    }
  )
);
