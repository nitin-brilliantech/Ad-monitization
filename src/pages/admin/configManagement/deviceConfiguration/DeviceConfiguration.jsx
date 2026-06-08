import { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import Button from "../../../../components/ui/button/Button";
import ReusableTable from "../../../../components/table/ReusableTable";

import {
  fetchDevices,
  createDevice,
  updateDevice,
} from "../../../../redux/slices/admin/deviceSlice";

import { getDeviceColumns } from "../Columns";
import AddDeviceModal from "./AddDeviceModal";
import EditDeviceModal from "./EditDeviceModal";

const DeviceConfiguration = () => {
  const dispatch = useDispatch();
  const { devices, loading, formLoading, fetched } = useSelector((state) => state.device);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [orientation, setOrientation] = useState("Vertical");

  const { register, handleSubmit, reset } = useForm();

   useEffect(() => {
      if (!fetched && !loading) {
        dispatch(fetchDevices());
      }
    }, [fetched, loading,formLoading, dispatch]);

  // Add Device Submit
  const onAddSubmit = (formData) => {
    const payload = {
      name: formData.name,
      resolutionHeight: Number(formData.height),
      resolutionWidth: Number(formData.width),
      orientation,
      price: Number(formData.price),
    };

    dispatch(createDevice(payload)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        reset();
        setIsAddOpen(false);
      }
    });
  };

  // Edit Device Submit
  const onEditSubmit = (formData) => {
    if (!selectedDevice) return;

    const payload = {
      name: formData.name,
      resolutionHeight: Number(formData.height),
      resolutionWidth: Number(formData.width),
      orientation,
      price: Number(formData.price),
    };

    dispatch(updateDevice({ id: selectedDevice.id, data: payload })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        reset();
        setSelectedDevice(null);
        setIsEditOpen(false);
      }
    });
  };

  const handleRefresh = () => {
    dispatch(fetchDevices());
  };

  // Row click opens edit modal with selected device
  const handleRowClick = (device) => {
    setSelectedDevice(device);
    setOrientation(device.orientation || "Vertical");
    setIsEditOpen(true);
  };

  const deviceColumns = getDeviceColumns();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold">Device Configuration</h2>
        <Button label="Add Device" onClick={() => setIsAddOpen(true)} />
      </div>

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleSubmit(onAddSubmit)}
        register={register}
        orientation={orientation}
        setOrientation={setOrientation}
        loading={formLoading}
      />

      {/* Edit Device Modal */}
      {selectedDevice && (
        <EditDeviceModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedDevice(null);
          }}
          onSubmit={handleSubmit(onEditSubmit)}
          register={register}
          orientation={orientation}
          setOrientation={setOrientation}
          loading={formLoading}
          initialData={selectedDevice}
        />
      )}

      <div className="mt-4">
        <ReusableTable
          columns={deviceColumns}
          rows={devices}
          loading={loading}
          filterKey="orientation"
          filterOptions={["all","Vertical", "Horizontal"]}
          onRefresh={handleRefresh}
          onRowClick={handleRowClick}
          searchableColumns={["srNo","name","price"]}
        />
      </div>
    </div>
  );
};

export default DeviceConfiguration;