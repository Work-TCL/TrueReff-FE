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

interface IAuthDataState {
    loginObj: ILoginInitialState,
    register: IRegisterInitialState,
    forgotPasswordEmail: string;
    otp: string;
}

interface IAuthStoreSetterState {
    setAuthData: <K extends keyof IAuthDataState>(key: K, value: IAuthDataState[K]) => void;
}

export const useAuthStore = create<IAuthDataState & IAuthStoreSetterState>((set) => ({
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
    setAuthData: (key, value) => set({ [key]: value } as Pick<IAuthDataState, typeof key>)
}));