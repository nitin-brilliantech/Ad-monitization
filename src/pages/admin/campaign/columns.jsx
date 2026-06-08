import ApprovalBadge from "../../../components/ui/badges/ApprovalBadge"


const getCampaignColumns = () => [
   {
    id: "campaignCode",
    label: "Campaign ID",
  },
  {
    id: "name",
    label: "Campaign Name",
   
  },
  { id: "brandName", label: "Brand Name", },
  {
    id: "schedule",
    label: "Schedule",
    render: (row) =>(
      <div>
        {row.startTime && row.endTime
          ? `${row.startTime} - ${row.endTime}`
          : "N/A"}
      </div>
    )
  },
  { id: "adType", label: "Ad Type" },
  {
    id: "baseBid",
    label: "Amount",
    render: (row) => `₹ ${row.baseBid} /-`,
  },
  {
    id: "isApproved",
    label: "Approval",
    render: (row) => <ApprovalBadge status={row.isApproved} size={11}/>
  },
];

export default getCampaignColumns;
