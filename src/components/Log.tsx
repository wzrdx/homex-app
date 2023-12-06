import _ from 'lodash';
import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getAlternateBackground } from '../services/assets';
import { getPageCelestialsCustodian } from '../blockchain/api/achievements/getPageCelestialsCustodian';
import { LuSwords } from 'react-icons/lu';
import { IconWithShadow } from '../shared/IconWithShadow';
import { BiInfoCircle } from 'react-icons/bi';
import { FaRegCheckCircle } from 'react-icons/fa';
import { LiaScrollSolid } from 'react-icons/lia';
import { BsGem } from 'react-icons/bs';
import { GoTrophy } from 'react-icons/go';
import { getBackgroundStyle } from '../services/helpers';
import { GiLockedChest } from 'react-icons/gi';
import { VscTools } from 'react-icons/vsc';
import { PAGES, TravelersLogPage } from '../services/achievements';
import { NewSymbol } from '../shared/NewSymbol';

const OFFSET = 0.5;
const BORDER_RADIUS = '16px';
const ACCENT_COLOR = 'travelersLog';

function Log() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [isMinting, setIsMinting] = useState<boolean>(false);

    const [pages, setPages] = useState<TravelersLogPage[]>(PAGES);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const celestials = await getPageCelestialsCustodian();

        const celestialsCustodian = [celestials.aurora, celestials.verdant, 0, 0, 0];
        celestialsCustodian.push(celestialsCustodian.every((amount) => amount > 0) ? 1 : 0);

        const celestialsCurator = [celestials.aurora, celestials.verdant, 0, 0, 0];
        celestialsCurator.push(celestialsCurator.every((amount) => amount >= 5) ? 1 : 0);

        setPages([
            {
                ...PAGES[0],
                badges: _.map(PAGES[0].badges, (badge, index) => ({
                    ...badge,
                    isUnlocked: celestialsCustodian[index] > 0,
                    value: index === PAGES[1].badges.length - 1 ? 0 : celestialsCustodian[index],
                })),
            },
            {
                ...PAGES[1],
                badges: _.map(PAGES[1].badges, (badge, index) => ({
                    ...badge,
                    isUnlocked:
                        index === PAGES[1].badges.length - 1
                            ? (_.last(celestialsCurator) as number) > 0
                            : celestialsCurator[index] >= 5,
                    value: index === PAGES[1].badges.length - 1 ? 0 : celestialsCurator[index],
                })),
            },
            {
                ...PAGES[2],
                badges: _.map(PAGES[2].badges, (badge, index) => ({
                    ...badge,
                    isUnlocked: true,
                    value: index,
                })),
            },
            {
                ...PAGES[3],
                badges: _.map(PAGES[3].badges, (badge, index) => ({
                    ...badge,
                    isUnlocked: true,
                    value: index,
                })),
            },
        ]);
    };

    const getTotalUnlocked = () => {
        const badges = _(pages)
            .map((page) => page.badges)
            .flatten()
            .value();

        return (
            <Text fontWeight={500} color={ACCENT_COLOR} letterSpacing="1px" fontSize="17px" lineHeight="17px">
                {badges.filter((badge) => badge.isUnlocked).length}
                <Text as="span" mx={0.5}>
                    /
                </Text>
                {badges.length}
            </Text>
        );
    };

    const getPageUnlocked = () => {
        return (
            <Text fontWeight={500} color={ACCENT_COLOR} letterSpacing="1px" fontSize="17px" lineHeight="17px">
                {_(pages[currentPage].badges)
                    .filter((badge) => !!badge.isUnlocked)
                    .size()}
                <Text as="span" mx={0.5}>
                    /
                </Text>
                {pages[currentPage].badges.length}
            </Text>
        );
    };

    return (
        <Box position="relative">
            <Flex
                position="relative"
                width="1260px"
                minH={{ md: '632px', lg: '736px' }}
                alignItems="stretch"
                backgroundColor="#2b2b2b"
                borderRadius={BORDER_RADIUS}
                overflow="hidden"
                zIndex={2}
            >
                {/* Left */}
                <Stack
                    flex={2}
                    spacing={{ md: 8, lg: 10 }}
                    py={{ md: 6, lg: 8 }}
                    px={{ md: 8, lg: 10 }}
                    backgroundColor="#00000020"
                    borderRight="1px solid #ffffff0d"
                >
                    <Stack spacing={3} alignItems="center">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <IconWithShadow shadowColor="#222">
                                <LuSwords fontSize="22px" />
                            </IconWithShadow>

                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                Traveler's Log
                            </Text>
                        </Stack>

                        <Stack spacing={2.5} direction="row" alignItems="stretch">
                            <Box color={ACCENT_COLOR}>
                                <IconWithShadow shadowColor="#222">
                                    <GoTrophy fontSize="36px" />
                                </IconWithShadow>
                            </Box>

                            <Flex flexDir="column" justifyContent="space-between">
                                {getTotalUnlocked()}
                                <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                    Unlocked
                                </Text>
                            </Flex>
                        </Stack>
                    </Stack>

                    <Stack spacing={4}>
                        <Stack spacing={1.5} direction="row" alignItems="center">
                            <IconWithShadow shadowColor="#222">
                                <LiaScrollSolid fontSize="23px" />
                            </IconWithShadow>

                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                Pages
                            </Text>
                        </Stack>

                        <Stack spacing={1}>
                            {pages.map((page, index) => (
                                <Box key={index}>
                                    <MenuItem
                                        title={page.title}
                                        isNew={page.isNew}
                                        color={`blizzard${page.rarity}`}
                                        text={`${_(pages[index].badges)
                                            .filter((badge) => !!badge.isUnlocked)
                                            .size()} / ${pages[index].badges.length} Unlocked`}
                                        isActive={index === currentPage}
                                        onClick={() => setCurrentPage(index)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>

                {/* Right */}
                <Box flex={7} position="relative" py={{ md: 6, lg: 8 }} px={{ md: 8, lg: 10 }}>
                    {isMinting ? (
                        <PageMint pageIndex={currentPage} page={pages[currentPage]} goBack={() => setIsMinting(false)} />
                    ) : (
                        <Stack spacing={{ md: 8, lg: 10 }} height="100%">
                            <Flex justifyContent="space-between" alignItems="flex-start">
                                <Stack spacing={3}>
                                    <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                        {pages[currentPage].title}
                                    </Text>

                                    <Stack direction="row" spacing={12}>
                                        <Stack spacing={2.5} direction="row" alignItems="stretch">
                                            <Box color={ACCENT_COLOR}>
                                                <IconWithShadow shadowColor="#222">
                                                    <GoTrophy fontSize="36px" />
                                                </IconWithShadow>
                                            </Box>

                                            <Flex flexDir="column" justifyContent="space-between">
                                                {getPageUnlocked()}
                                                <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                                    Unlocked
                                                </Text>
                                            </Flex>
                                        </Stack>

                                        <Stack spacing={2.5} direction="row" alignItems="stretch">
                                            <Box color={`blizzard${pages[currentPage].rarity}`}>
                                                <IconWithShadow shadowColor="#222">
                                                    <BsGem fontSize="36px" />
                                                </IconWithShadow>
                                            </Box>

                                            <Flex flexDir="column" justifyContent="space-between">
                                                <Text
                                                    fontWeight={500}
                                                    color={`blizzard${pages[currentPage].rarity}`}
                                                    letterSpacing="1px"
                                                    fontSize="17px"
                                                    lineHeight="17px"
                                                >
                                                    {pages[currentPage].rarity}
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
                                        {!_(pages[currentPage].badges)
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
                                                    {_(pages[currentPage].badges)
                                                        .filter((badge) => !badge.isUnlocked)
                                                        .size()}{' '}
                                                    more to mint
                                                </Text>
                                            </>
                                        )}
                                    </Stack>
                                    <Button colorScheme="blue" onClick={() => setIsMinting(true)}>
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
                                {pages[currentPage].badges.map((badge, index) => (
                                    <Stack key={index} spacing={4} position="relative" alignItems="center" px={6} minH="224px">
                                        <Image
                                            src={badge.isUnlocked ? badge.assets[1] : badge.assets[0]}
                                            maxH={{ md: '120px', lg: '144px' }}
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
                        </Stack>
                    )}

                    {/* Background */}
                    <Flex
                        layerStyle="absoluteCentered"
                        mt="0 !important"
                        filter="saturate(0) opacity(0.15) brightness(0.8)"
                        mixBlendMode="exclusion"
                        style={getBackgroundStyle(getAlternateBackground())}
                        pointerEvents="none"
                        userSelect="none"
                    ></Flex>
                </Box>
            </Flex>

            {/* Shadow */}
            <Box
                position="absolute"
                top={OFFSET}
                right={-OFFSET}
                bottom={-OFFSET}
                left={OFFSET}
                backgroundColor="#111"
                borderRadius={BORDER_RADIUS}
                zIndex={1}
            ></Box>
        </Box>
    );
}

export default Log;

const MenuItem = ({ title, isNew, color, text, isActive, onClick }) => {
    return (
        <Flex
            justifyContent="space-between"
            alignItems="center"
            borderRadius="20px"
            px={5}
            py={2.5}
            backgroundColor={isActive ? '#ffffff10' : 'transparent'}
            cursor="pointer"
            transition="all 0.1s cubic-bezier(0.21, 0.6, 0.35, 1)"
            _hover={{ backgroundColor: isActive ? '#ffffff10' : '#ffffff08' }}
            onClick={onClick}
        >
            <Stack spacing={-0.5}>
                <Text fontWeight={500} fontSize="17px" textShadow="1px 1px 0px #222" color={color}>
                    {title}
                </Text>
                <Text color="#ffffff98" fontSize="15px" textShadow="1px 1px 0px #222">
                    {text}
                </Text>
            </Stack>

            <NewSymbol isVisible={isNew} />
        </Flex>
    );
};

const PageMint = ({ pageIndex, page, goBack }) => {
    return (
        <Stack height="100%">
            <Flex py={1.5} justifyContent="flex-end" alignItems="flex-start">
                <Button colorScheme="orange" onClick={goBack}>
                    Achievements
                </Button>
            </Flex>

            <Flex height="100%" justifyContent="center" alignItems="center">
                <Stack spacing={10} pb={10} justifyContent="center" alignItems="center">
                    <Stack justifyContent="center" alignItems="center">
                        <IconWithShadow shadowColor="#222">
                            <LiaScrollSolid fontSize="42px" />
                        </IconWithShadow>

                        <Text textShadow="1px 1px 0px #222" textAlign="center" margin="0 auto">
                            Unlocking all the Badges within a page allows a{' '}
                            <Text as="span" color="energyBright" fontWeight={500}>
                                one time
                            </Text>{' '}
                            mint
                            <br />
                            of a collectible{' '}
                            <Text as="span" color="mirage" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            Semi-Fungible Token.
                        </Text>
                    </Stack>

                    <Stack justifyContent="center" alignItems="center">
                        <IconWithShadow shadowColor="#222">
                            <GiLockedChest fontSize="36px" />
                        </IconWithShadow>

                        <Text textShadow="1px 1px 0px #222" textAlign="center" margin="0 auto">
                            Each{' '}
                            <Text as="span" color="mirage" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            has a different rarity.
                            <br />
                            The{' '}
                            <Text as="span" color="white" fontWeight={500}>
                                {page.title}
                            </Text>{' '}
                            Page is{' '}
                            <Text as="span" color={`blizzard${page.rarity}`} fontWeight={500}>
                                {page.rarity}
                            </Text>
                            .
                        </Text>
                    </Stack>

                    <Stack justifyContent="center" alignItems="center">
                        <IconWithShadow shadowColor="#222">
                            <VscTools fontSize="36px" />
                        </IconWithShadow>

                        <Text textShadow="1px 1px 0px #222" textAlign="center" margin="0 auto">
                            Pages will be vital for{' '}
                            <Text as="span" color="energyBright" fontWeight={500}>
                                Staking
                            </Text>
                            {', '}
                            token airdrop eligibility,
                            <br />
                            and will play a pivotal role in the upcoming{' '}
                            <Text as="span" color="orange" fontWeight={500}>
                                Dungeons
                            </Text>{' '}
                            update.
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
