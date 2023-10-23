import {
    Box,
    Button,
    Flex,
    Image,
    Link,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Stack,
    Switch,
    Text,
} from '@chakra-ui/react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useEffect, useState } from 'react';
import { getUsername } from '../../services/helpers';
import { getLevel } from '../../services/xp';

function Profile() {
    let { address } = useGetAccountInfo();

    const [username, setUsername] = useState<string>();
    const [xp, setXp] = useState<number>(200);
    const [levelInfo, setLevelInfo] = useState<{ level: number; percentage: number }>();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setUsername(await getUsername(address));
        setLevelInfo(getLevel(xp));
    };

    return (
        <Flex>
            {!levelInfo ? (
                <Spinner />
            ) : (
                <Box mt={2} px={4} py={4} borderRadius={12} backgroundColor="#111" minW="400px">
                    <Stack spacing={0} alignItems="center">
                        <Text fontSize="19px" mb="-2px" mt="-5px" fontWeight={500}>
                            {username}
                        </Text>
                        <Text>
                            Level{' '}
                            <Text as="span" fontWeight={500} color="brightBlue">
                                {levelInfo.level}
                            </Text>
                        </Text>
                        <Text fontSize="15px">
                            <Text as="span">{xp}</Text>{' '}
                            <Text as="span" fontWeight={800}>
                                XP
                            </Text>
                        </Text>
                    </Stack>

                    <Flex
                        position="relative"
                        mt={3}
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
                </Box>
            )}
        </Flex>
    );
}

export default Profile;
