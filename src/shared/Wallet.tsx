import { Box, Link, Text, Flex } from '@chakra-ui/react';
import { logout } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getShortAddress } from '../services/helpers';
import { useNavigate } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';
import { AuthenticationContextType, useAuthenticationContext } from '../services/authentication';

function Wallet({ callback }: { callback?: () => void }) {
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    return (
        <Flex alignItems="center" backgroundColor="#1f1f1f" borderRadius="9999px" padding="9px 16px">
            <Box mr="0.6rem">
                <IoWalletOutline color="whitesmoke" fontSize="18px" />
            </Box>
            <Text color="whitesmoke" fontSize="15px">
                {getShortAddress(address)}
            </Text>
            <Link
                color="whitesmoke"
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
                <Box ml="0.5rem" mt="1px" mr="-2px" color="whitesmoke" _hover={{ color: '#ffffffad' }} cursor="pointer">
                    <MdClose fontSize="17px" />
                </Box>
            </Link>
        </Flex>
    );
}

export default Wallet;
