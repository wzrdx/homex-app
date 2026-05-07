import { ReactNode, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthenticationContext, AuthenticationContextType } from '../services/authentication';
import { routeNames } from '../services/routes';
import { useGetAccountInfo } from 'services/dapp';
import { logout } from 'services/dapp';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, setAuthentication } = useAuthenticationContext() as AuthenticationContextType;
    let { address } = useGetAccountInfo();

    useEffect(() => {
        if (isAuthenticated && !address) {
            setAuthentication(false);
            logout('/unlock');
        }
    }, [isAuthenticated, address]);

    if (!isAuthenticated) {
        return <Navigate to={routeNames.unlock} replace />;
    }

    return <>{children}</>;
};
