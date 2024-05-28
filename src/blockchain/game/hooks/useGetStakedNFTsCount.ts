import { useState } from 'react';

const FUNCTION_NAME = 'getStakedNFTsCount';

export const useGetStakedNFTsCount = () => {
    const [count, setCount] = useState<number>();

    const call = async (): Promise<number | undefined> => {
        try {
            const value = 3333;

            setCount(value);
            return value;
        } catch (err) {
            console.error(`Unable to call ${FUNCTION_NAME}`, err);
        }
    };

    return { stakedNFTsCount: count, getStakedNFTsCount: call };
};
