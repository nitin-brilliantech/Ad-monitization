import { CheckCircle } from "@mui/icons-material";
import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import moment from "moment";
import ReusableTable from "../../../components/table/ReusableTable";
import Button from "../../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayouts } from "../../../redux/slices/admin/payoutSlice";
import Swal from "sweetalert2";


const RevenuePayouts = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  //  correct selector (slice key = payouts)
  const { payouts, loading, error } = useSelector((state) => state.payout);

  
  
  useEffect(() => {
    dispatch(fetchPayouts());
  }, [dispatch]);

  const isNestedRoute = location.pathname.includes("/pay");
  
  const columns = [
    {
      id: "withdrawalRequestCode",
      label: "Request Code",
    },
    {
      id: "name",
      label: "Name",
    },
    {
      id: "amount",
      label: "Amount",
      numeric: true,
    },
    {
      id: "paymentMethod",
      label: "Payment Method",
      render: (row) => <span>{row.paymentMethod.toUpperCase()}</span>,
    },
    {
      id: "isApproved",
      label: "Actions",
      render: (row) => {
        if (row.isApproved === "APPROVED") {
          if (!row.isPaid) {
            return (
              <Link to="pay" state={{ row }}>
                <Button
                  type="button"
                  label={
                    <span className="flex items-center gap-1">
                      <CheckCircle className="text-green-500" fontSize="small" />
                      Make Payment
                    </span>
                  }
                  isIcon={false}
                  className="cursor-pointer"
                />
              </Link>
            );
          } else {
            return (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-sm font-semibold inline-block">
                <CheckCircle fontSize="small" />
                Paid
              </span>
            );
          }
        }

        let bgColor = "bg-gray-200";
        let textColor = "text-gray-700";
        
        if (row.isApproved === "PENDING") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
        } else if (row.isApproved === "REJECTED") {
          bgColor = "bg-red-100";
          textColor = "text-red-700";
        }

        return (
          <div
            className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-sm font-semibold inline-block`}
          >
            {row.isApproved}
          </div>
        );
      },
    },
    {
      id: "updatedAt",
      label: "Date",
      render: (row) => (
        <span>{moment(row.updatedAt).format("DD/MM/YYYY")}</span>
      ),
    },
  ];

  // Nested route handling
  if (isNestedRoute) {
    return <Outlet />;
  }
  const filterdPayouts = payouts.filter((c)=>c.isApproved==='APPROVED')
  
  return (
    <div className="p-6">
      <Typography variant="h5" fontWeight={600} mb={3}>
        Revenue & Payouts
      </Typography>

      {/* ✅ Error State */}
      {error && (
        <div className="text-red-600 bg-red-100 px-4 py-2 rounded">
          {error}
        </div>
      )}

      {/* ✅ Data Table */}
      {!error && (
        <ReusableTable
          columns={columns}
          rows={filterdPayouts}
          filterKey="isPaid"
          filterOptions={["all", "paid", "unpaid"]}
          onRefresh={() => dispatch(fetchPayouts())}
          loading={loading}
          searchableColumns={["withdrawalRequestCode","name","amount","paymentMethod","updatedAt"]}
        />
      )}
    </div>
  );
};

export default RevenuePayouts;