import { Box, Text, Button, Stack } from '@chakra-ui/react';
import { logout } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getShortAddress } from '../services/helpers';
import { useNavigate } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';
import { AuthenticationContextType, useAuthenticationContext } from '../services/authentication';

function Wallet({ callback }: { callback?: () => void }) {
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    return (
        <Stack direction="row" spacing={4} alignItems="center" backgroundColor="#1f1f1f" borderRadius="md" px={4} py={3}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                    <IoWalletOutline color="whitesmoke" fontSize="20px" />
                </Box>
                <Text>{getShortAddress(address)}</Text>
            </Stack>

            <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                    if (callback) {
                        callback();
                    }

                    setAuthentication(false);

                    logout(`/unlock`, (callbackUrl) => {
                        navigate(callbackUrl as string);
                    });
                }}
            >
                Disconnect
            </Button>
        </Stack>
    );
}

export default Wallet;
