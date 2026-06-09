import { CheckCircle } from "@mui/icons-material";
import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import moment from "moment";
import ReusableTable from "../../../components/table/ReusableTable";
import Button from "../../../components/ui/button/Button";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayouts } from "../../../redux/slices/admin/payoutSlice";


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
                    <span className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Make Payment
                    </span>
                  }
                  isIcon={false}
                  className="bg-[#5B7FE5] hover:bg-[#4a6dd4] text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                />
              </Link>
            );
          } else {
            return (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Paid
              </span>
            );
          }
        }

        let bgColor = "bg-gray-100";
        let textColor = "text-gray-700";
        
        if (row.isApproved === "PENDING") {
          bgColor = "bg-yellow-100";
          textColor = "text-yellow-700";
        } else if (row.isApproved === "REJECTED") {
          bgColor = "bg-red-100";
          textColor = "text-red-700";
        }

        return (
          <span
            className={`inline-flex items-center px-3 py-1.5 ${bgColor} ${textColor} rounded-full text-sm font-semibold shadow-sm`}
          >
            {row.isApproved}
          </span>
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
    <div className="">
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