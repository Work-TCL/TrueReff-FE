import { create } from 'zustand';

interface ILoginInitialState {
    email: string;
    password: string;
}
interface IRegisterInitialState {
    email: string;
    password: string;
    type: string;
}

const USER_TYPE = {
    USER: "user",
    Vendor: "vendor",
    Creator: "creator",
};

interface IAuthDataState {
    loginObj: ILoginInitialState,
    register: IRegisterInitialState,
    forgotPasswordEmail: string;
    otp: string;
    account: {
        email: string;
        id: string;
        role: typeof USER_TYPE[keyof typeof USER_TYPE]
    },
    isLoading: boolean,
}

interface IAuthStoreSetterState {
    setAuthData: <K extends keyof IAuthDataState>(key: K, value: IAuthDataState[K]) => void;
    setAccountData: (data: {
        email: string;
        id: string;
        role: typeof USER_TYPE[keyof typeof USER_TYPE]
    }) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<IAuthDataState & IAuthStoreSetterState>((set, get) => ({
    loginObj: {
        email: "",
        password: ""
    },
    register: {
        email: "",
        password: "",
        type: "user"
    },
    forgotPasswordEmail: '',
    otp: '',
    account: {
        email: "",
        id: "",
        role: USER_TYPE.USER,
    },
    isLoading: true,
    setAuthData: (key, value) => set({ [key]: value } as Pick<IAuthDataState, typeof key>),
    setAccountData: (data) => set({ account: data }),
    setIsLoading: (isLoading) => set({ isLoading })
}));
