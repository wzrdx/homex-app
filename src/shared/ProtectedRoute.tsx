import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthenticationContext, AuthenticationContextType } from '../services/authentication';
import { routeNames } from '../services/routes';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuthenticationContext() as AuthenticationContextType;

    if (!isAuthenticated) {
        return <Navigate to={routeNames.unlock} replace />;
    }

    return <>{children}</>;
};
