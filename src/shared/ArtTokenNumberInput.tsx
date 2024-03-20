import { useNumberInput, Stack, Button, Input } from '@chakra-ui/react';
import { useEffect } from 'react';
import { SFT } from '../blockchain/types';

export const ArtTokenNumberInput = ({
    token,
    updateFunction,
}: {
    token: SFT;
    updateFunction: React.Dispatch<
        React.SetStateAction<{
            [key: string]: number;
        }>
    >;
}) => {
    const { valueAsNumber, getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
        step: 1,
        defaultValue: token.balance,
        min: 1,
        max: token.balance,
        precision: 0,
    });

    const inc = getIncrementButtonProps();
    const dec = getDecrementButtonProps();
    const input = getInputProps();

    useEffect(() => {
        updateFunction((state) => ({
            ...state,
            [token.nonce]: valueAsNumber,
        }));
    }, [valueAsNumber]);

    return (
        <Stack direction="row" maxW="140px">
            <Button size="sm" {...dec}>
                -
            </Button>
            <Input size="sm" {...input} />
            <Button size="sm" {...inc}>
                +
            </Button>
        </Stack>
    );
};
