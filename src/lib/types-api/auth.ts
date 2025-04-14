// POST SignUp
export interface IPostSignupRequest {
  email: string;
  password: string;
}
export interface IPostSignupResponse {
  status: number;
  data: {
    id: string;
    otpSent?: boolean;
    type: "user" | "vendor" | "creator";
  };
}

// POST Login
export interface IPostLoginRequest {
  email: string;
  password?: string;
}
export interface IPostLoginResponse {
  status: number;
  data: {
    id: string;
    token?: string;
    otpSent?: boolean;
    type: string;
    detailsFilled?: boolean;
    creator?: ICreator;
  };
}
interface IContacts {
  name: string;
  phone: string;
  email: string;
  isDefault: boolean;
  _id: string;
}
interface IVendor {
  _id: string;
  accountId: string;
  business_name: string;
  company_email: string;
  company_phone: string;
  gst_number: string;
  website: string;
  type_of_business: string;
  contacts: IContacts[];
  omni_channels: string[];
  brand_documents: any[];
  addresses: any[];
  createdAt: string;
  updatedAt: string;
}

interface ICreator {
  _id: string;
  accountId: string;
  full_name: string;
  user_name: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  tags: string[];
  category: string[];
  sub_category: string[];
  profile_image: string;
  banner_image: string;
  channels: string[];
  completed: number;
  createdAt: string;
  updatedAt: string;
}
export interface IGetUserResponse {
  status: number;
  data: {
    _id: string;
    name: string;
    email: string;
    password: string;
    type: string;
    isActive: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    vendor?: IVendor;
    creator?: ICreator;
  };
}

// POST Verify Email
export interface IPostVerifyEmailRequest {
  email?: string;
  otpCode: string;
}
export interface IPostVerifyEmailResponse {
  status: number;
  data: {
    id: string;
    token: string;
    type: "user" | "vendor" | "creator";
  };
}

// POST Verify OTP
export interface IPostVerifyOTPRequest {
  email: string;
  otpCode: string;
}
export interface IPostVerifyOTPResponse {
  status: number;
  data: {
    id: string;
    message: string;
  };
}

// POST Forgot Password
export interface IPostForgotPasswordRequest {
  email: string;
}
export interface IPostForgotPasswordResponse {
  status: number;
  data: {
    id: string;
    message: string;
  };
}

// POST Resend OTP
export interface IPostResendOtpRequest {
  email: string;
}
export interface IPostResendOtpResponse {
  status: number;
  data: {};
}

// POST Reset Password
export interface IPostResetPasswordRequest {
  email: string;
  password: string;
}
export interface IPostResetPasswordResponse {
  status: number;
  data: {
    message: string;
  };
}

// POST Contact US

export interface IPostContactUsRequest {
  firstName: string;
  email: string;
  type: string;
  message: string;
}
export interface IPostContactUsResponse {
  status: number;
  data: {
    message: string;
  };
}

// POST Vendor Register
export interface IPostVendorRegisterRequest {
  business_name: string;
  company_email: string;
  company_phone: string;
  gst_number: string;
  website: string;
  type_of_business: string;
  contacts: {
    name: string;
    phone: string;
    email: string;
  }[];
  omni_channels: string[];
  profile_image?: any;
}
// POST Creator Register
export interface IPostCreatorRegisterRequest {
  full_name: string;
  user_name: string;
  // email: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  tags: string[];
  category: string[];
  sub_category: string[];
  profile_image?: any;
  banner_image?: any;
  // channels: {
  //   account_name: string;
  //   handle_name: string;
  //   account_link: string;
  // }[]
}
export interface IPutUpdateCreatorResponse {
  status: number;
  data: ICreator;
}
// PUT Creator Update
export interface IPutUpdateCreatorRequest {
  full_name: string;
  user_name: string;
  // email: string;
  phone: string;
  title: string;
  long_description: string;
  short_description: string;
  tags: string[];
  category: string[];
  sub_category: string[];
  profile_image: any;
  banner_image: any;
  // channels: {
  //   account_name: string;
  //   handle_name: string;
  //   account_link: string;
  // }[]
}
export interface IPostVendorRegisterResponse {
  status: number;
  data: IVendor;
}

// POST Creator Register
// export interface IPostCreatorRegisterRequest {
//   business_name: string;
//   company_email: string;
//   company_phone: string;
//   gst_number: string;
//   website: string;
//   type_of_business: string;
//   contacts: {
//     name: string;
//     phone: string;
//     email: string;
//   }[];
//   omni_channels: string[];
// }

export interface IPostCreatorRegisterResponse {
  status: number;
  data: ICreator;
}

export interface IGetCategoryParams {
  page?: string | number;
  limit?: string | number;
}

export interface ICategoryData {
  _id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}
export interface IGetCategoryResponse {
  status: number;
  message: string;
  data: {
    data: ICategoryData[];
    count: number;
  };
  error: string;
}

export interface IGetCreatorProgressResponse {
  completed: number;
  accountId?: string;
  banner_image?: string;
  profile_image?: string;
  long_description?: string;
  short_description?: string;
  title?: string;
  user_name?: string;
  _id?: string;
  phone?: string;
  full_name?: string;
  category?: string[];
  sub_category?: string[];
  channels?: string[];
  tags?: string[];
}
export interface IPostCreatorCheckExistRequest {
  user_name: string;
}
export interface IPostCreatorCheckExistResponse {
  _id?: string;
}
