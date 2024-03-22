import {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
} from '@multiversx/sdk-dapp/UI';
import { Box, Text, Spinner, Flex, Stack, Image, Center } from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContextType, getNFTsCount, useAuthenticationContext } from '../services/authentication';
import { logout } from '@multiversx/sdk-dapp/utils';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { MdExtension, MdWeb } from 'react-icons/md';
import Ledger from '../assets/icons/Ledger.png';
import MultiversX from '../assets/icons/MultiversX.png';
import { ELDERS_COLLECTION_ID, TEAM, TRAVELERS_COLLECTION_ID, walletConnectV2ProjectId } from '../blockchain/config';
import Wallet from '../shared/Wallet';
import { getAlternateBackground, getUnlockBackground } from '../services/assets';
import { getBackgroundStyle } from '../services/helpers';
import { useStoreContext, StoreContextType } from '../services/store';
import { RESOURCE_ELEMENTS } from '../services/resources';
import MazeMask from '../assets/images/maze_mask.png';
import LogoMirage from '../assets/logo_mirage.png';

enum AuthenticationError {
    NotHolder = 'NotHolder',
    ContestNotStarted = 'ContestNotStarted',
    Paused = 'Paused',
}

const Unlock = () => {
    const commonProps = {
        nativeAuth: true,
        redirectAfterLogin: false,
    };

    const [error, setError] = useState<AuthenticationError>();
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;
    const { getStakingInfo } = useStoreContext() as StoreContextType;

    let { address } = useGetAccountInfo();
    const navigate = useNavigate();

    useEffect(() => {
        setError(undefined);

        if (isUserLoggedIn()) {
            checkAuthentication();
        }
    }, [address]);

    const isUserLoggedIn = (): boolean => !!address;

    const checkAuthentication = async () => {
        if (!address) {
            logout(`/unlock`);
        } else {
            // stakingInfo is required by child components
            const stakingInfo = await getStakingInfo();

            if ((stakingInfo && stakingInfo.isStaked) || TEAM.includes(address)) {
                console.warn('Bypassing authentication');
            } else {
                const { data: travelerTokens } = await getNFTsCount(address, TRAVELERS_COLLECTION_ID);
                const { data: elderTokens } = await getNFTsCount(address, ELDERS_COLLECTION_ID);

                if (travelerTokens + elderTokens === 0) {
                    setError(AuthenticationError.NotHolder);
                    return;
                }
            }

            setAuthentication(true);
            setTimeout(() => navigate('/'), 0);
        }
    };

    const getText = (text: string) => (
        <Flex flexDir="column" alignItems="center">
            <Text fontSize="17px" fontWeight={500} color="white" textAlign="center">
                {text}
            </Text>

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
            <Center
                position="relative"
                flexDirection="column"
                alignItems="center"
                borderRadius="md"
                overflow="hidden"
                py="6"
                px="8"
            >
                {!error && !isUserLoggedIn() && (
                    <Stack spacing={3} mb={4}>
                        <Image src={LogoMirage} maxW="106px" margin="0 auto" />

                        <Text
                            layerStyle="faustina"
                            textTransform="uppercase"
                            fontSize="32px"
                            fontWeight="600"
                            letterSpacing="1px"
                            textShadow="0 0 4px rgb(0 0 0 / 30%)"
                            textAlign="center"
                        >
                            Season{' '}
                            <Text as="span" color="mirage" fontWeight={800}>
                                2
                            </Text>
                        </Text>
                    </Stack>
                )}

                <Stack width="282px">
                    {!isUserLoggedIn() ? (
                        <Stack
                            position="relative"
                            style={{
                                maskImage: `url(${MazeMask})`,
                                maskSize: '282px',
                                maskRepeat: 'no-repeat',
                            }}
                        >
                            <ExtensionLoginButton buttonClassName="Login-Button" {...commonProps}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center">
                                        <Box mb="1px" pl="2px" width="36px">
                                            <MdExtension fontSize="19px" />
                                        </Box>
                                        <Text fontSize="17px">Browser Extension</Text>
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
                                        <Text fontSize="17px">MultiversX Web Wallet</Text>
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
                                        <Text fontSize="17px">xPortal App</Text>
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
                                        <Text fontSize="17px">Ledger</Text>
                                    </Box>

                                    <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                                </Box>
                            </LedgerLoginButton>
                        </Stack>
                    ) : (
                        <Box display="flex" flexDir="column" alignItems="center">
                            {/* {error === AuthenticationError.ContestNotStarted && getText('Waiting for the game to start', true)} */}

                            {error === AuthenticationError.NotHolder &&
                                getText('Playing the game requires an NFT from the Home X collections')}

                            {!error && <Spinner thickness="3px" emptyColor="gray.200" color="red.600" size="lg" />}
                        </Box>
                    )}
                </Stack>
            </Center>
        </Flex>
    );
};

export default Unlock;
