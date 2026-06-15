import React, { useEffect, useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "../../../components/ui/toast/Toast";
import { Modal } from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import Loader from "../../../components/loader/Loader";
import Select from "react-select";

import { estimatePrice } from "../../../api/user/campaign-api/targetingOptionService";
import { updateCampaign, fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";

import { fields } from "../../../util/Form-menu/campaign-fields";
import { customizePayload } from "../../../util/validation/campaignValidationSchema";
import LoaderEmpt from "../../../components/loader/LoaderEmpt"

const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderRadius: "10px",
    borderWidth: "1.5px",
    borderColor: state.isFocused ? "#4684ff" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(70,132,255,0.13)" : "none",
    "&:hover": { borderColor: state.isFocused ? "#4684ff" : "#a0aec0" },
  }),
  input: (base) => ({
    ...base,
    outline: "none !important",
    border: "none !important",
    boxShadow: "none !important",
  }),
};

const EditCampaignModal = ({ isOpen, onClose, campaignData, onSuccess }) => {
  const dispatch = useDispatch();
  const { formLoading } = useSelector((state) => state.campaign);
  const { data: dropdownData, loading: dropdownLoading } = useSelector(
    (state) => state.cityProductDevice
  );

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    pincodes: [],
    regionMap: {},
    pincodeMap: {},
  });

  const methods = useForm({
    defaultValues: {},
  });

  // Fetch dropdown data if not present
  useEffect(() => {
    if (!dropdownData) {
      dispatch(fetchDropdownData());
    }
  }, [dispatch, dropdownData]);

  const refreshCampaigns = () => {
    dispatch(fetchCampaigns());
  };

  // Prepare dropdown options with NAMES as values
  useEffect(() => {
    if (!dropdownData) return;

    const regionOptions = [];
    const pincodeOptions = [];
    const regionMap = {};
    const pincodeMap = {};

    dropdownData.locations.forEach((loc) => {
      if (loc.name) regionOptions.push({ label: loc.name, value: loc.name });
      if (loc.postcode)
        pincodeOptions.push({ label: loc.postcode, value: loc.postcode });

      if (regionMap[loc.name]) {
        if (loc.postcode) regionMap[loc.name].push(loc.postcode);
      } else {
        regionMap[loc.name] = loc.postcode ? [loc.postcode] : [];
      }

      if (loc.postcode) pincodeMap[loc.postcode] = loc.name;
    });

    const productOptions = dropdownData.products.map((p) => ({
      label: p.name,
      value: p.name,
    }));

    const deviceOptions = dropdownData.devices.map((d) => ({
      label: d.name,
      value: d.name,
    }));

    setDropdowns({
      product: productOptions,
      targetDevices: deviceOptions,
      regions: regionOptions,
      pincodes: pincodeOptions,
      regionMap,
      pincodeMap,
    });
  }, [dropdownData]);

  // Reset form values when campaignData or dropdowns.regionMap changes
  useEffect(() => {
    if (campaignData && Object.keys(dropdowns.regionMap).length > 0) {
      const selectedRegions = [
        ...new Set(campaignData.cityPostcodes?.map((item) => item.city) || []),
      ];
      const selectedPincodes = [
        ...new Set(
          campaignData.cityPostcodes?.map((item) => item.postcode) || []
        ),
      ];

      // Map devices and product to their NAMES (not IDs)
      const selectedTargetDeviceNames =
        campaignData.devices?.map((d) => d.name) || [];
      const selectedProductName =
        campaignData.product?.name || campaignData.product || "";

      methods.reset({
        ...campaignData,
        product: selectedProductName,
        targetDevices: selectedTargetDeviceNames,
        regions: selectedRegions,
        pincode: selectedPincodes,
        productFiles: campaignData.productFiles || [],
        timings: campaignData.timings || "",
        startDate: campaignData.startDate,
        endDate: campaignData.endDate,
        startTime: campaignData.startTime,
        endTime: campaignData.endTime,
      });
    }
  }, [campaignData, dropdowns.regionMap, methods]);

  // Keep regions and pincodes in sync when changed
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      if (!dropdowns.regionMap || !dropdowns.pincodeMap) return;

      if (name === "regions") {
        const derivedPincodes = [
          ...new Set(
            selectedRegions.flatMap(
              (region) => dropdowns.regionMap[region] || []
            )
          ),
        ];

        const currentSorted = [...selectedPincodes].sort();
        const derivedSorted = [...derivedPincodes].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("pincode", derivedPincodes, {
            shouldValidate: false,
          });
        }
      }

      if (name === "pincode") {
        const derivedRegions = [
          ...new Set(
            selectedPincodes
              .map((pin) => dropdowns.pincodeMap[pin])
              .filter(Boolean)
          ),
        ];

        const currentSorted = [...selectedRegions].sort();
        const derivedSorted = [...derivedRegions].sort();

        if (JSON.stringify(currentSorted) !== JSON.stringify(derivedSorted)) {
          methods.setValue("regions", derivedRegions, {
            shouldValidate: false,
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regionMap, dropdowns.pincodeMap]);

  // Handle campaign update submit
  const handleUpdate = async (formData) => {
    const allFiles = formData.productFiles || [];
    const oldImages = allFiles.filter((item) => typeof item === "string");
    const newFiles = allFiles.filter((item) => item instanceof File);

    const cityPostcodes = [
      ...new Set(
        (formData.regions || [])
          .flatMap((r) =>
            (dropdowns.regionMap[r] || []).map((p) => ({
              city: r,
              postcode: p,
            }))
          )
          .concat(
            (formData.pincode || []).map((p) => ({
              city: dropdowns.pincodeMap[p],
              postcode: p,
            }))
          )
      ),
    ];

    if (!cityPostcodes.length)
      return Toast.error("Select at least one city/postcode.")

    const payload = customizePayload({
      ...formData,
      productFiles: newFiles,
      cityPostcodes,
      targetDevices: formData.targetDevices,
      product: formData.product,
    });

    try {
      await dispatch(
        updateCampaign({ id: campaignData.id, data: payload, oldImages })
      ).unwrap();
      await refreshCampaigns();
      await onSuccess?.();
      onClose?.();
      Toast.success("Campaign Updated Successfully!")

    } catch (err) {
      Toast.error(err?.message || "Failed to update campaign",)
    }
  };

  // Prepare payload for estimate API: send arrays of names and cityPostcodes
  const prepareEstimatePayload = (formData) => {
    const productNames = formData.product ? [formData.product] : [];
    const deviceNames = formData.targetDevices || [];

    const cityPostcodes = (formData.regions || []).flatMap((region) =>
      (dropdowns.regionMap[region] || []).map((postcode) => ({
        city: region,
        postcode,
      }))
    );

    return { productNames, deviceNames, cityPostcodes };
  };

  if (dropdownLoading || !dropdownData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex items-center justify-center h-48">
          <Loader />
        </div>
      </Modal>
    );
  }

  // Deep map fields for dropdowns injection
  const deepFieldsConfig = fields.map((row) =>
    row.map((field) => {
      if (field.name === "product") {
        return { ...field, options: dropdowns.product };
      }
      if (field.name === "targetDevices") {
        return { ...field, options: dropdowns.targetDevices };
      }
      if (field.name === "regions") {
        return { ...field, options: dropdowns.regions };
      }
      if (field.name === "pincode") {
        return { ...field, options: dropdowns.pincodes };
      }
      return field;
    })
  );

  // Example custom field rendering for select fields
  // Use this pattern in your FormBuilder for product and targetDevices
  const renderProductSelect = (
    <Controller
      name="product"
      control={methods.control}
      render={({ field }) => (
        <Select
          {...field}
          options={dropdowns.product}
          isClearable
          onChange={(opt) => field.onChange(opt ? opt.value : "")}
          value={
            dropdowns.product.find((opt) => opt.value === field.value) || null
          }
          styles={selectStyles}
        />
      )}
    />
  );

  const renderTargetDevicesSelect = (
    <Controller
      name="targetDevices"
      control={methods.control}
      render={({ field }) => (
        <Select
          {...field}
          options={dropdowns.targetDevices}
          isMulti
          onChange={(opts) =>
            field.onChange(opts ? opts.map((opt) => opt.value) : [])
          }
          value={dropdowns.targetDevices.filter(
            (opt) =>
              Array.isArray(field.value) && field.value.includes(opt.value)
          )}
          styles={selectStyles}
        />
      )}
    />
  );
  // if(formLoading) return  <LoaderEmpt size="large" />


  return (
       <>
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <FormProvider {...methods}>
        <div className="max-h-[80vh] rounded-lg relative">
          <FormBuilder
            onSubmit={handleUpdate}
            fieldsConfig={deepFieldsConfig}
            dropdowns={{
              ...dropdowns,
              pincode: dropdowns.pincodes,
            }}
            methods={methods}
            isEdit={true}
            loading={formLoading}
            estimateApi={estimatePrice}
            estimateWatchFields={[
              "product",
              "regions",
              "targetDevices",
              "pincode",
            ]}
            estimateSetField="baseBid"
            estimatePayloadFn={prepareEstimatePayload}
            isPlus={false}
            submitLabel="Update"
            customSelectRenderers={{
              product: renderProductSelect,
              targetDevices: renderTargetDevicesSelect,
            }}
            title={
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full pr-12">
                <span className="text-xl font-bold text-gray-800">
                  Update Campaign
                </span>

                {campaignData.remark && (
                  <div className="flex items-center mt-1 sm:mt-0 text-sm sm:max-w-xs truncate text-right">
                    <span className="relative flex size-2 mx-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex size-2 rounded-full bg-red-500"></span>
                    </span>{" "}
                    <span
                      className="text-red-500 text-md truncate"
                      title={campaignData.remark}
                    >
                      {campaignData.remark}
                    </span>
                  </div>
                )}
              </div>
            }
          />
        </div>
      </FormProvider>
    </Modal>
       </>
  );
};

export default EditCampaignModal;