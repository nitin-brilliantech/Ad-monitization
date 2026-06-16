// src/components/PageTitle.jsx
import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = "BTS Ad Monetization";
  }, [title]);

  return null;
};

export default PageTitle;
