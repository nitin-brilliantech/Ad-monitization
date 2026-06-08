export const getBaseBidSumsByStatus = (campaigns) => {
  let approvedSum = 0;
  let pendingSum = 0;
  let rejectedSum = 0;

  campaigns.forEach((campaign) => {
    const bid = Number(campaign.baseBid) || 0;
    const status = (campaign.isApproved || '').toUpperCase();

    if (status === 'APPROVED') {
      approvedSum += bid;
    } else if (status === 'PENDING') {
      pendingSum += bid;
    } else if (status === 'REJECTED') {
      rejectedSum += bid;
    }
  });

  return { approvedSum, pendingSum, rejectedSum };
};

export const getMaxBidCapSumsByStatus = (campaigns) => {
  let approvedSum = 0;
  let pendingSum = 0;
  let rejectedSum = 0;

  campaigns.forEach((campaign) => {
    const cap = Number(campaign.maxBidCap || campaign.maxBid);
    const value = isNaN(cap) ? 0 : cap;
    const status = (campaign.isApproved || '').toUpperCase();

    if (status === 'APPROVED') {
      approvedSum += value;
    } else if (status === 'PENDING') {
      pendingSum += value;
    } else if (status === 'REJECTED') {
      rejectedSum += value;
    }
  });

  return { approvedSum, pendingSum, rejectedSum };
};

// sumFunctions.js
export const countActivCampaigns = (campaigns) => {
  if (!Array.isArray(campaigns)) return 0;
  // return campaigns.filter(c => c.isActive === true ).length;
  return campaigns.length;
};

