import { Box, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { getShortAddress, getUsername } from '../../services/helpers';
import { getLevel } from '../../services/xp';
import { getPlayerXp } from '../../blockchain/api/getPlayerXp';
import { IoWalletOutline } from 'react-icons/io5';
import { logout } from '@multiversx/sdk-dapp/utils';
import { useAuthenticationContext, AuthenticationContextType } from '../../services/authentication';
import { useNavigate } from 'react-router-dom';

function Profile() {
    let { address } = useGetAccountInfo();

    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>();
    const [xp, setXp] = useState<number>();
    const [levelInfo, setLevelInfo] = useState<{
        level: number;
        percentage: number;
        nextLevelXp: number;
        xpLeft: number;
        color: string;
    }>();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setUsername(await getUsername(address));
        const xp = await getPlayerXp();
        setXp(xp);
        setLevelInfo(getLevel(xp));
    };

    return (
        <Flex>
            {!levelInfo ? (
                <Spinner />
            ) : (
                <Box mt={2} px={4} py={4} borderRadius={12} backgroundColor="#111" minW="400px">
                    <Stack spacing={4}>
                        <Stack spacing={0} alignItems="center">
                            <Text fontSize="19px" mb="-2px" mt="-5px" fontWeight={500}>
                                {username}
                            </Text>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <IoWalletOutline color="whitesmoke" fontSize="14px" />
                                <Text color="whitesmoke">{getShortAddress(address)}</Text>
                            </Stack>

                            <Text>
                                Level{' '}
                                <Text as="span" fontWeight={500} color={levelInfo.color}>
                                    {levelInfo.level}
                                </Text>
                            </Text>
                            <Text fontSize="15px">
                                <Text as="span">{xp}</Text>{' '}
                                <Text as="span" fontWeight={800}>
                                    XP
                                </Text>
                            </Text>

                            <Text
                                pt={2}
                                color="redClrs"
                                transition="all 0.05s ease-in"
                                cursor="pointer"
                                _hover={{ opacity: 0.75 }}
                                onClick={() => {
                                    setAuthentication(false);

                                    logout(`/unlock`, (callbackUrl) => {
                                        navigate(callbackUrl as string);
                                    });
                                }}
                            >
                                Disconnect
                            </Text>
                        </Stack>

                        <Flex
                            position="relative"
                            width="100%"
                            backgroundColor="#222"
                            justifyContent="space-between"
                            alignItems="center"
                            px={3}
                            py={0.5}
                            borderRadius="9999px"
                            overflow="hidden"
                        >
                            <Text zIndex={1} textShadow="1px 1px 0px #000">
                                {levelInfo.level}
                            </Text>
                            <Text zIndex={1} textShadow="1px 1px 0px #000">
                                {levelInfo.level + 1}
                            </Text>

                            <Flex
                                zIndex={1}
                                position="absolute"
                                justifyContent="center"
                                alignItems="center"
                                top={0}
                                right={0}
                                bottom={0}
                                left={0}
                            >
                                <Text textShadow="1px 1px 2px #000">{levelInfo.percentage}%</Text>
                            </Flex>

                            <Flex position="absolute" top={0} right={0} bottom={0} left={0}>
                                <Box width={`${levelInfo.percentage}%`} backgroundColor="#6277BE" borderRadius="9999px"></Box>
                            </Flex>
                        </Flex>

                        <Stack spacing={1}>
                            <Flex alignItems="center" justifyContent="space-between">
                                <Text fontSize="15px">Next Level</Text>
                                <Text fontSize="15px">
                                    <Text as="span">{levelInfo.nextLevelXp}</Text>{' '}
                                    <Text as="span" fontWeight={800}>
                                        XP
                                    </Text>
                                </Text>
                            </Flex>

                            <Flex alignItems="center" justifyContent="space-between">
                                <Text fontSize="15px">Remaining</Text>
                                <Text fontSize="15px">
                                    <Text as="span">{levelInfo.xpLeft}</Text>{' '}
                                    <Text as="span" fontWeight={800}>
                                        XP
                                    </Text>
                                </Text>
                            </Flex>
                        </Stack>
                    </Stack>
                </Box>
            )}
        </Flex>
    );
}

export default Profile;
