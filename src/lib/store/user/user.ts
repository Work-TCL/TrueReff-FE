import { create } from 'zustand';

interface IUserStoreInitialState {
    name: string;
}

interface IUserStoreSetterState {
    setUserStore: <K extends keyof IUserStoreInitialState>(key: K, value: IUserStoreInitialState[K]) => void;
}

export const userStore = create<IUserStoreInitialState & IUserStoreSetterState>((set) => ({
    name: '',
    setUserStore: (key, value) => set({ [key]: value } as Pick<IUserStoreInitialState, typeof key>)
}));