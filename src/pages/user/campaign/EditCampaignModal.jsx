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

  const methods = useForm({ defaultValues: {} });

  useEffect(() => {
    if (!dropdownData) dispatch(fetchDropdownData());
  }, [dispatch, dropdownData]);

  // Build dropdown options from locations data
  useEffect(() => {
    if (!dropdownData) return;

    const regionOptions = [];
    const pincodeOptions = [];
    const regionMap = {};
    const pincodeMap = {};

    dropdownData.locations.forEach((loc) => {
      if (loc.name) regionOptions.push({ label: loc.name, value: loc.name });

      regionMap[loc.name] = regionMap[loc.name] || [];

      (loc.regions || []).forEach((region) => {
        if (region.postcode) {
          pincodeOptions.push({ label: region.postcode, value: region.postcode });
          regionMap[loc.name].push(region.postcode);
          pincodeMap[region.postcode] = loc.name;
        }
      });
    });

    setDropdowns({
      product: dropdownData.products.map((p) => ({ label: p.name, value: p.name })),
      targetDevices: dropdownData.devices.map((d) => ({ label: d.name, value: d.name })),
      regions: regionOptions,
      pincodes: pincodeOptions,
      regionMap,
      pincodeMap,
    });
  }, [dropdownData]);

  // Populate form when campaignData and regionMap are ready
  useEffect(() => {
    if (!campaignData || Object.keys(dropdowns.regionMap).length === 0) return;

    console.log("=== EDIT CAMPAIGN DEBUG ===");
    console.log("1. Raw campaignData:", campaignData);
    console.log("2. cityPostcodes from API:", campaignData.cityPostcodes);
    console.log("3. regionMap built from dropdown:", dropdowns.regionMap);
    console.log("4. pincodeMap built from dropdown:", dropdowns.pincodeMap);

    const cityPostcodes = campaignData.cityPostcodes || [];
    console.log("5. cityPostcodes array length:", cityPostcodes.length);

    let selectedRegions = [];
    let selectedPincodes = [];

    cityPostcodes.forEach((item) => {
      console.log("6. Processing item:", item);
      if (item.city) selectedRegions.push(item.city);
      if (item.regions && Array.isArray(item.regions)) {
        item.regions.forEach((r) => { if (r.postcode) selectedPincodes.push(r.postcode); });
      } else if (item.postcode) {
        selectedPincodes.push(item.postcode);
      }
    });

    selectedRegions = [...new Set(selectedRegions)];
    selectedPincodes = [...new Set(selectedPincodes)];

    console.log("7. Final selectedRegions:", selectedRegions);
    console.log("8. Final selectedPincodes:", selectedPincodes);
    console.log("9. Do regions exist in regionMap?", selectedRegions.map(r => ({ region: r, exists: !!dropdowns.regionMap[r] })));

    methods.reset({
      ...campaignData,
      product: campaignData.product?.name || campaignData.product || "",
      targetDevices: campaignData.devices?.map((d) => d.name) || [],
      regions: selectedRegions,
      pincode: selectedPincodes,
      productFiles: campaignData.productFiles || [],
      timings: campaignData.timings || "",
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      startTime: campaignData.startTime,
      endTime: campaignData.endTime,
    });
  }, [campaignData, dropdowns.regionMap, methods]);

  // Sync regions ↔ pincodes
  useEffect(() => {
    const subscription = methods.watch((values, { name }) => {
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];
      if (!dropdowns.regionMap || !dropdowns.pincodeMap) return;

      if (name === "regions") {
        const derived = [...new Set(selectedRegions.flatMap((r) => dropdowns.regionMap[r] || []))];
        if (JSON.stringify([...selectedPincodes].sort()) !== JSON.stringify([...derived].sort())) {
          methods.setValue("pincode", derived, { shouldValidate: false });
        }
      }

      if (name === "pincode") {
        const derived = [...new Set(selectedPincodes.map((p) => dropdowns.pincodeMap[p]).filter(Boolean))];
        if (JSON.stringify([...selectedRegions].sort()) !== JSON.stringify([...derived].sort())) {
          methods.setValue("regions", derived, { shouldValidate: false });
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, dropdowns.regionMap, dropdowns.pincodeMap]);

  const handleUpdate = async (formData) => {
    const allFiles = formData.productFiles || [];
    const oldImages = allFiles.filter((item) => typeof item === "string");
    const newFiles = allFiles.filter((item) => item instanceof File);

    const cityPostcodes = [
      ...new Map(
        (formData.regions || [])
          .flatMap((r) => (dropdowns.regionMap[r] || []).map((p) => ({ city: r, postcode: p })))
          .concat((formData.pincode || []).map((p) => ({ city: dropdowns.pincodeMap[p], postcode: p })))
          .map((item) => [`${item.city}-${item.postcode}`, item])
      ).values(),
    ];

    if (!cityPostcodes.length) return Toast.error("Select at least one city/postcode.");

    const payload = customizePayload({ ...formData, productFiles: newFiles, cityPostcodes });

    try {
      await dispatch(updateCampaign({ id: campaignData.id, data: payload, oldImages })).unwrap();
      dispatch(fetchCampaigns());
      onSuccess?.();
      onClose?.();
    } catch (err) {
      Toast.error(err?.message || "Failed to update campaign");
    }
  };

  const prepareEstimatePayload = (formData) => ({
    productNames: formData.product ? [formData.product] : [],
    deviceNames: formData.targetDevices || [],
    cityPostcodes: (formData.regions || []).flatMap((region) =>
      (dropdowns.regionMap[region] || []).map((postcode) => ({ city: region, postcode }))
    ),
  });

  if (dropdownLoading || !dropdownData) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <div className="flex items-center justify-center h-48"><Loader /></div>
      </Modal>
    );
  }

  const deepFieldsConfig = fields.map((row) =>
    row.map((field) => {
      if (field.name === "product") return { ...field, options: dropdowns.product };
      if (field.name === "targetDevices") return { ...field, options: dropdowns.targetDevices };
      if (field.name === "regions") return { ...field, options: dropdowns.regions };
      if (field.name === "pincode") return { ...field, options: dropdowns.pincodes };
      return field;
    })
  );

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
          value={dropdowns.product.find((opt) => opt.value === field.value) || null}
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
          onChange={(opts) => field.onChange(opts ? opts.map((opt) => opt.value) : [])}
          value={dropdowns.targetDevices.filter(
            (opt) => Array.isArray(field.value) && field.value.includes(opt.value)
          )}
          styles={selectStyles}
        />
      )}
    />
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" showCloseButton={false}>
      <FormProvider {...methods}>
        {/* Blue Header */}
        <div className="bg-[#4684ff] px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Update Campaign
              </h2>
              {campaignData.remark && (
                <div className="flex items-center mt-2 text-sm">
                  <span className="relative flex size-2 mr-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex size-2 rounded-full bg-red-400"></span>
                  </span>
                  <span className="text-red-100 font-medium">Remark: {campaignData.remark}</span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
              disabled={formLoading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="max-h-[70vh] overflow-y-auto">
          <FormBuilder
            onSubmit={handleUpdate}
            fieldsConfig={deepFieldsConfig}
            dropdowns={{ ...dropdowns, pincode: dropdowns.pincodes }}
            methods={methods}
            isEdit={true}
            loading={formLoading}
            estimateApi={estimatePrice}
            estimateWatchFields={["product", "regions", "targetDevices", "pincode"]}
            estimateSetField="baseBid"
            estimatePayloadFn={prepareEstimatePayload}
            isPlus={false}
            submitLabel="Update Campaign"
            customSelectRenderers={{ product: renderProductSelect, targetDevices: renderTargetDevicesSelect }}
            title=""
          />
        </div>
      </FormProvider>
    </Modal>
  );
};

export default EditCampaignModal;
