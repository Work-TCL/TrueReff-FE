import * as Yup from "yup";
// import { translate } from "./translate";
// import { phone } from "phone";
function translate(value: string) {
  return value;
}
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email_must_be_a_valid_email_address"))
    .required(translate("Email_is_required")),
  password: Yup.string()
    .required(translate("Password_is_required"))
    .min(8, translate("Password_must_be_at_least_8_characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password_must_contain_at_least_one_number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password_must_contain_at_least_one_lowercase_letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password_contain_at_least_one_uppercase_letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password_must_contain_at_least_one_special_character")
    ),
});

export interface ILoginSchema extends Yup.Asserts<typeof loginSchema> {}
export const loginWithOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email_must_be_a_valid_email_address"))
    .required(translate("Email_is_required")),
  password: Yup.string().optional(),
});

export interface ILoginWithOtpSchema
  extends Yup.Asserts<typeof loginWithOtpSchema> {}

export const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email(translate("Email_must_be_a_valid_email_address"))
    .required(translate("Email_is_required")),
});

export interface IForgotSchema extends Yup.Asserts<typeof forgotSchema> {}

export const otpSchema = Yup.object().shape({
  otpCode: Yup.string()
    .matches(/^\d+$/, translate("OTP_must_be_a_number"))
    .length(6, translate("OTP_must_be_exactly_6_digits"))
    .required(translate("OTP_is_required")),
});
export interface IOtpSchema extends Yup.Asserts<typeof otpSchema> {}

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(translate("Password_is_required"))
    .min(8, translate("Password_must_be_at_least_8_characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password_must_contain_at_least_one_number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password_must_contain_at_least_one_lowercase_letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password_contain_at_least_one_uppercase_letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password_must_contain_at_least_one_special_character")
    ),
  confirmPassword: Yup.string()
    .required(translate("Confirm_Password_is_required"))
    .oneOf([Yup.ref("password")], translate("Passwords_must_match")),
});

export interface IResetSchema extends Yup.Asserts<typeof resetPasswordSchema> {}

export const registerSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .required("First_Name_is_required")
  //   .min(2, "First Name must be at least 2 characters")
  //   .max(50, "First Name must be less than 50 characters"),
  // lastName: Yup.string()
  //   .required("Last Name_is_required")
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
    .email(translate("Email_must_be_a_valid_email_address"))
    .required(translate("Email_is_required")),
  password: Yup.string()
    .required(translate("Password_is_required"))
    .min(8, translate("Password_must_be_at_least_8_characters"))
    .matches(
      /(?=.*[0-9])/,
      translate("Password_must_contain_at_least_one_number")
    )
    .matches(
      /(?=.*[a-z])/,
      translate("Password_must_contain_at_least_one_lowercase_letter")
    )
    .matches(
      /(?=.*[A-Z])/,
      translate("Password_contain_at_least_one_uppercase_letter")
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      translate("Password_must_contain_at_least_one_special_character")
    ),
  // confirmPassword: Yup.string()
  //   .required("Confirm_Password_is_required")
  //   .oneOf([Yup.ref("password")], "Passwords_must_match"),
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
    .required("Current_Password_is_required")
    .min(8, "Current_Password_must_be_at_least_8_characters")
    .matches(/(?=.*[0-9])/, "Current_Password_must_contain_at_least_one_number")
    .matches(
      /(?=.*[a-z])/,
      "Current_Password_must_contain_at_least_one_lowercase_letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Current_Password_contain_at_least_one_uppercase_letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Current_Password_must_contain_at_least_one_special_character"
    ),
  password: Yup.string()
    .required("Password_is_required")
    .min(8, "Password_must_be_at_least_8_characters")
    .matches(/(?=.*[0-9])/, "Password_must_contain_at_least_one_number")
    .matches(
      /(?=.*[a-z])/,
      "Password_must_contain_at_least_one_lowercase_letter"
    )
    .matches(/(?=.*[A-Z])/, "Password_contain_at_least_one_uppercase_letter")
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password_must_contain_at_least_one_special_character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm_Password_is_required")
    .oneOf([Yup.ref("password")], "Passwords_must_match"),
});

export interface IChangePasswordSchema
  extends Yup.Asserts<typeof changePasswordSchema> {}

// add to wishlist
export const preFormSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business_Name_is_required")
    .min(2, "Business_Name_must_be_at_least_2_characters"),
  company_email: Yup.string()
    .email()
    .lowercase()
    .required("Company_Email_is_required"),
  company_phone: Yup.string().required("Company_Phone_is_required"),
  gst_number: Yup.string().required("gst_number_is_required"),
  website: Yup.string().url().required("Website_is_required"),
  type_of_business: Yup.string().required("Type_of_business_is_required"),
  contacts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name_is_required"),
      phone: Yup.string().required("Phone_number_is_required"),
      email: Yup.string()
        .email("Invalid_email_format")
        .required("Email_is_required"),
    })
  ),
  omni_channels: Yup.array()
    .of(Yup.string().required("Channel is required"))
    .min(1, "At least one channel is required"),
});

export interface IPreFormSchema extends Yup.Asserts<typeof preFormSchema> {}

export const creatorFormSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full_Name_is_required")
    .min(2, "Full_Name_must_be_at_least_2_characters"),
    user_name: Yup.string()
    .required("User_Name_is_required")
    .min(2, "User_Name_must_be_at_least_2_characters"),
  email: Yup.string()
    .email()
    .lowercase()
    .required("Email_is_required"),
  phone_number: Yup.string()
  .required("Phone_number_is_required")
  .min(10, "Full_Name_must_be_at_least_10_digits"),
  profile_title: Yup.string()
  .required("Profile_title_is_required")
  .min(2, "Profile_title_must_be_at_least_2_characters"),
  long_description: Yup.string()
  .required("Long_Description_is_required")
  .min(100, "Long_Description_must_be_at_least_100_characters"),
  short_description: Yup.string()
  .required("Short_Description_is_required")
  .min(10, "Short_Description_must_be_at_least_10_characters"),
  tags: Yup.array().of(
    Yup.string().required("Tags_is_required"),
  ),
  category: Yup.array().of(
    Yup.string().required("Category_is_required"),
  ),
  sub_category: Yup.array().of(
    Yup.string().required("sub_Category_is_required"),
  ),
  profile_image: Yup.string().required("Profile_Image_is_required"),
  banner_image: Yup.string().required("Banner_Image_is_required"),
});

export interface ICreatorFormSchema extends Yup.Asserts<typeof creatorFormSchema> {}

export const contactSchema = Yup.object().shape({
  firstName: Yup.string().required("First_Name_is_required"),
  email: Yup.string()
    .email("Email_must_be_a_valid_email_address")
    .required("Email_is_required"),
  type: Yup.string().required("Type_is_required"),
  message: Yup.string().required("Message_is_required"),
});

export interface IContactSchema extends Yup.Asserts<typeof contactSchema> {}

export const profileUpdateSchema = Yup.object().shape({
  name: Yup.string().required(translate("Name_is_required")),
  email: Yup.string()
    .email(translate("Email_must_be_a_valid_email_address"))
    .required(translate("Email_is_required")),
  phone: Yup.string().required("Phone is required"),
});

export interface IProfileUpdateSchema
  extends Yup.Asserts<typeof profileUpdateSchema> {}

export const vendorProfileUpdateSchema = Yup.object().shape({
  company_email: Yup.string()
    .email(translate("Company Email must be a valid email address"))
    .required(translate("Company Email is required")),
  company_phone: Yup.string().required(translate("Company Phone is required")),
  gst_number: Yup.string().required("GST Number is required"),
  website: Yup.string()
    .url(translate("Website must be a valid URL"))
    .required(translate("Website is required")),
  business_name: Yup.string().required(translate("Business Name is required")),
});
export interface IVendorProfileUpdateSchema
  extends Yup.Asserts<typeof vendorProfileUpdateSchema> {}

export const addAddressVendorSchema = Yup.object().shape({
  name: Yup.string().required(translate("Name is required")),
  phone: Yup.string().required(translate("Phone is required")),
  zip_code: Yup.string().required(translate("Zip is required")),
  city: Yup.string().required(translate("City is required")),
  state: Yup.string().required(translate("State is required")),
  house_no: Yup.string().required(translate("House No is required")),
  address: Yup.string().required(translate("Address is required")),
  isDefault: Yup.boolean().optional().default(false),
});
export interface IAddAddressVendorSchema
  extends Yup.Asserts<typeof addAddressVendorSchema> {}

export const addContactVendorSchema = Yup.object().shape({
  name: Yup.string().required(translate("Name is required")),
  phone: Yup.string().required(translate("Phone is required")),
  email: Yup.string()
    .email(translate("Email must be a valid email address"))
    .required(translate("Email is required")),
  isDefault: Yup.boolean().optional().default(false),
});
export interface IAddContactVendorSchema
  extends Yup.Asserts<typeof addContactVendorSchema> {}
