export const ticketRows = [
  {
    id: 1,
    srNo: 1,
    ticketID: "TKT-1001",
    userName: "John Carter",
    businessName: "QuickKart",
    role: "Retailer",
    subject: "Campaign approval delay",
    status: "INPROGRESS",
    priority: "Critical",
    raisedAt: "2023-05-15",
    mobile: "+1 555-123-4567",
    email: "john.carter@quickkart.com",
    category: "Software",
    media: [
      "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
      "https://images.unsplash.com/photo-1581093450023-0c6f311f3a72"
    ],
    adminRemark: "",
    userRemark: "We're now just 3 days away from our planned launch date. The delay is causing significant disruption to our marketing schedule and potential revenue loss. Please provide an ETA for approval or let us know if additional information is required from our side to expedite the process.",
    description: "The summer campaign needs urgent approval as the launch date is approaching. We've submitted all required creative assets and targeting parameters. Please review and approve at the earliest to meet our marketing timeline."
  },
  {
    id: 2,
    srNo: 2,
    ticketID: "TKT-1002",
    userName: "Jane Williams",
    businessName: "AdPro",
    role: "Ad Agency",
    subject: "Payment discrepancy",
    status: "OPEN",
    priority: "Moderate",
    raisedAt: "2023-05-16",
    mobile: "+1 555-234-5678",
    email: "jane.williams@adpro.com",
    category: "Software",
    media: [
      "https://images.unsplash.com/photo-1581094271901-8022df4466f9"
    ],
    adminRemark: "",
    userRemark: "Following up on this issue as we haven't received any update in 48 hours. This discrepancy is affecting our accounting close process for the month. Please confirm when we can expect a corrected invoice or clarification on the billing amount.",
    description: "Invoice #12345 for the May campaign shows an incorrect amount of $5,000 instead of the agreed $4,200. We've attached the contract and our calculations. Please verify and issue a corrected invoice."
  },
  {
    id: 3,
    srNo: 3,
    ticketID: "TKT-1003",
    userName: "Robert Chen",
    businessName: "TechSolutions",
    role: "Retailer",
    subject: "Dashboard not loading",
    status: "REOPEN",
    priority: "Low",
    raisedAt: "2023-05-17",
    mobile: "+1 555-345-6789",
    email: "robert.chen@techsolutions.com",
    category: "Hardware",
    media: [
      "https://images.unsplash.com/photo-1581093057305-4090d8adb7f0"
    ],
    adminRemark: "",
    userRemark: "The dashboard started working briefly after your last fix, but the issue has recurred. Now we're seeing the same 502 error plus occasional timeout messages. This is particularly problematic during our peak reporting hours (9-11 AM EST).",
    description: "The analytics dashboard fails to load with a 502 error. This started after the recent system update. We've tried clearing cache and different browsers. Screenshot of the error is attached."
  },
  {
    id: 4,
    srNo: 4,
    ticketID: "TKT-1004",
    userName: "Emily Park",
    businessName: "DigitalMedia",
    role: "Ad Agency",
    subject: "Bid adjustment request",
    status: "INPROGRESS",
    priority: "Moderate",
    raisedAt: "2023-05-18",
    mobile: "+1 555-456-7890",
    email: "emily.park@digitalmedia.com",
    category: "Software",
    media: [
      "https://images.unsplash.com/photo-1581094272260-8b4bcdb57b8f",
      "https://images.unsplash.com/photo-1581093057305-4090d8adb7f0"
    ],
    adminRemark: "",
    userRemark: "We've noticed our competitors have increased their bids significantly in the past 24 hours. Our campaign's impression share has dropped from 65% to 42%. Please implement this bid adjustment as soon as possible to maintain our market position.",
    description: "Requesting to increase max bid for campaign 'Summer Sale' from $1.50 to $2.00 due to increased competition. The campaign is underperforming on key metrics and needs this adjustment to remain competitive."
  },
  {
    id: 5,
    srNo: 5,
    ticketID: "TKT-1005",
    userName: "Michael Brown",
    businessName: "ElectroWorld",
    role: "Retailer",
    subject: "Reporting data mismatch",
    status: "OPEN",
    priority: "Low",
    raisedAt: "2023-05-19",
    mobile: "+1 555-567-8901",
    email: "michael.brown@electroworld.com",
    category: "Hardware",
    media: [
      "https://images.unsplash.com/photo-1581094272260-8b4bcdb57b8f",
      "https://images.unsplash.com/photo-1581093057305-4090d8adb7f0"
    ],
    adminRemark: "",
    userRemark: "We've double-checked our internal systems and confirmed the discrepancy. The variance appears to be consistent across all days in May. Could this be related to the attribution window settings or perhaps a tracking pixel issue?",
    description: "The sales report for May shows discrepancies between our internal records and the platform data. Specifically, the conversions for product SKU#EW-345 are underreported by approximately 15%. Need clarification on data sources."
  },
  {
    id: 6,
    srNo: 6,
    ticketID: "TKT-1006",
    userName: "Sarah Miller",
    businessName: "CreativeAds",
    role: "Ad Agency",
    subject: "Urgent: Campaign pause request",
    status: "RESOLVED",
    priority: "Critical",
    raisedAt: "2023-05-20",
    mobile: "+1 555-678-9012",
    email: "sarah.miller@creativeads.com",
    category: "Software",
    media: [
      "https://images.unsplash.com/photo-1581094272260-8b4bcdb57b8f",
      "https://images.unsplash.com/photo-1581093057305-4090d8adb7f0"
    ],
    adminRemark: "",
    userRemark: "Thank you for the quick response in pausing the campaign. We've now uploaded the corrected product feed with accurate pricing. Please confirm when we can safely restart the campaign with the updated information.",
    description: "Need to immediately pause campaign 'Summer Promo' as we've discovered incorrect pricing in the product feed. Continuing to run ads would result in significant financial loss. Please confirm pause and we'll follow up with corrected feed."
  }
];

export const ticketCounts = (rows) => {
  return rows.reduce((acc, ticket) => {
    if (ticket.status === "OPEN") acc.open++;
    else if (ticket.status === "INPROGRESS") acc.inProgress++;
    else if (ticket.status === "RESOLVED") acc.resolved++;
    else if (ticket.status === "REOPEN") acc.reopen++;
    else if (ticket.status === "CLOSED") acc.closed++;
    return acc;
  }, { open: 0, inProgress: 0, resolved: 0, reopen: 0, closed: 0, total: rows.length });
};