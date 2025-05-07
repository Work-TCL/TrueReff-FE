"use client";
import React, { useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IPreFormSchema, preFormSchema } from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-form";
import ContactDetailsForm from "./components/contact-form";
import ChannelForm from "./components/channel-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { venderRegister } from "@/lib/web-api/auth";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/utils/translate";
import {
  IPostVendorRegisterRequest,
  IPostVendorRegisterResponse,
} from "@/lib/types-api/auth";
import { useVendorStore } from "@/lib/store/vendor";
import axios from "@/lib/web-api/axios";
import { fileUploadLimitValidator } from "@/lib/utils/constants";

let allTabs: {
  id: string;
  name: string;
  Icon: any;
}[] = [
  {
    id: "1",
    name: "Business Information",
    Icon: HiOutlineSquare3Stack3D,
  },
  {
    id: "2",
    name: "Contact Details",
    Icon: GrDocumentText,
  },
  {
    id: "3",
    name: "Omni-channel",
    Icon: FaRegUserCircle,
  },
];

const TABS_STATUS = {
  BASIC_INFO: 0,
  CONTACT_INFO: 1,
  OMNI_CHANNEL: 2,
};

export default function   PreFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setVendorData } = useVendorStore();
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(TABS_STATUS.BASIC_INFO);
  const initialState = {
    state:"",city:"",channels:[]
  }
  const [formState,setFormState] = useState(initialState);
  const methods = useForm<IPreFormSchema>({
    defaultValues: {
      business_name: "",
      company_email: "",
      company_phone: "",
      contacts: [
        {
          name: "",
          phone: "",
          email: "",
        },
        {
          name: "",
          phone: "",
          email: "",
        },
      ],
      gst_number: "",
      type_of_business: "",
      website: "",
      state:"",
      city:"",
      omni_channels: [],
    },
    resolver: yupResolver(preFormSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: IPreFormSchema) => {
    setLoading(true);
    try {
      const payload: IPostVendorRegisterRequest = {
        business_name: data.business_name,
        company_email: data.company_email,
        company_phone: data.company_phone,
        contacts: Array.isArray(data.contacts)
          ? data.contacts
              .map((contact) => ({
                name: contact.name || "", // Ensure name is a string
                phone: contact.phone || "", // Ensure phone is a string
                email: contact.email || "", // Ensure email is a string
              }))
              .filter((v) => v.name && v.email && v.phone)
          : [],
        gst_number: data.gst_number,
        omni_channels: Array.isArray(data.omni_channels)
          ? data.omni_channels.map(ele => ele?.value)
          : [],
        type_of_business: data.type_of_business,
        website: data.website,
        state: data.state,
        city: data.city,
      };
      if (profileFile) {
        payload.profile_image = profileFile;
      }
      const response: IPostVendorRegisterResponse = await venderRegister(
        payload
      );

      if (response?.status === 201) {
        toast.success("Vendor successfully registered.");
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?._id,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          company_phone: response?.data?.company_phone,
          gst_number: response?.data?.gst_number,
          website: response?.data?.website,
          type_of_business: response?.data?.type_of_business,
          contacts: response?.data?.contacts,
          omni_channels: response?.data?.omni_channels,
          brand_documents: response?.data?.brand_documents,
          addresses: response?.data?.addresses,
        });
        router.push("/vendor/dashboard");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerStepper = async () => {
    setLoading(true);
    try {
      if (TABS_STATUS.BASIC_INFO === activeTab) {
        const basicInfoField: any = [
          "business_name",
          "company_email",
          "company_phone",
          "gst_number",
          "website",
          "state",
          "city",
          "type_of_business",
        ];
        

        const isValid = await methods.trigger(basicInfoField);
        const response: any = await axios.get(
          `/auth/vendor/check-exist/${methods.watch("company_email")}`
        );

        const alreadyExists = response?.data?.data?.alreadyExists;
        if (alreadyExists) {
          toast.error("Company Email Already Registered.");
        } else if (isValid && !alreadyExists) {
          setActiveTab(TABS_STATUS.CONTACT_INFO); // Move to next tab
        }
      } else if (TABS_STATUS.CONTACT_INFO === activeTab) {
        const contactInfoField: any = ["contacts"];
        const isValid = await methods.trigger(contactInfoField);

        if (isValid) {
          setActiveTab(TABS_STATUS.OMNI_CHANNEL); // Move to next tab
        }
      }
    } catch (error) {
      toast.error(translate("try_again"));
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    setProfileFile(file);
    setProfilePreview(previewURL);
  };

  const handleOnSelect = (value:any,name: any) => {
    setFormState({...formState,[name]:value})
    if(name === 'state'){
      setFormState({...formState,[name]:value,city:""})
      methods.setValue("city", "");
    }
    methods.setValue(name, value);
    if(value){
      methods.setError(name,{
        type: "manual",
        message: "",
      })
    }
  }

  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-10 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />

      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <SlidingTabBar
          tabs={allTabs}
          setActiveTabIndex={setActiveTab}
          activeTabIndex={activeTab}
          grid={3}
        />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col gap-3 relative"
          >
            {TABS_STATUS.OMNI_CHANNEL === activeTab ? <ChannelForm /> : null}
            {TABS_STATUS.CONTACT_INFO === activeTab ? (
              <ContactDetailsForm />
            ) : null}
            {TABS_STATUS.BASIC_INFO === activeTab ? (
              <BasicInfoForm
                handleImageSelect={handleImageSelect}
                profilePreview={profilePreview}
                handleOnSelect={handleOnSelect}
                formState={formState}
                methods={methods}
              />
            ) : null}
            <div className="bg-white">
              {TABS_STATUS.OMNI_CHANNEL === activeTab ? (
                <Button
                  type="submit"
                  loading={loading}
                  disabled={loading || TABS_STATUS.OMNI_CHANNEL !== activeTab}
                  className="w-fit font-medium px-8"
                  size="small"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type="button"
                  size="small"
                  loading={loading}
                  disabled={loading}
                  className="w-fit font-medium px-8 md:text-base text-sm"
                  onClick={handleTriggerStepper}
                >
                  Save and Continue
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
