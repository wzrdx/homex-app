import _ from 'lodash';
import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getCelestialsAssets } from '../services/assets';
import { getPageCelestialsCustodian } from '../blockchain/api/achievements/getPageCelestialsCustodian';
import { LuSwords } from 'react-icons/lu';
import { IconWithShadow } from '../shared/IconWithShadow';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { LiaScrollSolid } from 'react-icons/lia';
import { GoTrophy } from 'react-icons/go';

const OFFSET = 0.5;
const BORDER_RADIUS = '16px';

const PAGES = [
    {
        title: 'Celestials Custodian',
        badges: [
            {
                title: "Aurora's Awakening",
                text: 'Minted at least one Aurora from Art of Menhir',
                isUnlocked: true,
                data: 5,
                assets: getCelestialsAssets('Custodian', 'Emberheart'),
            },
            {
                title: 'Verdant Visionary',
                text: 'Minted at least one Verdant from Art of Menhir',
                isUnlocked: true,
                data: 7,
                assets: getCelestialsAssets('Custodian', 'Verdant'),
            },
            {
                title: "Solara's Spark",
                text: 'Minted at least one Solara from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Custodian', 'Verdant'),
            },
            {
                title: "Emberheart's Enigma",
                text: 'Minted at least one Emberheart from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Custodian', 'Verdant'),
            },
            {
                title: 'Aetheris Ascendant',
                text: 'Minted at least one Aetheris from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Custodian', 'Verdant'),
            },
        ],
    },
    {
        title: 'Celestials Curator',
        badges: [
            {
                title: 'Aurora Curator',
                text: 'Minted at least 5 Aurora from Art of Menhir',
                isUnlocked: true,
                data: 5,
                assets: getCelestialsAssets('Curator', 'Emberheart'),
            },
            {
                title: 'Verdant Curator',
                text: 'Minted at least 5 Verdant from Art of Menhir',
                isUnlocked: true,
                data: 7,
                assets: getCelestialsAssets('Curator', 'Verdant'),
            },
            {
                title: 'Solara Curator',
                text: 'Minted at least 5 Solara from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Curator', 'Verdant'),
            },
            {
                title: 'Emberheart Curator',
                text: 'Minted at least 5 Emberheart from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Curator', 'Verdant'),
            },
            {
                title: 'Aetheris Curator',
                text: 'Minted at least 5 Aetheris from Art of Menhir',
                isUnlocked: false,
                data: 0,
                assets: getCelestialsAssets('Curator', 'Verdant'),
            },
        ],
    },
];

function Log() {
    const [currentPage, setCurrentPage] = useState<number>(0);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        await getPageCelestialsCustodian();
    };

    const getTotalUnlocked = () => {
        const badges = _(PAGES)
            .map((page) => page.badges)
            .flatten()
            .value();

        return (
            <Text fontWeight={500} color="energyBright" letterSpacing="1px" fontSize="17px" lineHeight="17px">
                {badges.filter((badge) => badge.isUnlocked).length}
                <Text as="span" mx={0.5}>
                    /
                </Text>
                {badges.length}
            </Text>
        );
    };

    const getPageUnlocked = () => {
        const badges = _(PAGES)
            .map((page) => page.badges)
            .flatten()
            .value();

        return (
            <Text fontWeight={500} color="energyBright" letterSpacing="1px" fontSize="17px" lineHeight="17px">
                {_(PAGES[currentPage].badges)
                    .filter((badge) => badge.isUnlocked)
                    .size()}
                <Text as="span" mx={0.5}>
                    /
                </Text>
                {PAGES[currentPage].badges.length}
            </Text>
        );
    };

    return (
        <Box position="relative">
            <Flex
                position="relative"
                width="1280px"
                background="radial-gradient(circle, rgba(51,51,51,1) 0%, rgba(50,48,46,1) 50%)"
                borderRadius={BORDER_RADIUS}
                zIndex={2}
            >
                {/* Left */}
                <Stack flex={1} spacing={8} py={8} px={10} backgroundColor="#00000020" borderRight="1px solid #ffffff0d">
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
                            <Box color="energyBright">
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
                            {PAGES.map((page, index) => (
                                <Box key={index}>
                                    <MenuItem
                                        title={page.title}
                                        text={`${_(PAGES[index].badges)
                                            .filter((badge) => badge.isUnlocked)
                                            .size()} / ${PAGES[index].badges.length} Unlocked`}
                                        isActive={index === currentPage}
                                        onClick={() => setCurrentPage(index)}
                                    />
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>

                {/* Right */}
                <Stack flex={3} py={8} px={10} spacing={8}>
                    <Flex justifyContent="space-between" alignItems="flex-start">
                        <Stack spacing={3}>
                            <Text layerStyle="header1" textShadow="1px 1px 0px #222">
                                {PAGES[currentPage].title}
                            </Text>

                            <Stack spacing={2.5} direction="row" alignItems="stretch">
                                <Box color="energyBright">
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
                        </Stack>

                        <Stack direction="row" spacing={3} alignItems="center" py={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center" color="#bebebe">
                                <InfoOutlineIcon fontSize="17px" />
                                <Text textShadow="1px 1px 0px #222">
                                    Unlock{' '}
                                    {_(PAGES[currentPage].badges)
                                        .filter((badge) => !badge.isUnlocked)
                                        .size()}{' '}
                                    more to mint
                                </Text>
                            </Stack>
                            <Button colorScheme="blue">Mint page</Button>
                        </Stack>
                    </Flex>

                    <Box display="grid" gridAutoColumns="1fr 1fr" gridTemplateColumns="1fr 1fr 1fr" rowGap={8} columnGap={8}>
                        {PAGES[currentPage].badges.map((badge, index) => (
                            <Stack
                                key={index}
                                spacing={4}
                                position="relative"
                                alignItems="center"
                                width="226px"
                                margin="0 auto"
                            >
                                <Image src={badge.isUnlocked ? badge.assets[1] : badge.assets[0]} maxH="130px" />

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
                                        textShadow="1px 1px 0px #222"
                                        textAlign="center"
                                        color={badge.isUnlocked ? 'white' : '#bebebe'}
                                    >
                                        {badge.text}
                                    </Text>

                                    <Box visibility={badge.data ? 'visible' : 'hidden'}>
                                        <Text layerStyle="header2">{badge.data}</Text>
                                    </Box>
                                </Stack>
                            </Stack>
                        ))}
                    </Box>
                </Stack>
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

const MenuItem = ({ title, text, isActive, onClick }) => {
    return (
        <Stack
            spacing={-0.5}
            borderRadius="20px"
            px={6}
            py={2.5}
            backgroundColor={isActive ? '#ffffff10' : 'transparent'}
            cursor="pointer"
            transition="all 0.1s cubic-bezier(0.21, 0.6, 0.35, 1)"
            _hover={{ backgroundColor: isActive ? '#ffffff10' : '#ffffff08' }}
            onClick={onClick}
        >
            <Text fontWeight={500} fontSize="17px" textShadow="1px 1px 0px #222">
                {title}
            </Text>
            <Text color="#ffffff98" fontSize="15px" textShadow="1px 1px 0px #222">
                {text}
            </Text>
        </Stack>
    );
};
