import {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
} from '@multiversx/sdk-dapp/UI';
import { Box, Text, Spinner, Flex, Stack, Image } from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContextType, useAuthenticationContext } from '../services/authentication';
import { logout } from '@multiversx/sdk-dapp/utils';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdExtension, MdWeb } from 'react-icons/md';
import Ledger from '../assets/icons/Ledger.png';
import MultiversX from '../assets/icons/MultiversX.png';
import { START_OF_CONTEST, walletConnectV2ProjectId } from '../blockchain/config';
import Wallet from '../shared/Wallet';
import { isAfter } from 'date-fns';
import { Timer } from '../shared/Timer';
import { getUnlockBackground } from '../services/assets';
import { getBackgroundStyle } from '../services/helpers';

enum AuthenticationError {
    NotHolder = 'NotHolder',
    ContestNotStarted = 'ContestNotStarted',
}

const Unlock = () => {
    const commonProps = {
        nativeAuth: true,
        redirectAfterLogin: false,
    };

    const [error, setError] = useState<AuthenticationError>();
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    let { address } = useGetAccountInfo();
    const navigate = useNavigate();

    useEffect(() => {
        setError(undefined);

        if (isUserLoggedIn()) {
            checkAuthentication();
        }
    }, [address]);

    const hasGameStarted = (): boolean => isAfter(new Date(), START_OF_CONTEST);
    const isUserLoggedIn = (): boolean => !!address;

    const checkAuthentication = async () => {
        if (!address) {
            logout(`/unlock`);
        } else {
            if (!hasGameStarted()) {
                setError(AuthenticationError.ContestNotStarted);
                return;
            }

            setAuthentication(true);
            setTimeout(() => navigate('/'), 0);
        }
    };

    const getText = (text: string, displayTimer = false) => (
        <Flex flexDir="column" alignItems="center">
            <Text fontSize="17px" fontWeight={500} color="white" textAlign="center">
                {text}
            </Text>

            {displayTimer && (
                <Box mt={3}>
                    <Timer
                        timestamp={START_OF_CONTEST}
                        callback={() => checkAuthentication()}
                        isActive
                        isDescending
                        displayDays
                    />
                </Box>
            )}

            <Box mt={5}>
                <Wallet
                    callback={() => {
                        setError(undefined);
                    }}
                />
            </Box>
        </Flex>
    );

    return (
        <Flex
            backgroundColor="dark"
            style={getBackgroundStyle(getUnlockBackground())}
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
                {!error && !isUserLoggedIn() && (
                    <Text
                        textTransform="uppercase"
                        fontSize="22px"
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
                    {!isUserLoggedIn() ? (
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
                            {error === AuthenticationError.ContestNotStarted &&
                                getText('Waiting for the game to start', true)}

                            {error === AuthenticationError.NotHolder &&
                                getText('Playing the game requires an NFT from the Home X collections')}

                            {!error && <Spinner thickness="3px" emptyColor="gray.200" color="red.600" size="lg" />}
                        </Box>
                    )}
                </Stack>
            </Box>
        </Flex>
    );
};

export default Unlock;
