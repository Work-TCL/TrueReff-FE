import { IVendor, IVendorUpdate } from "@/lib/types-api/vendor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IVendorDataState {
  vendor: IVendor | IVendorUpdate;
  vendors: IVendor[];
}

interface IVendorStoreSetterState {
  setVendorData: <K extends keyof IVendorDataState>(
    key: K,
    value: IVendorDataState[K]
  ) => void;
}

export const useVendorStore = create<
  IVendorDataState & IVendorStoreSetterState
>()(
  persist(
    (set, get) => ({
      vendor: {
        vendorId: "",
        accountId: "",
        business_name: "",
        company_email: "",
        company_phone: "",
        gst_number: "",
        website: "",
        type_of_business: "",
        profile_image: "",
        contacts: [],
        omni_channels: [],
        brand_documents: [],
        addresses: [],
      },
      vendors: [],
      setVendorData: (key, value) => {
        if (key === "vendor") {
          set((state) => ({
            vendor: {
              ...state.vendor,
              ...(value as Partial<IVendorUpdate>), // <-- merge only provided keys
            },
          }));
        } else {
          set({ [key]: value } as Pick<IVendorDataState, typeof key>);
        }
      },
    }),
    {
      name: "vendor-storage",
    }
  )
);
