export const withdrawFields = [
  [
    {
      name: "paymentMethod",
      label: "Payment Method",
      type: "checkbox",
      options: [
        { label: "UPI", value: "UPI" },
        { label: "Bank", value: "Bank" }
      ],
      gridSpan: 3,
    }
  ],
  [
    {
      name: "amount",
      label: "Withdraw Amount",
      type: "input",
      placeholder: "Enter amount",
      inputProps: {
        type: "number",
        min: 1,
      },
      gridSpan: 3,
    }
  ],
  [
    {
      name: "accountNo",
      label: "Account / UPI ID",
      type: "input",
      placeholder: "Enter account number or UPI ID",
      gridSpan: 3,
    }
  ]
];
