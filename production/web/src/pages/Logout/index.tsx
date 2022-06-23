import { useLayoutEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../components/AuthContext/useAuth";

export const Logout = () => {
  const { logout } = useAuth();

  useLayoutEffect(() => {
    logout();
  }, [logout]);

  return (
    <Navigate to="/auth/login" replace />
  );
}