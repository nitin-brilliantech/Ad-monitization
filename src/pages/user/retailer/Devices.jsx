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
    <div className="p-4">
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
        containerClassName="bg-white rounded-xl"
        modalSx={{
          zIndex: 1300, 
          '& .MuiPopover-root': {
            zIndex: 9999, 
          }
        }}
      >
        <div className=" relative"> 
          <FormBuilder
            methods={methods}
            onSubmit={handleSubmit}
            dropdowns={dropdowns}
            fieldsConfig={fieldsConfig}
            title="Request Device"
            submitLabel="Submit Request"
            loading={false}
            isIcon={false}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Devices;