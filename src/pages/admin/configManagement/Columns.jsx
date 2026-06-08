export const getDeviceColumns = () => [
  {
    id: "srNo",
    label: "Sr No",
    needsIndex: true,          // <-- Added this flag
    render: (_, index) => <div>{index + 1}</div>,  // Uses row index + 1
  },
  {
    id: "name",
    label: "Device Name",
  },
  {
    id: "adResolution",
    label: "Ad Resolution",
    render: (row) =>`${row.resolutionHeight} X ${row.resolutionWidth}`
  },
  {
    id: "orientation",
    label: "Orientation",
  },
  {
    id: "price",
    label: "Price",
        render: (row) =>  `₹${row.price}`,

  },
];

export const getTierColumns = () => [
  {
    id: "srNo",
    label: "Sr No",
    needsIndex: true,  // <-- Added this flag
    render: (_, index) => <div>{index + 1}</div>,
  },
  {
    id: "name",
    label: "Name"
  },
  {
    id: "price",
    label: "Tier Price",
    render: (row) =>  `₹${row.price}`,
  },
];

export const getProductColumns = () => [
  {
    id: "srNo",
    label: "Sr No",
    needsIndex: true,  // <-- Added this flag
    render: (_, index) => <div>{index + 1}</div>,
  },
  {
    id: "name",
    label: "Product Name",
  },
  {
    id: "price",
    label: "Price",
    render: (row) =>  `₹${row.price}`,
  },
];
