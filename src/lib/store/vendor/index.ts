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
        category: [],
        sub_category: [],
        completed_step: 0,
        contacts: [],
        business_name: "",
        company_email: "",
        pin_code: "",
        type_of_business: "",
        website: "",
        state: "",
        city: "",
        address: "",
        profile_image: "",
        banner_image: "",
        createdAt: "",
        updatedAt: "",
        channelConfig: {
          domain: "",
          name: "",
          shopify_store_id: 0,
          access_token: "",
        },
        channelId: "",
        channelStatus: "",
        channelType: "",
        gst_certificate: "",
        gst_number: "",
        pan_number: ""
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
