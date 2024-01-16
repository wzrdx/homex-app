import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Spinner, Stack, Text, Center } from '@chakra-ui/react';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { BiInfoCircle } from 'react-icons/bi';
import { FaRegCheckCircle } from 'react-icons/fa';
import { BsGem } from 'react-icons/bs';
import { GoTrophy } from 'react-icons/go';
import { AchievementsContextType, PAGE_HEADERS, TravelersLogBadge, useAchievementsContext } from '../../services/achievements';

export const Page = ({ index, toggleMint }) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [badges, setBadges] = useState<TravelersLogBadge[]>([]);

    const { pages, data } = useAchievementsContext() as AchievementsContextType;

    useEffect(() => {
        init();
    }, [index, data]);

    const init = async () => {
        const requiredData = data[pages[index].dataKey];

        if (!requiredData) {
            pages[index].getData();
        } else {
            setBadges(await pages[index].getBadges(requiredData));
            setLoading(false);
        }
    };

    return (
        <Stack spacing={{ md: 8, lg: 10 }} height="100%">
            {isLoading ? (
                <Center height="100%">
                    <Spinner />
                </Center>
            ) : (
                <>
                    <Flex justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={4}>
                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                {PAGE_HEADERS[index].title}
                            </Text>

                            <Stack direction="row" spacing={12}>
                                <Stack spacing={2.5} direction="row" alignItems="stretch">
                                    <Box color="travelersLog">
                                        <IconWithShadow shadowColor="#222">
                                            <GoTrophy fontSize="36px" />
                                        </IconWithShadow>
                                    </Box>

                                    <Flex flexDir="column" justifyContent="space-between">
                                        <Text
                                            fontWeight={500}
                                            color="travelersLog"
                                            letterSpacing="1px"
                                            fontSize="17px"
                                            lineHeight="17px"
                                        >
                                            {_(badges)
                                                .filter((badge) => !!badge.isUnlocked)
                                                .size()}
                                            <Text as="span" mx={0.5}>
                                                /
                                            </Text>
                                            {badges.length}
                                        </Text>

                                        <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                            Unlocked
                                        </Text>
                                    </Flex>
                                </Stack>

                                <Stack spacing={2.5} direction="row" alignItems="stretch">
                                    <Box color={`blizzard${PAGE_HEADERS[index].rarity}`}>
                                        <IconWithShadow shadowColor="#222">
                                            <BsGem fontSize="36px" />
                                        </IconWithShadow>
                                    </Box>

                                    <Flex flexDir="column" justifyContent="space-between">
                                        <Text
                                            fontWeight={500}
                                            color={`blizzard${PAGE_HEADERS[index].rarity}`}
                                            letterSpacing="1px"
                                            fontSize="17px"
                                            lineHeight="17px"
                                        >
                                            {PAGE_HEADERS[index].rarity}
                                        </Text>
                                        <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                            Rarity
                                        </Text>
                                    </Flex>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack direction="row" spacing={3} alignItems="center" py={1.5}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                {!_(badges)
                                    .filter((badge) => !badge.isUnlocked)
                                    .size() ? (
                                    <>
                                        <Box color="mintGreen" pb="1px">
                                            <IconWithShadow shadowColor="#222">
                                                <FaRegCheckCircle />
                                            </IconWithShadow>
                                        </Box>

                                        <Text fontSize="15px" textShadow="1px 1px 0px #222" color="mintGreen">
                                            Minting available
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Box color="#cbcbcb" pb="1px">
                                            <IconWithShadow shadowColor="#222">
                                                <BiInfoCircle fontSize="19px" />
                                            </IconWithShadow>
                                        </Box>

                                        <Text fontSize="15px" textShadow="1px 1px 0px #222" color="#cbcbcb">
                                            Unlock{' '}
                                            {_(badges)
                                                .filter((badge) => !badge.isUnlocked)
                                                .size()}{' '}
                                            more to mint
                                        </Text>
                                    </>
                                )}
                            </Stack>

                            <Button colorScheme="blue" onClick={toggleMint}>
                                Mint page
                            </Button>
                        </Stack>
                    </Flex>

                    <Box
                        mb={1.5}
                        display="grid"
                        gridAutoColumns="1fr 1fr"
                        gridTemplateColumns="1fr 1fr 1fr"
                        rowGap={{ md: 6, lg: 9 }}
                        columnGap={8}
                    >
                        {badges.map((badge, index) => (
                            <Stack key={index} spacing={4} position="relative" alignItems="center" px={6} minH="224px">
                                <Image
                                    src={badge.isUnlocked ? badge.assets[1] : badge.assets[0]}
                                    maxH={{ md: '120px', lg: '168px', xl: '206px' }}
                                />

                                <Stack spacing={0} alignItems="center">
                                    <Text
                                        fontSize="15px"
                                        fontWeight={500}
                                        textTransform="uppercase"
                                        letterSpacing="0.5px"
                                        textShadow="1px 1px 0px #222"
                                        textAlign="center"
                                        color={badge.isUnlocked ? 'white' : '#bebebe'}
                                    >
                                        {badge.title}
                                    </Text>

                                    <Text
                                        fontSize="14px"
                                        lineHeight="19px"
                                        minH="38px"
                                        textShadow="1px 1px 0px #222"
                                        textAlign="center"
                                        color={badge.isUnlocked ? 'whitesmoke' : '#bebebe'}
                                    >
                                        {badge.text}
                                    </Text>

                                    <Box visibility={badge.value ? 'visible' : 'hidden'}>
                                        <Text
                                            mt={1.5}
                                            fontWeight={500}
                                            letterSpacing="0.25px"
                                            fontSize="15px"
                                            color="white"
                                            textShadow="1px 1px 0px #222"
                                        >
                                            {badge.value}
                                        </Text>
                                    </Box>
                                </Stack>
                            </Stack>
                        ))}
                    </Box>
                </>
            )}
        </Stack>
    );
};
