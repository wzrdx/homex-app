import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Center, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { MdExtension, MdWeb } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Ledger from '../assets/icons/Ledger.png';
import MultiversX from '../assets/icons/MultiversX.png';
import MazeMask from '../assets/images/maze_mask.png';
import LogoMirage from '../assets/logo_mirage.png';
import { getBackground1080p, getBackgroundQHD } from '../services/assets';
import { AuthenticationContextType, useAuthenticationContext } from '../services/authentication';
import { StoreContextType, useStoreContext } from '../services/store';

const Unlock = () => {
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;
    const { getStakingInfo } = useStoreContext() as StoreContextType;

    const navigate = useNavigate();

    const login = async () => {
        // stakingInfo is required by child components
        await getStakingInfo();

        setAuthentication(true);
        setTimeout(() => navigate('/'), 0);
    };

    return (
        <Flex
            backgroundColor="dark"
            backgroundImage={[
                `url(${getBackground1080p()})`,
                `url(${getBackground1080p()})`,
                `url(${getBackground1080p()})`,
                `url(${getBackgroundQHD()})`,
            ]}
            backgroundSize="cover"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            height="100vh"
            width="100vw"
            justifyContent="center"
            alignItems="center"
            color="whitesmoke"
        >
            <Center position="relative" flexDirection="column" py="6" px="8">
                <Stack spacing={3.5} mb={5}>
                    <Image src={LogoMirage} maxW="80px" margin="0 auto" />

                    <Text
                        layerStyle="faustina"
                        textTransform="uppercase"
                        fontSize="25px"
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

                <Stack
                    position="relative"
                    width="276px"
                    style={{
                        maskImage: `url(${MazeMask})`,
                        maskSize: '276px',
                        maskRepeat: 'no-repeat',
                    }}
                >
                    <Flex className="Login-Button" alignItems="center" justifyContent="space-between" onClick={login}>
                        <Flex alignItems="center">
                            <Box mb="2px" pl="2px" width="36px">
                                <MdExtension fontSize="19px" />
                            </Box>
                            <Text>Browser Extension</Text>
                        </Flex>

                        <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                    </Flex>

                    <Flex className="Login-Button" alignItems="center" justifyContent="space-between" onClick={login}>
                        <Flex alignItems="center">
                            <Box width="36px">
                                <MdWeb fontSize="21px" />
                            </Box>
                            <Text>MultiversX Web Wallet</Text>
                        </Flex>

                        <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                    </Flex>

                    <Flex className="Login-Button" alignItems="center" justifyContent="space-between" onClick={login}>
                        <Flex alignItems="center">
                            <Box width="36px" pl="2px">
                                <Image src={MultiversX} alt="MultiversX" width="18px" height="18px" />
                            </Box>
                            <Text>xPortal App</Text>
                        </Flex>

                        <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                    </Flex>

                    <Flex className="Login-Button" alignItems="center" justifyContent="space-between" onClick={login}>
                        <Flex alignItems="center">
                            <Box mb="1px" width="36px" pl="3px">
                                <Image src={Ledger} alt="Ledger" width="16px" height="16px" />
                            </Box>
                            <Text>Ledger</Text>
                        </Flex>

                        <ChevronRightIcon color="#f5f5f5db" boxSize={6} />
                    </Flex>
                </Stack>
            </Center>
        </Flex>
    );
};

export default Unlock;
