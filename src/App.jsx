import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable={false}
        icon={false}
        closeButton={false}
        toastClassName={() =>
          "relative flex p-0 min-h-0 rounded-xl overflow-hidden cursor-default"
        }
        bodyClassName={() => "flex-1 p-0 m-0"}
        style={{ top: "76px", right: "16px", zIndex: 9999 }}
      />
    </>
  );
};

export default App;
