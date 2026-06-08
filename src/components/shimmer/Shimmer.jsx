import React from 'react';

const SummaryCardSkeleton = () => (
  <div className="w-full md:w-1/4 p-2">
    <div className="h-24 bg-gray-200 rounded-xl animate-pulse shadow-sm"></div>
  </div>
);

const CampaignRowSkeleton = () => (
  <tr className="border-b animate-pulse">
    <td className="p-4">
      <div className="h-4 w-4 bg-gray-300 rounded-sm"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-40 bg-gray-300 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-20 bg-gray-300 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-28 bg-gray-300 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-16 bg-gray-300 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
    </td>
    <td className="p-4">
      <div className="h-4 w-24 bg-gray-300 rounded"></div>
    </td>
  </tr>
);

const Shimmer = () => {
  return (
    <div className="p-6">
      {/* Welcome Text */}
      <div className="mb-6">
        <div className="h-6 w-60 bg-gray-300 rounded-md animate-pulse"></div>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-wrap -mx-2 mb-6">
        {[...Array(4)].map((_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>

      {/* Search & Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-72 bg-gray-200 rounded-md animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      </div>

      {/* Campaign Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              {['', 'Campaign Name', 'Slot', 'Bid Amount', 'Bids In Same Slot', 'Status', 'Result In'].map((header, index) => (
                <th key={index} className="p-4 text-sm font-medium text-gray-600">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(2)].map((_, index) => (
              <CampaignRowSkeleton key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shimmer;
