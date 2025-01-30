export interface ISignupAPIParams {}

export interface ISignupAPIResponse {
  user: object;
}

export interface IResendOtp {
  email: string;
}

export interface IResetPassword {
  email: string;
  otp: string;
  password: string;
}

export interface IVerifyOtp {
  email: string;
  otp: string;
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
