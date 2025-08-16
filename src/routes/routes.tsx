import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { Suspense, lazy, type JSX } from "react";
import { useAuth } from "../contexts/AuthContext";

const LoginPage = lazy(() => import("../pages/login"));
const RegisterPage = lazy(() => import("../pages/register"));
const DashboardPage = lazy(() => import("../pages/dashboard"));
const CustomersPage = lazy(() => import("../pages/customers"));
const RegisterCustomerPage = lazy(
  () => import("../pages/customers/newCustomers")
);
const EditCustomerPage = lazy(() => import("../pages/customers/editCustomers"));
const NotFoundPage = lazy(() => import("../pages/notFound"));

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated()) return <Navigate to="/login" replace />;

  return children;
}

export default function AppRoutes() {
  return (
    <Router>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <CustomersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/new"
            element={
              <PrivateRoute>
                <RegisterCustomerPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/customers/edit/:id"
            element={
              <PrivateRoute>
                <EditCustomerPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
