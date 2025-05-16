import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .lowercase()
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
});

export interface ILoginSchema extends Yup.Asserts<typeof loginSchema> {}

export const loginWithOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
    .required("Email is required"),
  password: Yup.string().optional(),
});

export interface ILoginWithOtpSchema
  extends Yup.Asserts<typeof loginWithOtpSchema> {}

export const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
    .required("Email is required"),
});

export interface IForgotSchema extends Yup.Asserts<typeof forgotSchema> {}

export const otpSchema = Yup.object().shape({
  otpCode: Yup.string()
    .matches(/^\d+$/, "OTP must be a number")
    .length(6, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export interface IOtpSchema extends Yup.Asserts<typeof otpSchema> {}

export const resetPasswordSchema = Yup.object().shape({
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
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
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
  terms: Yup.boolean().oneOf([true]),
  // type: Yup.string().required("Type is required")
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

// Vendor register
export const vendorRegisterFirstStepSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business Name is required")
    .min(2, "Business Name must be at least 2 characters"),
  company_email: Yup.string()
    .email("Company Email must be a valid email")
    .lowercase("Company Email must be a valid email")
    .required("Company Email is required"),
  pin: Yup.string()
    .required("Pin code is required")
    .matches(/^[0-9]{6}$/, "Pin code must be a valid 6-digit number"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  website: Yup.string().url().required("Website is required"),
  type_of_business: Yup.string().required("Type of business is required"),
  profile_image: Yup.string().required("Profile Image is required"),
  banner_image: Yup.string().nullable(),
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Category is required")
    .required("Category is required"), // Ensure at least one category is selected
  sub_category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Sub-category is required")
    .required("Sub-Category is required"),
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().test(
          "test-name",
          "Name is required",
          function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].name" && !value) {
              return createError({ path, message: "Name is required" });
            }
            return true; // No error
          }
        ),
        phone: Yup.string().test(
          "test-phone",
          "Phone number is required",
          function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].phone" && !value) {
              return createError({ path, message: "Phone number is required" });
            }
            if (value && !/^\d{10}$/.test(value)) {
              return createError({
                path,
                message: "Phone number must be exactly 10 digits",
              });
            }
            return true; // No error
          }
        ),
        email: Yup.string()
          .email("Invalid email format")
          .lowercase()
          .test("test-email", "Email is required", function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].email" && !value) {
              return createError({ path, message: "Email is required" });
            }
            return true; // No error
          }),
      })
    )
    .required("At least one contact is required") // Ensure at least one contact
    .min(1, "At least one contact is required"), // Ensure at least one contact
});

export interface IVendorRegisterFirstStepSchema
  extends Yup.Asserts<typeof vendorRegisterFirstStepSchema> {}
export const vendorRegisterSecondStepSchema = Yup.object().shape({
  gst_number: Yup.string()
    .required("GST Number is required")
    .min(15, "GST Number should be exactly 15 characters")
    .max(15, "GST Number should be exactly 15 characters")
    .matches(
      /^[0-9A-Z]+$/,
      "GST Number should contain only alphanumeric characters (A-Z & 0-9)"
    )
    .matches(/^[0-9]{2}/, "First two characters should be numeric (State Code)")
    .matches(
      /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
      "Middle 10 characters should be a valid PAN format (ABCDE1234F)"
    )
    .matches(
      /[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Last three characters should follow GSTIN format"
    ),
  gst_certificate: Yup.string().required("GST Certificate is required"),
  pan_number: Yup.string()
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number (e.g. ABCDE1234F)"
    )
    .required("PAN number is required"),
});

export interface IVendorRegisterSecondStepSchema
  extends Yup.Asserts<typeof vendorRegisterSecondStepSchema> {}
export const preFormSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business Name is required")
    .min(2, "Business Name must be at least 2 characters"),
  company_email: Yup.string()
    .email("Company Email must be a valid email")
    .lowercase("Company Email must be a valid email")
    .required("Company Email is required"),
  company_phone: Yup.string()
    .required("Company Phone is required")
    .matches(/^[0-9]{10}$/, "Company Phone must be a valid 10-digit number"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  gst_number: Yup.string()
    .required("GST Number is required")
    .min(15, "GST Number should be exactly 15 characters")
    .max(15, "GST Number should be exactly 15 characters")
    .matches(
      /^[0-9A-Z]+$/,
      "GST Number should contain only alphanumeric characters (A-Z & 0-9)"
    )
    .matches(/^[0-9]{2}/, "First two characters should be numeric (State Code)")
    .matches(
      /[A-Z]{5}[0-9]{4}[A-Z]{1}/,
      "Middle 10 characters should be a valid PAN format (ABCDE1234F)"
    )
    .matches(
      /[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Last three characters should follow GSTIN format"
    ),
  website: Yup.string().url().required("Website is required"),
  type_of_business: Yup.string().required("Type of business is required"),
  contacts: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().test(
          "test-name",
          "Name is required",
          function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].name" && !value) {
              return createError({ path, message: "Name is required" });
            }
            return true; // No error
          }
        ),
        phone: Yup.string().test(
          "test-phone",
          "Phone number is required",
          function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].phone" && !value) {
              return createError({ path, message: "Phone number is required" });
            }
            if (value && !/^\d{10}$/.test(value)) {
              return createError({
                path,
                message: "Phone number must be exactly 10 digits",
              });
            }
            return true; // No error
          }
        ),
        email: Yup.string()
          .email("Invalid email format")
          .lowercase()
          .test("test-email", "Email is required", function (value) {
            const { path, createError } = this;
            // Check if this is the first contact
            if (path === "contacts[0].email" && !value) {
              return createError({ path, message: "Email is required" });
            }
            return true; // No error
          }),
      })
    )
    .required("At least one contact is required") // Ensure at least one contact
    .min(1, "At least one contact is required"), // Ensure at least one contact
  omni_channels: Yup.array()
    .of(
      Yup.object().shape({
        value: Yup.string().required("Channel value is required"),
        label: Yup.string().required("Channel label is required"),
      })
    )
    .min(1, "At least one channel is required"),
});
export const vendorRegisterThirdStepSchema = Yup.object().shape({
  shopify_store_id: Yup.string().required("Shopify store id is required"),
});

export interface IVendorRegisterThirdStepSchema
  extends Yup.Asserts<typeof vendorRegisterThirdStepSchema> {}
export interface IPreFormSchema extends Yup.Asserts<typeof preFormSchema> {}

export const creatorFormSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full Name is required")
    .min(2, "Full Name must be at least 2 characters"),
  user_name: Yup.string()
    .required("User Name is required")
    .min(2, "User Name must be at least 2 characters"),
  email: Yup.string().email().lowercase().required("Email is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  phone_number: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  profile_title: Yup.string()
    .required("Profile title is required")
    .min(2, "Profile title must be at least 2 characters"),
  long_description: Yup.string()
    .required("Long Description is required")
    .min(100, "Long Description must be at least 100 characters"),
  short_description: Yup.string()
    .required("Short Description is required")
    .min(10, "Short Description must be at least 10characters"),
  tags: Yup.array().of(Yup.string().required("Tags is required")),
  category: Yup.array().of(Yup.string().required("Category is required")),
  sub_category: Yup.array().of(
    Yup.string().required("sub Category is required")
  ),
  profile_image: Yup.string().required("Profile Image is required"),
  banner_image: Yup.string().required("Banner Image is required"),
});

export interface ICreatorFormSchema
  extends Yup.Asserts<typeof creatorFormSchema> {}

export const contactSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
    .required("Email is required"),
  type: Yup.string().required("Type is required"),
  message: Yup.string().required("Message is required"),
});

export interface IContactSchema extends Yup.Asserts<typeof contactSchema> {}

export const profileUpdateSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
});

export interface IProfileUpdateSchema
  extends Yup.Asserts<typeof profileUpdateSchema> {}

export const vendorProfileUpdateSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business Name is required")
    .min(2, "Business Name must be at least 2 characters"),
  zip_code: Yup.string()
    .required("Pin code is required")
    .matches(/^[0-9]{6}$/, "Pin code must be a valid 6-digit number"),
  address: Yup.string().required("Address is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  website: Yup.string().url().required("Website is required"),
  type_of_business: Yup.string().required("Type of business is required"),
  profile_image: Yup.string().required("Profile Image is required"),
  banner_image: Yup.string().required("Banner Image is required"),
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Category is required")
    .required("Category is required"), // Ensure at least one category is selected
  sub_category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Sub-category is required")
    .required("Sub-Category is required"),
});

export interface IVendorProfileUpdateSchema
  extends Yup.Asserts<typeof vendorProfileUpdateSchema> {}

export const addAddressVendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  zip_code: Yup.string()
    .required("Zip is required")
    .matches(/^\d{6}$/, "ZIP code must be exactly 6 digits (e.g., 110001)"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  house_no: Yup.string().required("House No is required"),
  address: Yup.string().required("Address is required"),
  isDefault: Yup.boolean().optional().default(false),
});

export interface IAddAddressVendorSchema
  extends Yup.Asserts<typeof addAddressVendorSchema> {}

export const addContactVendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .lowercase()
    .required("Email is required"),
  isDefault: Yup.boolean().optional().default(false),
});

export interface IAddContactVendorSchema
  extends Yup.Asserts<typeof addContactVendorSchema> {}

// Add to wishlist
export const creatorOnBoardingSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  user_name: Yup.string().required("User name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .lowercase()
    .required("Email is required"),
  phone_number: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string().required("Date of Birth is required"),
});

export interface ICreatorOnBoardingSchema
  extends Yup.Asserts<typeof creatorOnBoardingSchema> {}

export const creatorStoreSetUpSchema = Yup.object().shape({
  store_name: Yup.string().required("Store name is required"),
  store_description: Yup.string().required("Store description is required"),
  tags: Yup.array()
    .of(Yup.string().required("Each tag must be a string"))
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Category is required")
    .required("Category is required"), // Ensure at least one category is selected
  sub_category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Sub-category is required")
    .required("Sub-Category is required"), // Ensure at least one sub-category is selected
  profile_image: Yup.string().required("Profile Image is required"),
  banner_image: Yup.string().required("Banner Image is required"),
});
export interface ICreatorStoreSetUpSchema
  extends Yup.Asserts<typeof creatorStoreSetUpSchema> {}

export const shopifyConnectSchema = Yup.object().shape({
  id_string: Yup.string().required("Shopify ID is required"),
});
export interface IShopifyConnectSchema
  extends Yup.Asserts<typeof shopifyConnectSchema> {}

export const creatorSocialConnectSchema = Yup.object().shape({
  channels: Yup.array(),
  // .of(
  //   Yup.object()
  //     .shape({
  //       account_name: Yup.string().required("Account Name is required"),
  //       handle_name: Yup.string().required("Handle Name is required"),
  //       account_link: Yup.string()
  //         .url("Account Link is Invalid")
  //         .required("Account Link is required"),
  //     })
  //     .test(
  //       "at-least-one-non-empty-channel",
  //       "At least one valid channel is required",
  //       (channel) => {
  //         return (
  //           !!channel.account_name?.trim() &&
  //           !!channel.handle_name?.trim() &&
  //           !!channel.account_link?.trim()
  //         );
  //       }
  //     )
  // ),
});

export interface ICreatorSocialConnectSchema
  extends Yup.Asserts<typeof creatorSocialConnectSchema> {}

// Add to wishlist
export const productSchema = Yup.object().shape({
  images: Yup.array().of(Yup.string().url("Invalid image URL")).required(),
  name: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .min(0, "Price must be a positive number")
    .required("Price is required"),
  sku: Yup.string().required("SKU is required"),
  barcode: Yup.string().required("Barcode is required"),
  quantity: Yup.number()
    .min(0, "Quantity must be a positive number")
    .required("Quantity is required"),
  discount: Yup.number()
    .min(0, "Quantity must be a positive number")
    .required("Quantity is required"),
  totalInventory: Yup.number()
    .min(0, "Total inventory must be a positive number")
    .required("Total inventory is required"),
  variants: Yup.array()
    .of(
      Yup.object().shape({
        variationType: Yup.string().required("Variation type is required"),
        variation: Yup.string().required("Variation value is required"),
      })
    )
    .required("Variants are required"),
  category: Yup.array()
    .of(Yup.string())
    .required("At least one category is required"),
  tags: Yup.array().of(Yup.string()).required("At least one tag is required"),
});

export interface IProductSchema extends Yup.Asserts<typeof productSchema> {}

export const channlesToProduct = Yup.object().shape({
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Category is required")
    .required("Category is required"), // Ensure at least one category is selected
  subCategory: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Sub-category is required")
    .required("Sub-Category is required"), // Ensure at least one sub-category is selected
});

export interface IChannelsToProduct
  extends Yup.Asserts<typeof channlesToProduct> {}

export const utmSchema = Yup.object().shape({
  discountType: Yup.string()
    .oneOf(
      ["PERCENTAGE", "FIXED_AMOUNT"],
      "Discount type must be PERCENTAGE or FIXED_AMOUNT"
    )
    .required("Discount type is required"),

  discountValue: Yup.number()
    .required("Discount value is required")
    .min(0, "Discount value must be at least 0"),

  couponCode: Yup.string()
    .required("Coupon code is required")
    .min(3, "Coupon code must be at least 3 characters"),

  commissionPercentage: Yup.number()
    .required("Commission percentage is required")
    .min(0, "Commission must be at least 0")
    .max(100, "Commission cannot exceed 100"),
  expiresAt: Yup.string().required("Expiration date is required"),
});

export interface IUTMSchema extends Yup.Asserts<typeof utmSchema> {}

export const creatorProfileUpdateSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  user_name: Yup.string().required("User name is required"),
  phone: Yup.string(),
  // .required("Phone is required")
  // .matches(/^[0-9]{10}$/, "Phone number must be a valid 10-digit number"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string().required("Date of Birth is required"),
  profile_image: Yup.string().nullable(),
});

export interface ICreatorProfileUpdateSchema
  extends Yup.Asserts<typeof creatorProfileUpdateSchema> {}

export const campaignValidationSchema = Yup.object().shape({
  name: Yup.string().required("Campaign name is required"),
  description: Yup.string().required("Description is required"),
  startDate: Yup.date()
    .required("Start date is required")
    .test(
      "is-future-date",
      "Start date must be in the future (not today)",
      (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value > today;
      }
    ),

  endDate: Yup.date()
    .required("End date is required")
    .when("startDate", ([startDate], schema) => {
      return schema.test(
        "is-after-start",
        "End date must be after start date",
        (endDate) => {
          if (!startDate || !endDate) return false;
          return new Date(endDate) > new Date(startDate);
        }
      );
    }),
  productId: Yup.string().required("Product is required"),

  channels: Yup.array()
    .min(1, "At least one channel is required")
    .required("Channels are required"),

  discount_type: Yup.string()
    .oneOf(
      ["FIXED_AMOUNT", "PERCENTAGE"],
      "Discount type must be either FIXED_AMOUNT or PERCENTAGE"
    )
    .required("Discount type is required"),

  discount_value: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
  price: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
});
export const campaignValidationUpdateSchema = Yup.object().shape({
  name: Yup.string().required("Campaign name is required"),
  description: Yup.string().required("Description is required"),
  startDate: Yup.date().required("Start date is required"),

  endDate: Yup.date()
    .required("End date is required")
    .when("startDate", ([startDate], schema) => {
      return schema.test(
        "is-after-start",
        "End date must be after start date",
        (endDate) => {
          if (!startDate || !endDate) return false;
          return new Date(endDate) > new Date(startDate);
        }
      );
    }),
  productId: Yup.string().required("Product is required"),

  channels: Yup.array()
    .min(1, "At least one channel is required")
    .required("Channels are required"),

  discount_type: Yup.string()
    .oneOf(
      ["FIXED_AMOUNT", "PERCENTAGE"],
      "Discount type must be either FIXED_AMOUNT or PERCENTAGE"
    )
    .required("Discount type is required"),

  discount_value: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
  price: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
});

export interface ICampaignValidationSchema
  extends Yup.Asserts<typeof campaignValidationSchema> {}

export const campaignProductValidationSchema = Yup.object().shape({
  name: Yup.string().required("Campaign name is required"),
  description: Yup.string().required("Description is required"),
  campaignLifeTime: Yup.boolean().default(false).required(),
  tags: Yup.array()
    .of(Yup.string().required("Each tag must be a string"))
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Category is required")
    .required("Category is required"), // Ensure at least one category is selected
  sub_category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "Sub-category is required")
    .required("Sub-Category is required"), // Ensure at least one sub-category is selected
  startDate: Yup.date()
    .required("Start date is required")
    .test(
      "is-future-date",
      "Start date must be in the future (not today)",
      (value) => {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return value > today;
      }
    ),

  endDate: Yup.date()
    .nullable()
    .when(["campaignLifeTime", "startDate"], {
      is: (campaignLifeTime: boolean, startDate: any) =>
        campaignLifeTime === false && !!startDate,
      then: (schema) =>
        schema
          .required("End date is required")
          .test(
            "is-after-start",
            "End date must be after start date",
            function (endDate) {
              const { startDate } = this.parent;
              if (!startDate || !endDate) return false;
              return new Date(endDate) > new Date(startDate);
            }
          ),
      otherwise: (schema) => schema.nullable(),
    }),

  productId: Yup.string().required("Product is required"),
  tearmAndCondition: Yup.boolean()
    .oneOf([true], "Tearm & Condition required")
    .required(),
  couponCode: Yup.string().optional(),
  videoType: Yup.array()
    .of(Yup.string().required("Each video type is required"))
    .min(1, "Select at least one video type")
    .required("Video type is required"),
  notes: Yup.string().required(),
  references: Yup.array()
    .of(Yup.string().url("Invalid URL").required("Reference link is required"))
    .min(1, "At least one reference link is required"),
  channels: Yup.array()
    .min(1, "At least one channel is required")
    .required("Channels are required"),

  commission_type: Yup.string()
    .oneOf(
      ["FIXED_AMOUNT", "PERCENTAGE"],
      "Discount type must be either FIXED_AMOUNT or PERCENTAGE"
    )
    .required("Discount type is required"),
  discount_type: Yup.string()
    .oneOf(
      ["FIXED_AMOUNT", "PERCENTAGE"],
      "Discount type must be either FIXED_AMOUNT or PERCENTAGE"
    )
    .required("Discount type is required"),

  discount_value: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
  commission: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
  price: Yup.number()
    .typeError("Discount value is required")
    .required("Discount value is required")
    .moreThan(0, "Discount value must be greater than 0"),
});

export interface ICampaignProductValidationSchema
  extends Yup.Asserts<typeof campaignProductValidationSchema> {}

export const createStoreSchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  description: Yup.string().required("Description is required"),
  // link: Yup.string().url().required("Store Link is required."),
  tags: Yup.array()
    .of(Yup.string().required("Each tag must be a string"))
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  category: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Label is required"),
        value: Yup.string().required("Value is required"),
      })
    )
    .min(1, "At least one category is required")
    .required("Category is required"), // Ensure at least one category is selected
  // sub_category: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       label: Yup.string().required("Label is required"),
  //       value: Yup.string().required("Value is required"),
  //     })
  //   )
  //   .min(1, "Sub-category is required")
  //   .required("Sub-Category is required"), // Ensure at least one sub-category is selected
  profile_image: Yup.string().required("Profile Image is required."),
  banner_image: Yup.string().required("Banner Image is required."),
});

export interface ICreateStoreSchema
  extends Yup.Asserts<typeof createStoreSchema> {}
