import * as yup from "yup";

export const campaignValidationSchema = yup.object().shape({
  name: yup.string().required("Campaign name is required"),
  // product: yup.array().min(1, "Select at least one product"),
  product: yup.string().required("Select at least one product"),
  adType: yup.string().required("Ad Type is required"),
  brandName: yup.string().required("Brand name is required"),
  duration: yup
    .number()
    .typeError("Duration must be a number")
    .positive("Duration must be positive")
    .required("Duration is required"),
  timings: yup.string().required("Please select a time slot"),
  regions: yup.array().min(1, "Select at least one region"),
  storeTypes: yup.string().required("Store type is required"),
  targetDevices: yup.array().min(1, "Select at least one device"),
  productFiles: yup
    .mixed()
    .test("required", "Product file is required", (value) => value?.length > 0),
  campaignBudget: yup.string().required("Budget is required"),
  baseBid: yup
    .number()
    .typeError("Base Bid must be a number")
    .required("Base Bid is required"),
  maxBidCap: yup.string().required("Max bid cap is required"),
});



export const customizePayload = (formData) => {
  const { regions = [], pincode = [], ...rest } = formData;

  // Combine city and postcode into one array of objects
  const citypostcode = regions.map((city, idx) => ({
    city,
    postcode: pincode[idx] || null, // handle cases where pincode might be missing
  }));

  return {
    ...rest,
    citypostcode,
  };
};