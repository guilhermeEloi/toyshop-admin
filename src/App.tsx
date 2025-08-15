import AppRoutes from "./routes/routes";
import { ToastContainer } from "react-toastify";
import { CustomThemeProvider } from "./contexts/CustomThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import "./styles/global.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AppRoutes />
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
