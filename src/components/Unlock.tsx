import { Center, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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
                    width="226px"
                    style={{
                        maskImage: `url(${MazeMask})`,
                        maskSize: '226px',
                        maskRepeat: 'no-repeat',
                    }}
                >
                    <Center className="Login-Button" onClick={login}>
                        <Text fontSize="20px">Play</Text>
                    </Center>
                </Stack>
            </Center>
        </Flex>
    );
};

export default Unlock;
