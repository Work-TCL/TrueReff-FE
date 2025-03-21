import { create } from 'zustand';

interface ICreatorDataState {
    creators: any[],
    // isLoading: boolean
}

interface ICreatorStoreSetterState {
    setCreatorData: <K extends keyof ICreatorDataState>(key: K, value: ICreatorDataState[K]) => void;
    // setIsLoading: (isLoading: boolean) => void;
}

export const getCreatorStore = create<ICreatorDataState & ICreatorStoreSetterState>((set, get) => ({
    creators: [],
    setCreatorData: (key, value) => set({ [key]: value } as Pick<ICreatorDataState, typeof key>),
    // setIsLoading: (isLoading) => set({ isLoading })
}));
