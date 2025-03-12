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
interface IUserInitialState {
    createdAt: string,
    detailsFilled: boolean,
    email: string,
    isActive: boolean,
    isEmailVerified: boolean,
    name: string,
    token: string | undefined,
    type: string,
    updatedAt: string
    _id: string,
}
interface IAuthDataState {
    loginObj: ILoginInitialState,
    register: IRegisterInitialState,
    user: IUserInitialState,
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
    user: {
        createdAt: "",
        detailsFilled: false,
        email: "",
        isActive: false,
        isEmailVerified: false,
        name: "",
        token: "",
        type: "",
        updatedAt: "",
        _id: "",
    },
    forgotPasswordEmail: '',
    otp: '',
    setAuthData: (key, value) => set({ [key]: value } as Pick<IAuthDataState, typeof key>)
}));