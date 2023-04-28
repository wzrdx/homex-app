import { Box, Link, Text } from '@chakra-ui/react';
import { logout } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getShortAddress } from '../services/helpers';
import { useNavigate } from 'react-router-dom';
import { IoWalletOutline } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

function Wallet({ callback }: { callback?: () => void }) {
    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    return (
        <Box display="flex" alignItems="center" background="#6f2a2ebd" padding="0.5rem 0.75rem" borderRadius="16px">
            <Box mr="0.6rem">
                <IoWalletOutline color="white" fontSize="18px" />
            </Box>
            <Text color="white" fontSize="14px">
                {getShortAddress(address)}
            </Text>
            <Link
                color="white"
                onClick={() => {
                    if (callback) {
                        callback();
                    }

                    logout(`/unlock`, (callbackUrl) => {
                        navigate(callbackUrl as string);
                    });
                }}
            >
                <Box ml="0.5rem" mt="1px" mr="-2px" color="white" _hover={{ color: '#ffffffad' }} cursor="pointer">
                    <MdClose fontSize="17px" />
                </Box>
            </Link>
        </Box>
    );
}

export default Wallet;
