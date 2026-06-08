// src/util/Form-menu/campaign-fields.js
import * as yup from "yup";

export const fields = [
  [
    {
      type: "input",
      name: "name",
      label: "Campaign Name",
      placeholder: "Enter campaign name",
      gridSpan: 3,
      validation: yup.string().required("Campaign name is required"),
    },
  ],
  [
    {
      type: "input",
      name: "brandName",
      label: "Brand Name",
      placeholder: "Enter brand name",
      validation: yup.string().required("Brand name is required"),
    },
    {
      type: "date-range",
      name: "dateRange",
      label: "Start - End Date",
      validation: yup
        .array()
        .of(yup.date().required())
        .min(2, "Select a valid date range")
        .required(),
    },
    {
      type: "input",
      name: "duration",
      label: "Duration (in seconds)",
      placeholder: "Enter duration",
      validation: yup
        .number()
        .typeError("Duration must be a number")
        .positive("Must be positive")
        .required("Duration is required"),
    },
  ],
  [
    {
      type: "select",
      name: "product",
      label: "Product",
      options: [],
      multi: false,
      validation: yup.string().required('Select at least one product'),

      // validation: yup.array().min(1, "Select at least one product").required(),
    },
    {
      type: "select",
      name: "adType",
      label: "Ad Type",
      options: [
        { label: "Informative", value: "informative" },
        { label: "Market Research", value: "marketResearch" },
        { label: "Market Survey", value: "marketSurvey" },
      ],
      validation: yup.string().required("Select a store type"),
    },

    {
      type: "select",
      name: "timings",
      label: "Timings (1 hour)",
      options: [
        { label: "12 AM - 1 AM", value: "12AM-1AM" },
        { label: "1 AM - 2 AM", value: "1AM-2AM" },
        { label: "2 AM - 3 AM", value: "2AM-3AM" },
        { label: "3 AM - 4 AM", value: "3AM-4AM" },
        { label: "4 AM - 5 AM", value: "4AM-5AM" },
        { label: "5 AM - 6 AM", value: "5AM-6AM" },
        { label: "6 AM - 7 AM", value: "6AM-7AM" },
        { label: "7 AM - 8 AM", value: "7AM-8AM" },
        { label: "8 AM - 9 AM", value: "8AM-9AM" },
        { label: "9 AM - 10 AM", value: "9AM-10AM" },
        { label: "10 AM - 11 AM", value: "10AM-11AM" },
        { label: "11 AM - 12 PM", value: "11AM-12PM" },
        { label: "12 PM - 1 PM", value: "12PM-1PM" },
        { label: "1 PM - 2 PM", value: "1PM-2PM" },
        { label: "2 PM - 3 PM", value: "2PM-3PM" },
        { label: "3 PM - 4 PM", value: "3PM-4PM" },
        { label: "4 PM - 5 PM", value: "4PM-5PM" },
        { label: "5 PM - 6 PM", value: "5PM-6PM" },
        { label: "6 PM - 7 PM", value: "6PM-7PM" },
        { label: "7 PM - 8 PM", value: "7PM-8PM" },
        { label: "8 PM - 9 PM", value: "8PM-9PM" },
        { label: "9 PM - 10 PM", value: "9PM-10PM" },
        { label: "10 PM - 11 PM", value: "10PM-11PM" },
        { label: "11 PM - 12 AM", value: "11PM-12AM" },
      ],
      validation: yup.string().required("Please select timings"),
    },
  ],
  [
    
    {
      type: "select",
      name: "storeTypes",
      label: "Store Type",
      options: [
        { label: "Kirana", value: "Kirana" },
        { label: "Pharmacy", value: "pharmacy" },
        { label: "Electronic", value: "Electronic" },
        { label: "Beauty", value: "Beauty" },
      ],
      validation: yup.string().required("Select a store type"),
    },
    {
      type: "select",
      name: "targetDevices",
      label: "Target Devices",
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one device").required(),
    },
    {
      type: "select",
      name: "regions",
      label: "Regions",
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one region").required(),
    },
    {
      type: "select",
      name: "pincode",
      label: "Pin Code",
      options: [],
      multi: true,
      validation: yup.array().min(1, "Select at least one region").required(),
    },
  ],

  [
    {
      type: "file",
      name: "productFiles",
      label: "Upload Creatives",
      accept: ".jpg,.png,.mp4",
      maxSizeMB: 25,
      gridSpan: 3,
      validation: yup
        .mixed()
        .test(
          "file-required",
          "At least one file is required",
          (value) => value && value.length > 0
        ),
    },
  ],
  [
    {
      type: "input",
      name: "campaignBudget",
      label: "Campaign Budget",
      placeholder:"₹ Amount",
      validation: yup.string().required("Budget is required"),
    },
    {
      type: "input",
      name: "baseBid",
      label: "Campaign Base Value",
      placeholder: "Base Value",
      disabled: true,
      validation: yup
        .number()
        .typeError("Base Value must be a number")
        .required("Base Value is required"),
    },
    {
      type: "input",
      name: "maxBidCap",
      label: "Bid Value",
      placeholder:"₹ Amount",
      validation: yup.string().required("Max Bid Cap is required"),
    },
  ],
];

