import _ from 'lodash';
import { Box, Button, Center, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getAlternateBackground } from '../../services/assets';
import { LuSwords } from 'react-icons/lu';
import { IconWithShadow } from '../../shared/IconWithShadow';
import { BiInfoCircle } from 'react-icons/bi';
import { FaRegCheckCircle } from 'react-icons/fa';
import { LiaScrollSolid, LiaCalendarCheck } from 'react-icons/lia';
import { BsGem } from 'react-icons/bs';
import { GoTrophy } from 'react-icons/go';
import { getBackgroundStyle } from '../../services/helpers';
import { GiLockedChest } from 'react-icons/gi';
import { VscTools } from 'react-icons/vsc';
import {
    AchievementsContextType,
    PAGE_HEADERS,
    TravelersLogPageHeader,
    useAchievementsContext,
} from '../../services/achievements';
import { NewSymbol } from '../../shared/NewSymbol';
import { AOM_ID, ELDERS_COLLECTION_ID, TRAVELERS_COLLECTION_ID } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getSFTDetails } from '../../services/resources';
import { useStoreContext, StoreContextType } from '../../services/store';
import { Stake } from '../../blockchain/hooks/useGetStakingInfo';
import { getRarityClasses } from '../../blockchain/api/getRarityClasses';
import { LogTutorial } from './LogTutorial';
import { Page } from './Page';
import { differenceInDays } from 'date-fns';

enum View {
    Page = 'Page',
    Tutorial = 'Tutorial',
    Mint = 'Mint',
}

const OFFSET = 0.5;
const BORDER_RADIUS = '16px';

function Log() {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [view, setView] = useState<View>(View.Page);

    // const initializeCelestialsPages = async () => {
    //     const celestialsBalance = [
    //         await getSFTBalance(`${AOM_ID}-01`),
    //         await getSFTBalance(`${AOM_ID}-02`),
    //         await getSFTBalance(`${AOM_ID}-03`),
    //         await getSFTBalance(`${AOM_ID}-04`),
    //         await getSFTBalance(`${AOM_ID}-05`),
    //     ];

    //     const celestialsPage = await getPageCelestials();

    //     const celestialsCustodian = [
    //         celestialsPage?.aurora,
    //         celestialsPage?.verdant,
    //         celestialsPage?.solara,
    //         celestialsPage?.emberheart,
    //         celestialsPage?.aetheris,
    //     ];
    //     celestialsCustodian.push(celestialsCustodian.every((amount) => amount > 0) ? 1 : 0);

    //     const celestialsCurator = [
    //         celestialsPage?.aurora,
    //         celestialsPage?.verdant,
    //         celestialsPage?.solara,
    //         celestialsPage?.emberheart,
    //         celestialsPage?.aetheris,
    //     ];
    //     celestialsCurator.push(celestialsCurator.every((amount) => amount >= 5) ? 1 : 0);

    //     setPages([
    //         {
    //             ...PAGES[0],
    //             badges: _.map(PAGES[0].badges, (badge, index) => ({
    //                 ...badge,
    //                 isUnlocked: celestialsCustodian[index] >= (_.first(PAGES[0].limits) as number),
    //                 value: index === PAGES[1].badges.length - 1 ? 0 : celestialsCustodian[index],
    //             })),
    //         },
    //         {
    //             ...PAGES[1],
    //             badges: _.map(PAGES[1].badges, (badge, index) => ({
    //                 ...badge,
    //                 isUnlocked:
    //                     index === PAGES[1].badges.length - 1
    //                         ? (_.last(celestialsCurator) as number) > 0
    //                         : celestialsCurator[index] >= (_.first(PAGES[1].limits) as number),
    //                 value: index === PAGES[1].badges.length - 1 ? 0 : celestialsCurator[index],
    //             })),
    //         },
    //         {
    //             ...PAGES[2],
    //             badges: _.map(PAGES[2].badges, (badge, index) => ({
    //                 ...badge,
    //                 isUnlocked: celestialsBalance.every((balance) => balance >= PAGES[2].limits[index]),
    //             })),
    //         },
    //         {
    //             ...PAGES[3],
    //             badges: _.map(PAGES[3].badges, (badge, index) => ({
    //                 ...badge,
    //                 isUnlocked: _.sum(celestialsBalance) >= PAGES[3].limits[index],
    //                 value: _.sum(celestialsBalance),
    //             })),
    //         },
    //     ]);
    // };

    // const initializeTravelersPages = async () => {
    //     if (!stakingInfo) {
    //         return;
    //     }

    //     const stakedTravelers: Stake[] = _.filter(
    //         stakingInfo.tokens,
    //         (token) => token.tokenId === TRAVELERS_COLLECTION_ID && !token.timestamp
    //     );

    //     // const rarities = await getRarityClasses(_.map(stakedTravelers, (token) => token.nonce));
    //     const rarities = [
    //         {
    //             nonce: 31,
    //             rarityClass: 1,
    //         },
    //         {
    //             nonce: 32,
    //             rarityClass: 1,
    //         },
    //         {
    //             nonce: 17,
    //             rarityClass: 1,
    //         },
    //         {
    //             nonce: 9,
    //             rarityClass: 1,
    //         },
    //         {
    //             nonce: 14,
    //             rarityClass: 1,
    //         },
    //         {
    //             nonce: 12,
    //             rarityClass: 2,
    //         },
    //         {
    //             nonce: 11,
    //             rarityClass: 2,
    //         },
    //     ];

    //     const rarityCount = _.countBy(rarities, 'rarityClass');

    //     setPages([
    //         ...pages,
    //         {
    //             ...PAGES[4],
    //             badges: _.map(PAGES[4].badges, (badge, index) => {
    //                 const rarityClass = index >= 3 ? '2' : '1';

    //                 return {
    //                     ...badge,
    //                     isUnlocked: rarityCount[rarityClass] >= PAGES[4].limits[index],
    //                     value: rarityCount[rarityClass],
    //                 };
    //             }),
    //         },
    //     ]);
    // };

    const getTotalPagesMinted = () => {
        return (
            <Text fontWeight={500} color="page" letterSpacing="1px" fontSize="17px" lineHeight="17px">
                0
                <Text as="span" mx={0.5}>
                    /
                </Text>
                5
            </Text>
        );
    };

    const getView = (): JSX.Element => {
        switch (view) {
            case View.Mint:
                return <PageMint pageIndex={currentPage} page={PAGE_HEADERS[currentPage]} goBack={() => setView(View.Page)} />;

            case View.Tutorial:
                return <LogTutorial goBack={() => setView(View.Page)} />;

            case View.Page:
                return <Page index={currentPage} toggleMint={() => setView(View.Mint)} />;

            default:
                return <></>;
        }
    };

    return (
        <Box position="relative">
            <Flex
                position="relative"
                width="1260px"
                minH={{ md: '636px', lg: '736px' }}
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
                    <Stack spacing={4} alignItems="center">
                        <Stack spacing={2} direction="row" alignItems="center">
                            <IconWithShadow shadowColor="#222">
                                <LuSwords fontSize="22px" />
                            </IconWithShadow>

                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                Traveler's Log
                            </Text>
                        </Stack>

                        <Stack spacing={2.5} direction="row" alignItems="stretch">
                            <Box color="page" m="-5px">
                                <IconWithShadow shadowColor="#222">
                                    <LiaScrollSolid fontSize="46px" />
                                </IconWithShadow>
                            </Box>

                            <Stack spacing={0} justifyContent="space-between">
                                {getTotalPagesMinted()}
                                <Text fontWeight={500} fontSize="15px" lineHeight="15px">
                                    Minted
                                </Text>
                            </Stack>
                        </Stack>

                        <Center pt={1}>
                            <Button colorScheme="blue" size="sm" onClick={() => setView(View.Tutorial)}>
                                How does it work?
                            </Button>
                        </Center>
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
                            {PAGE_HEADERS.map((header, index) => (
                                <Box key={index}>
                                    <MenuItem
                                        title={header.title}
                                        rarity={header.rarity}
                                        isNew={differenceInDays(header.dateAdded, new Date()) > 7}
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
                    {getView()}

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

const MenuItem = ({ title, rarity, isNew, isActive, onClick }) => {
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
                <Text fontWeight={500} textShadow="1px 1px 0px #222">
                    {title}
                </Text>
                <Text color={`blizzard${rarity}`} fontWeight={500} textShadow="1px 1px 0px #222">
                    {rarity}
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
                <Stack spacing={8} pb="52px" justifyContent="center" maxW="600px">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaScrollSolid fontSize="49px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Unlocking all the Badges within a page allows a{' '}
                            <Text as="span" color="logHighlight" fontWeight={500}>
                                one time
                            </Text>{' '}
                            mint
                            <br />
                            of a collectible{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            Semi-Fungible Token.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <GiLockedChest fontSize="40px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Each{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Page
                            </Text>{' '}
                            has a different rarity.
                            <br />
                            The{' '}
                            <Text as="span" fontWeight={500}>
                                {page.title}
                            </Text>{' '}
                            Page is{' '}
                            <Text as="span" color={`blizzard${page.rarity}`} fontWeight={500}>
                                {page.rarity}
                            </Text>
                            .
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <VscTools fontSize="42px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Pages will be vital for{' '}
                            <Text as="span" color="logHighlight" fontWeight={500}>
                                Staking
                            </Text>
                            {', '}
                            Maze token farming,
                            <br />
                            and will play a pivotal role in the upcoming system & updates.
                        </Text>
                    </Stack>

                    <Stack direction="row" alignItems="center">
                        <Center width="54px" minW="54px" height="50px" pb="2px">
                            <IconWithShadow shadowColor="#222">
                                <LiaCalendarCheck fontSize="48px" />
                            </IconWithShadow>
                        </Center>

                        <Text textShadow="1px 1px 0px #222" margin="0 auto">
                            Minting of{' '}
                            <Text as="span" color="page" fontWeight={500}>
                                Traveler's Log Pages
                            </Text>{' '}
                            will become available in{' '}
                            <Text as="span" fontWeight={500}>
                                January 2024
                            </Text>
                            . Certain conditions may apply.
                        </Text>
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
