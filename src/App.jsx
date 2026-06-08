import Dashboard from "./pages/Dashboard";
import AppLayout from "./layout/AppLayout";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
   
    </>
  );
};
export default App;
