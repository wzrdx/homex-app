import {
    ExtensionLoginButton,
    WebWalletLoginButton,
    LedgerLoginButton,
    WalletConnectLoginButton,
} from '@multiversx/sdk-dapp/UI';
import { Box, Text, Spinner, Flex, Stack, Image, Center, Link } from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationContextType, getNFTsCount, useAuthenticationContext } from '../services/authentication';
import { logout } from '@multiversx/sdk-dapp/utils';
import { ArrowForwardIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { MdExtension, MdWeb } from 'react-icons/md';
import Ledger from '../assets/icons/Ledger.png';
import MultiversX from '../assets/icons/MultiversX.png';
import { ELDERS_COLLECTION_ID, TEAM, TRAVELERS_COLLECTION_ID, walletConnectV2ProjectId } from '../blockchain/config';
import Wallet from '../shared/Wallet';
import { getUnlockBackground } from '../services/assets';
import { getBackgroundStyle } from '../services/helpers';
import { useStoreContext, StoreContextType } from '../services/store';
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

    const getError = () => (
        <Stack spacing={8} alignItems="center">
            <Text fontSize="17px" fontWeight={500} textAlign="center">
                Playing the game requires an NFT from the following{' '}
                <Text as="span" color="redClrs">
                    Home X
                </Text>{' '}
                collections:
            </Text>

            <Stack spacing={1}>
                <Link href="https://xoxno.com/collection/TRAVELER-51bdef" isExternal _hover={{ opacity: 0.75 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowForwardIcon fontSize="18px" />
                        <Text fontWeight={500}>The First Travelers</Text>
                    </Stack>
                </Link>

                <Link href="https://xoxno.com/collection/HOMEXELDER-d43957" isExternal _hover={{ opacity: 0.75 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <ArrowForwardIcon fontSize="18px" />
                        <Text fontWeight={500}>The Elders</Text>
                    </Stack>
                </Link>
            </Stack>

            <Wallet
                callback={() => {
                    setError(undefined);
                }}
            />
        </Stack>
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
            <Center position="relative" flexDirection="column" py="6" px="8">
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

                {!isUserLoggedIn() ? (
                    <Stack
                        position="relative"
                        width="282px"
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
                        {error === AuthenticationError.NotHolder && getError()}

                        {!error && <Spinner thickness="3px" emptyColor="gray.200" color="mirage" size="lg" />}
                    </Box>
                )}
            </Center>
        </Flex>
    );
};

export default Unlock;
