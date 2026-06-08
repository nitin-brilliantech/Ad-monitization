// src/routes/AppRoutes.jsx
import { Routes } from "react-router-dom";
import { dashboardRoutes } from "./DashboardRoutes";
import { publicRoutes } from "./PublicRoutes";
import { Suspense } from "react";
import Loader from "../components/loader/Loader";
const AppRoutes = () => {

  return (
    <Suspense>
    <Routes>
      {[...dashboardRoutes, ...publicRoutes]}
    </Routes>
    </Suspense>



  );
};

export default AppRoutes;
