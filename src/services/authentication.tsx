import { createContext, useContext, useState } from 'react';

export interface AuthenticationContextType {
    isAuthenticated: boolean;
    setAuthentication: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const useAuthenticationContext = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
    const [isAuthenticated, setAuthentication] = useState(false);

    return (
        <AuthenticationContext.Provider value={{ isAuthenticated, setAuthentication }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
