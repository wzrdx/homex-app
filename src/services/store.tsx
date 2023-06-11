import { createContext, useContext } from 'react';
import { StakingInfo, useGetStakingInfo } from '../blockchain/hooks/useGetStakingInfo';

export interface StoreContextType {
    stakingInfo: StakingInfo | undefined;
    getStakingInfo: () => Promise<StakingInfo | undefined>;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStoreContext = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
    const { stakingInfo, getStakingInfo } = useGetStakingInfo();

    return <StoreContext.Provider value={{ stakingInfo, getStakingInfo }}>{children}</StoreContext.Provider>;
};
