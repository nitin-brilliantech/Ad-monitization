import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDevices } from "../../../redux/slices/admin/terminalSlice";
import ReusableTable from "../../../components/table/ReusableTable";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/button/Button";

const TerminalDevices = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { devices, deviceLoading, deviceFetched } = useSelector(
    (state) => state.adminTerminal
  );
  const isDetails = location.pathname.includes("terminal-details");

  useEffect(() => {
    if (!deviceFetched) dispatch(fetchDevices());
  }, [deviceFetched, dispatch]);

  const refreshDevices = () => dispatch(fetchDevices());

  const formattedRows = useMemo(() => {
    if (!devices) return [];

    return devices.map((retailer) => ({
      id: retailer.retailerName,
      retailerBusiness: retailer.retailerBusiness,
      deviceNames: retailer.devices.map((d) => d.deviceName), 
      totalDevices: retailer.devices.map((d) => d.totalDevices), 
      retailerData: retailer,
    }));
  }, [devices]);

  // Columns
  const columns = [
    { id: "retailerBusiness", label: "Retailer" },
    {
      id: "deviceName",
      label: "Device Name",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.deviceNames.map((name, idx) => (
            <span key={idx}>{idx+1}.  {name}</span>
          ))}
        </div>
      ),
    },
    {
      id: "qty",
      label: "Total Devices",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.totalDevices.map((qty, idx) => (
            <span key={idx}>{qty}</span>
          ))}
        </div>
      ),
    },
    {
      id: "view",
      label: "View Details",
      render: (row) => (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            navigate("terminal-details", {
              state: { retailer: row.retailerData },
            });
          }}
          label="View"
          isIcon={false}
        />
      ),
    },
  ];

  return (
    <>
      {isDetails && <Outlet />}
      {!isDetails && (
        <div className="w-full">
          <h2 className="text-xl font-semibold mb-4">Devices</h2>

          <ReusableTable
            columns={columns}
            rows={formattedRows}
            loading={deviceLoading}
            onRefresh={refreshDevices}
            filterKey="status"
            filterOptions={["all", "ACTIVE", "INACTIVE"]}
            order="desc"
            orderBy="retailerBusiness"
            searchableColumns={["retailerBusiness", "deviceName", "regions"]}
          />
        </div>
      )}
    </>
  );
};

export default TerminalDevices;
