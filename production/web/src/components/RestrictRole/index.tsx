import { Navigate } from "react-router";
import { useAuth } from "../AuthContext/useAuth";

export interface RestrictRoleProps {
  children: React.ReactNode;
  roles: string[];
  redirect?: boolean;
}

export const RestrictRole = ({ children, roles, redirect }: RestrictRoleProps) => {
  const { user, mounted } = useAuth();

  
  if (mounted && user && roles.includes(user.role)) {
    return (
      <>
        {children}
      </>
    );
  }

  return mounted && redirect ? (
    <>
      <Navigate to='/auth/login' replace />
    </>
  ) : <></>;
};
