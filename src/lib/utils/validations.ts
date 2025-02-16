import * as Yup from "yup";
// import { translate } from "./translate";
// import { phone } from "phone";
function translate(value: string) {
  return value;
}
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
  password: Yup.string()
    .required(translate("Password is required"))
    .min(8, translate("Password must be at least 8 characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password must contain at least one number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password must contain at least one lowercase letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password must contain at least one uppercase letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password must contain at least one special character")
    ),
});

export interface ILoginSchema extends Yup.Asserts<typeof loginSchema> {}
export const loginWithOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
  password: Yup.string().optional(),
});

export interface ILoginWithOtpSchema
  extends Yup.Asserts<typeof loginWithOtpSchema> {}

export const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
});

export interface IForgotSchema extends Yup.Asserts<typeof forgotSchema> {}

export const otpSchema = Yup.object().shape({
  otpCode: Yup.string()
    .matches(/^\d+$/, translate("OTP must be a number"))
    .length(6, translate("OTP must be exactly 6 digits"))
    .required(translate("OTP is required")),
});
export interface IOtpSchema extends Yup.Asserts<typeof otpSchema> {}

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(translate("Password is required"))
    .min(8, translate("Password must be at least 8 characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password must contain at least one number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password must contain at least one lowercase letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password must contain at least one uppercase letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password must contain at least one special character")
    ),
  confirmPassword: Yup.string()
    .required(translate("Confirm Password is required"))
    .oneOf([Yup.ref("password")], translate("Passwords must match")),
});

export interface IResetSchema extends Yup.Asserts<typeof resetPasswordSchema> {}

export const registerSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .required("First Name is required")
  //   .min(2, "First Name must be at least 2 characters")
  //   .max(50, "First Name must be less than 50 characters"),
  // lastName: Yup.string()
  //   .required("Last Name is required")
  //   .min(2, "Last Name must be at least 2 characters")
  //   .max(50, "Last Name must be less than 50 characters"),
  // countryCode: Yup.string().optional(),
  // phone: Yup.string()
  //     .nullable()
  //     .defined().when('countryCode', (countryCode, schema) => {
  //         return schema.test('is-valid-phone', 'Phone number is not valid', function (value) {
  //             if (!value || value?.length <= 3) return true;
  //             if (countryCode?.length > 0) {
  //                 // const valid = phone(value, { country: countryCode[0] })
  //                 return valid?.isValid || false
  //             }
  //             return false
  //         });
  //     }),
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
  password: Yup.string()
    .required(translate("Password is required"))
    .min(8, translate("Password must be at least 8 characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password must contain at least one number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password must contain at least one lowercase letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password must contain at least one uppercase letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password must contain at least one special character")
    ),
  // confirmPassword: Yup.string()
  //   .required("Confirm Password is required")
  //   .oneOf([Yup.ref("password")], "Passwords must match"),
  terms: Yup.boolean().oneOf([true]),
  // subscribe: Yup.boolean().default(true),
});

export interface IRegisterSchema extends Yup.Asserts<typeof registerSchema> {}

export const _validatePhone = (number: string, format: string) => {
  if (
    !(format !== String(number).replace(/[0-9]/g, ".")) ||
    format?.split(" ")[0]?.length === number?.length
  ) {
    return true;
  } else {
    return false;
  }
};

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Current Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Current Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Current Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Current Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Current Password must contain at least one special character"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export interface IChangePasswordSchema
  extends Yup.Asserts<typeof changePasswordSchema> {}

// add to wishlist
export const preFormSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business Name is required")
    .min(2, "Business Name must be at least 2 characters"),
  company_email: Yup.string()
    .email()
    .lowercase()
    .required("Company Email is required"),
  company_phone: Yup.string().required("Company Phone is required"),
  gst_number: Yup.string().required("GST Number is required"),
  website: Yup.string().url().required("Website is required"),
  type_of_business: Yup.string().required("Type of business is required"),
  contacts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    })
  ),
  omni_channels: Yup.array()
    .of(Yup.string().required("Channel is required"))
    .min(1, "At least one channel is required"),
});

export interface IPreFormSchema extends Yup.Asserts<typeof preFormSchema> {}

export const contactSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  type: Yup.string().required("Type is required"),
  message: Yup.string().required("Message is required"),
});

export interface IContactSchema extends Yup.Asserts<typeof contactSchema> {}

export const profileUpdateSchema = Yup.object().shape({
  name: Yup.string().required(translate("Name is required")),
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
  phone: Yup.string().required("Phone is required"),
});

export interface IProfileUpdateSchema
  extends Yup.Asserts<typeof profileUpdateSchema> {}
