import React, { useEffect, useState } from "react";
import ReusableTable from "../../../components/table/ReusableTable";
import { useSelector } from "react-redux";
import {Modal} from "../../../components/ui/modal/Modal";
import FormBuilder from "../../../components/form/FromBuilder";
import { useForm } from "react-hook-form";
import Button from "../../../components/ui/button/Button";

const Devices = () => {
  const { campaigns, loading } = useSelector((state) => state.approvedCampaigns);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isEdit, setEdit] = useState(false);

  const methods = useForm();

  const handleRowClick = (row) => {
    setEdit(true);
    setSelected(row);
    setIsOpen(true);
  };

  const handleSubmit = (data) => {
    console.log("Submitted form:", data);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selected) {
      Object.entries(selected).forEach(([key, value]) => {
        methods.setValue(key, value);
      });
    }
  }, [selected]);

  const fieldsConfig = [
    [
      {
        name: "targetDevices",
        label: "Target Device",
        type: "select",
        gridSpan: 2,
        className: "relative z-0", // Add this for proper dropdown positioning
        selectProps: {
          MenuProps: {
            style: {
              zIndex: 9999, // Ensure dropdown appears above other elements
            },
            PaperProps: {
              style: {
                marginTop: '8px', // Add some spacing below the select
                position: 'absolute',
                zIndex: 9999,
              },
            },
          },
        }
      },
      { 
        name: "Number", 
        label: "Number", 
        type: "input",
        gridSpan: 2 
      },
    ],
  ];

  const dropdowns = {
    targetDevices: [
      { label: "Billboard", value: "billboard" },
      { label: "Cube Pro", value: "cubePro" },
      { label: "Mobile", value: "mobile" },
      { label: "Tv", value: "tv" },
      { label: "Pos", value: "pos" },
      { label: "Ipad", value: "ipad" },
    ],
  };

  const rows =  [
  {
    id: 1,
    deviceName: "iPhone 13 Pro",
    resulations: "1170 x 2532",
    status: "Active"
  },
  {
    id: 2,
    deviceName: "Samsung Galaxy S21",
    resulations: "1080 x 2400",
    status: "Inactive"
  },
  {
    id: 3,
    deviceName: "Google Pixel 6",
    resulations: "1080 x 2340",
    status: "Active"
  },
  {
    id: 4,
    deviceName: "iPad Air",
    resulations: "1640 x 2360",
    status: "Inactive"
  },
  {
    id: 5,
    deviceName: "MacBook Pro 14",
    resulations: "3024 x 1964",
    status: "Active"
  },
  {
    id: 6,
    deviceName: "Dell XPS 15",
    resulations: "3840 x 2400",
    status: "Inactive"
  }
];

  const columns = [
    {
      id: "deviceName",
      label: "Device Name",
    },
    {
      id: "resulations",
      label: "Resulations",
    },
   
    {
      id: "status",
      label: "Status",
    },
  ];

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Devices</h2>
        <Button
          label="Request Device"
          onClick={() => setIsOpen(true)}
          type="button"
        />
      </div>

      <ReusableTable columns={columns} rows={rows} loading={loading} filterKey='status'
                filterOptions={['all','Active','Inactive']}/>

      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        size="md"
        showCloseButton={true}
        containerClassName="bg-white rounded-xl"
        modalSx={{
          zIndex: 1300, 
          '& .MuiPopover-root': {
            zIndex: 9999, 
          }
        }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center -m-6 mb-0 p-6 pr-20 bg-[#4684ff] rounded-t-2xl">
            <div className="flex gap-4">
              <div className="w-15 h-15 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Request Device</h2>
                <p className="text-md text-white/70 mt-0.5">Submit a new device request</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="pt-2">
            <div className="space-y-4">
              {fieldsConfig.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {row.map((field) => (
                    <div key={field.name} className={field.gridSpan === 2 ? 'col-span-2' : 'col-span-1'}>
                      <label className="block font-semibold text-md text-gray-900 mb-1">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <select
                          {...methods.register(field.name, { required: `${field.label} is required` })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff] text-sm"
                        >
                          <option value="">Select {field.label}</option>
                          {dropdowns[field.name]?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          {...methods.register(field.name, { required: `${field.label} is required` })}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4684ff]/30 focus:border-[#4684ff] text-sm"
                        />
                      )}
                      {methods.formState.errors[field.name] && (
                        <p className="text-red-500 text-sm mt-1">
                          {methods.formState.errors[field.name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-blue-100 mt-6">
              <Button
                type="button"
                onClick={methods.handleSubmit(handleSubmit)}
                label="Submit Request"
                isIcon={false}
                className="cursor-pointer bg-[#5B7FE5] hover:bg-[#4a6dd4] shadow-md"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Devices;