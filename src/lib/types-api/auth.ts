export interface ISignupAPIParams {}

export interface ISignupAPIResponse {
  user: object;
}

export interface IResendOtp {
  email: string;
}

export interface IResetPassword {
  email: string | null;
  password: string;
}

export interface IVerifyOtp {
  email: string | null;
  otpCode: string;
}

export interface ILogin {
  email: string;
  password?: string;
}

export interface IResponse {
  message?: string;
  status?: number;
  data?: object;
  error?: object;
}
