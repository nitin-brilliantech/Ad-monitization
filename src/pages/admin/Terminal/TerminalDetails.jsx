import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDeviceCount,
  fetchDevices,
} from "../../../redux/slices/admin/terminalSlice";
import StatusBadge from "../../../components/ui/badges/StatusBadge";
import ReusableTable from "../../../components/table/ReusableTable";
import Breadcrumbs from "../../../components/ui/bread-crumb/Breadcrumbs";
import Counter from "../../../components/ui/counter/Counter";
import Toast from "../../../components/ui/toast/Toast";

const TerminalDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    deviceFormLoading,
    deviceError,
    devices: globalDevices,
  } = useSelector((state) => state.adminTerminal);

  const passedRetailer = location.state?.retailer;
  const [retailer, setRetailer] = useState(passedRetailer || null);
  const [deviceList, setDeviceList] = useState([]);
  const debounceTimeout = useRef({});
  useEffect(() => {
    if (!passedRetailer) {
      navigate("/terminals");
      return;
    }

    const freshRetailer = globalDevices.find(
      (r) => r.userId === passedRetailer.userId
    );

    const retailerToUse = freshRetailer || passedRetailer;

    setRetailer(retailerToUse);
    setDeviceList(retailerToUse.devices || []);
  }, [passedRetailer, globalDevices, navigate]);

  useEffect(() => {
    return () => {
      dispatch(fetchDevices());
    };
  }, [dispatch]);

  // Debounced API update for counters
  const sendDeviceUpdate = useCallback(
    ({ deviceId, retailerId, activeDevices, inactiveDevices }) => {
      if (debounceTimeout.current[deviceId]) {
        clearTimeout(debounceTimeout.current[deviceId]);
      }

      debounceTimeout.current[deviceId] = setTimeout(() => {
        dispatch(
          updateDeviceCount({
            deviceId, 
            retailerId,
            activeDevices,
            inactiveDevices,
          })
        )
          .unwrap()
          .then(() => Toast.success("Device counts updated successfully"))
          .catch(() => Toast.error("Failed to update device counts"));
      }, 800);
    },
    [dispatch]
  );

  if (!retailer) return null;

  const columns = [
    { id: "deviceName", label: "Device Name" },
    { id: "totalDevices", label: "Total Devices" },
    {
      id: "activeDevices",
      label: "Active Devices",
      render: (row) => (
        <Counter
          value={row.activeDevices}
          min={0}
          max={row.totalDevices}
          size="sm"
          width="130px"
          color="green"
          onChange={(newActive) => {
            const newInactive = row.totalDevices - newActive;
            setDeviceList((prev) =>
              prev.map((d) =>
                d.id === row.id
                  ? {
                      ...d,
                      activeDevices: newActive,
                      inactiveDevices: newInactive,
                    }
                  : d
              )
            );

            sendDeviceUpdate({
              deviceId: row.id, 
              retailerId: retailer.userId,
              activeDevices: newActive,
              inactiveDevices: newInactive,
            });
          }}
        />
      ),
    },
    {
      id: "inactiveDevices",
      label: "Inactive Devices",
      render: (row) => (
        <Counter
          value={row.inactiveDevices}
          min={0}
          max={row.totalDevices}
          size="sm"
          width="130px"
          color="red"
          onChange={(newInactive) => {
            const newActive = row.totalDevices - newInactive;
            setDeviceList((prev) =>
              prev.map((d) =>
                d.id === row.id
                  ? {
                      ...d,
                      activeDevices: newActive,
                      inactiveDevices: newInactive,
                    }
                  : d
              )
            );

            sendDeviceUpdate({
              deviceId: row.id, 
              retailerId: retailer.userId,
              activeDevices: newActive,
              inactiveDevices: newInactive,
            });
          }}
        />
      ),
    },
    {
      id: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge
          isActive={row.status?.toUpperCase() === "ACTIVE"}
          size={12}
        />
      ),
    },
    {
      id: "regions",
      label: "Regions",
      render: (row) => row?.regions?.map((r) => r.name).join(", ") || "-",
    },
  ];

  return (
    <div className="p-4">
      <Breadcrumbs />
      <div className="px-4 py-4 mb-4 shadow bg-white rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{retailer.retailerBusiness}</h2>
        <p>
          <strong>Retailer Name:</strong> {retailer.retailerName}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Devices</h3>

      <ReusableTable
        columns={columns}
        rows={deviceList}
        loading={deviceFormLoading}
        filterKey="status"
        filterOptions={["all", "active", "inactive"]}
        searchableColumns={["deviceName", "regions"]}
      />

      {deviceError && (
        <p className="text-red-500 mt-3">
          {deviceError.error || "Failed to update device counts"}
        </p>
      )}
    </div>
  );
};

export default TerminalDetails;
