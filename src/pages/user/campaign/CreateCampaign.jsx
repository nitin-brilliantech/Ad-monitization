import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  estimatePrice,
} from "../../../api/user/campaign-api/targetingOptionService";

import FormBuilder from "../../../components/form/FromBuilder";
import LoaderEmpt from "../../../components/loader/LoaderEmpt";

import { fields } from "../../../util/Form-menu/campaign-fields";
import { campaignValidationSchema,customizePayload } from "../../../util/validation/campaignValidationSchema";
import Toast from "../../../components/ui/toast/Toast"
import { createCampaign, fetchCampaigns } from "../../../redux/slices/user/campaignSlice";
import { fetchDropdownData } from "../../../redux/slices/user/cityProductDeviceSlice";


const CreateCampaign = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { formLoading } = useSelector((state) => state.campaign);
  const { data: dropdownData, loading: dropdownLoading } = useSelector(
    (state) => state.cityProductDevice
  );

  const methods = useForm({
    resolver: yupResolver(campaignValidationSchema),
  });
  const { watch, setValue } = methods;

  const [dropdowns, setDropdowns] = useState({
    product: [],
    targetDevices: [],
    regions: [],
    pincodes: [],
    regionMap: {},
    pincodeMap: {},
  });

  // Always keep a ref in sync with latest dropdowns so watch subscription never reads stale maps
  const dropdownsRef = useRef(dropdowns);
  useEffect(() => {
    dropdownsRef.current = dropdowns;
  }, [dropdowns]);

  // Fetch dropdown data if not available
  useEffect(() => {
    if (!dropdownData) {
      dispatch(fetchDropdownData());
    }
  }, [dispatch, dropdownData]);

  // Build dropdown options and maps when data arrives
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

  // Sync regions ↔ pincodes selections
  useEffect(() => {
    const subscription = watch((values, { name: changedField }) => {
      const { regionMap, pincodeMap } = dropdownsRef.current;
      const selectedRegions = values.regions || [];
      const selectedPincodes = values.pincode || [];

      if (!regionMap || !pincodeMap) return;

      if (changedField === "regions") {
        const derivedPincodes = [
          ...new Set(selectedRegions.flatMap((region) => regionMap[region] || [])),
        ];
        if (JSON.stringify([...selectedPincodes].sort()) !== JSON.stringify([...derivedPincodes].sort())) {
          setValue("pincode", derivedPincodes, { shouldValidate: false });
        }
      } else if (changedField === "pincode") {
        const derivedRegions = [
          ...new Set(selectedPincodes.map((pin) => pincodeMap[pin]).filter(Boolean)),
        ];
        if (JSON.stringify([...selectedRegions].sort()) !== JSON.stringify([...derivedRegions].sort())) {
          setValue("regions", derivedRegions, { shouldValidate: false });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // Submit handler
  const handleSubmit = async (formData) => {
    if (formLoading) return;

    try {
      console.log("Form data before customization:", formData);
      const payload = customizePayload(formData, dropdowns.pincodeMap);
      console.log("Payload after customization:", payload);
      
      const result = await dispatch(createCampaign(payload));

      if (createCampaign.fulfilled.match(result)) {
        dispatch(fetchCampaigns());
        methods.reset();
        navigate("/");
        Toast.success("Campaign created successfully!")
      } else if (createCampaign.rejected.match(result)) {
        const errorMessage = result.payload?.message || "Something went wrong.";
        Toast.error(errorMessage)
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      Toast.error(error.message || "Failed to create campaign");
    }
  };

  // Show loader while dropdowns loading
  if (dropdownLoading || !dropdownData) {
    return <LoaderEmpt size="large" />;
  }

  return (
    <div className="w-full">
      {formLoading && <LoaderEmpt size="large" />}
      <h2 className="text-xl lg:2xl font-semibold text-gray-800 mb-4">
        Create Campaign
      </h2>
      <FormBuilder
        onSubmit={handleSubmit}
        fieldsConfig={fields}
        isEdit={false}
        dropdowns={{
          ...dropdowns,
          regions: dropdowns.regions,
          pincode: dropdowns.pincodes,
        }}
        methods={methods}
        estimateApi={estimatePrice}
        estimateWatchFields={["product", "regions", "targetDevices"]}
        estimateSetField="baseBid"
        title=""
        submitLabel="Submit For Approval"
        loading={formLoading}
      />
    </div>
  );
};

export default CreateCampaign;