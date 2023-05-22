import {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
} from '@multiversx/sdk-dapp/UI';
import { Box, Text, Spinner, Flex, Stack, Image } from '@chakra-ui/react';
import { useGetAccountInfo, useGetIsLoggedIn, useGetLoginInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContextType, getTokenCount, useAuthenticationContext } from '../services/authentication';
import { getAddress } from '@multiversx/sdk-dapp/utils';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdExtension, MdWeb } from 'react-icons/md';
import Ledger from '../assets/icons/Ledger.png';
import MultiversX from '../assets/icons/MultiversX.png';
import { walletConnectV2ProjectId } from '../blockchain/config';
import Wallet from '../shared/Wallet';

enum AuthenticationError {
    NotHolding = 'NotHolding',
    RequestError = 'RequestError',
}

const Unlock = () => {
    const commonProps = {
        nativeAuth: true,
        redirectAfterLogin: false,
    };

    const [error, setError] = useState<AuthenticationError>();
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    let { address } = useGetAccountInfo();
    const { isLoggedIn } = useGetLoginInfo();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            checkAuthentication();
        }
    }, [isLoggedIn]);

    const checkAuthentication = async () => {
        try {
            if (!address) {
                address = await getAddress();
            }

            const { data } = await getTokenCount(address);

            onAuthenticationResult(data > 0);
        } catch (err) {
            console.error('Unable to fetch NFTs of user');
            setError(AuthenticationError.RequestError);
        }
    };

    const onAuthenticationResult = (isSuccessful: boolean) => {
        if (isSuccessful) {
            console.log('# Double checking if address is available', address);

            setAuthentication(true);
            setTimeout(() => navigate('/'), 0);
        } else {
            console.log('User is not Holder');
            setError(AuthenticationError.NotHolding);
        }
    };

    const getText = (text: string) => (
        <Box display="flex" flexDir="column" alignItems="center">
            <Text color="white" mb={6} textAlign="center">
                {text}
            </Text>
            <Wallet
                callback={() => {
                    setError(undefined);
                }}
            />
        </Box>
    );

    return (
        <Flex
            backgroundColor="dark"
            height="100vh"
            width="100vw"
            justifyContent="center"
            alignItems="center"
            color="whitesmoke"
        >
            <Box
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                width="394px"
                borderRadius="md"
                overflow="hidden"
                py="6"
                px="8"
            >
                {!error && !isLoggedIn && (
                    <Text
                        textTransform="uppercase"
                        fontSize="21px"
                        fontWeight="500"
                        letterSpacing="0.5px"
                        mb="1.5rem"
                        color="whitesmoke"
                        textShadow="0 0 4px rgb(0 0 0 / 30%)"
                    >
                        Connect wallet
                    </Text>
                )}

                <Stack width="100%">
                    {!isLoggedIn ? (
                        <>
                            <ExtensionLoginButton buttonClassName="Login-Button" {...commonProps}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Box mb="1px" pl="2px" width="36px">
                                            <MdExtension fontSize="19px" />
                                        </Box>
                                        <Text fontSize="16px">Browser Extension</Text>
                                    </Box>

                                    <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                                </Box>
                            </ExtensionLoginButton>

                            <WebWalletLoginButton buttonClassName="Login-Button" callbackRoute="/" {...commonProps}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Box width="36px">
                                            <MdWeb fontSize="21px" />
                                        </Box>
                                        <Text fontSize="16px">MultiversX Web Wallet</Text>
                                    </Box>

                                    <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                                </Box>
                            </WebWalletLoginButton>

                            <WalletConnectLoginButton
                                buttonClassName="Login-Button"
                                {...commonProps}
                                {...(walletConnectV2ProjectId
                                    ? {
                                          isWalletConnectV2: true,
                                      }
                                    : {})}
                            >
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Box width="36px" pl="2px">
                                            <Image src={MultiversX} alt="MultiversX" width="18px" height="18px" />
                                        </Box>
                                        <Text fontSize="16px">xPortal App</Text>
                                    </Box>

                                    <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                                </Box>
                            </WalletConnectLoginButton>

                            <LedgerLoginButton buttonClassName="Login-Button" {...commonProps}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Box width="36px" pl="3px">
                                            <Image src={Ledger} alt="Ledger" width="16px" height="16px" />
                                        </Box>
                                        <Text fontSize="16px">Ledger</Text>
                                    </Box>

                                    <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                                </Box>
                            </LedgerLoginButton>
                        </>
                    ) : (
                        <Box display="flex" flexDir="column" alignItems="center">
                            {error === AuthenticationError.NotHolding &&
                                getText('Playing the game requires an NFT from the Home X collection')}

                            {error === AuthenticationError.RequestError &&
                                getText('Error occurred while fetching NFTs, please reload this page')}

                            {!error && <Spinner thickness="3px" emptyColor="gray.200" color="red.600" size="lg" />}
                        </Box>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
};

export default Unlock;
