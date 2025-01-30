import * as Yup from "yup";
// import { phone } from "phone";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export interface ILoginSchema extends Yup.Asserts<typeof loginSchema> {}
export const loginWithOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: Yup.string().optional(),
});

export interface ILoginWithOtpSchema
  extends Yup.Asserts<typeof loginWithOtpSchema> {}

export const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
});

export interface IForgotSchema extends Yup.Asserts<typeof forgotSchema> {}

export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string().length(6).required("otp is required"),
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

export interface IResetSchema extends Yup.Asserts<typeof resetPasswordSchema> {}

export const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "First Name must be at least 2 characters")
    .max(50, "First Name must be less than 50 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Last Name must be at least 2 characters")
    .max(50, "Last Name must be less than 50 characters"),
  countryCode: Yup.string().optional(),
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
    .email("Email must be a valid email address")
    .required("Email is required"),
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
  terms: Yup.boolean().default(false),
  subscribe: Yup.boolean().default(true),
});

export interface IRegisterSchema extends Yup.Asserts<typeof registerSchema> {}

// profile update
export const profileSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  dateOfBirth: Yup.string().optional(),
  countryCode: Yup.string().optional(),
  // phone: Yup.string()
  //     .nullable()
  //     .defined().when('countryCode', (countryCode, schema) => {
  //         return schema.test('is-valid-phone', 'Phone number is not valid', function (value) {
  //             if (!value || value?.length <= 3) return true;
  //             if (countryCode?.length > 0) {
  //                 const valid = phone(value, { country: countryCode[0] })
  //                 return valid?.isValid || false
  //             }
  //             return false
  //         });
  //     }),
  gender: Yup.string().optional(),
  profile: Yup.mixed().optional(),
});

export interface IProfileSchema extends Yup.Asserts<typeof profileSchema> {}

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

export const contactSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  type: Yup.string().required("Type is required"),
  message: Yup.string().required("Message is required"),
});

export interface IContactSchema extends Yup.Asserts<typeof contactSchema> {}

// add to wishlist
export const addWishlistSchema = Yup.object().shape({
  listName: Yup.string()
    .required("List Name is required")
    .min(2, "List Name must be at least 2 characters")
    .max(50, "List Name must be less than 50 characters"),
});

export interface IWishlistSchema
  extends Yup.Asserts<typeof addWishlistSchema> {}
