import { Box, Button, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ShadowButton } from '../shared/ShadowButton';
import { getBadge } from '../services/assets';
import { getPageCelestialsCustodian } from '../blockchain/api/achievements/getPageCelestialsCustodian';
import { LuSwords } from 'react-icons/lu';
import { IconWithShadow } from '../shared/IconWithShadow';
import _ from 'lodash';
import { FaQuestionCircle } from 'react-icons/fa';
import { QuestionOutlineIcon } from '@chakra-ui/icons';

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
                data: 1,
            },
            {
                title: 'Verdant Visionary',
                text: 'Minted at least one Verdant from Art of Menhir',
                isUnlocked: true,
                data: 7,
            },
            {
                title: "Solara's Spark",
                text: 'Minted at least one Solara from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
            {
                title: "Emberheart's Enigma",
                text: 'Minted at least one Emberheart from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
            {
                title: 'Aetheris Ascendant',
                text: 'Minted at least one Aetheris from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
        ],
        src: getBadge(2),
    },
    {
        title: 'Celestials Curator',
        badges: [
            {
                title: 'Aurora Curator',
                text: 'Minted at least 5 Aurora from Art of Menhir',
                isUnlocked: false,
                data: 1,
            },
            {
                title: 'Verdant Curator',
                text: 'Minted at least 5 Verdant from Art of Menhir',
                isUnlocked: true,
                data: 7,
            },
            {
                title: 'Solara Curator',
                text: 'Minted at least 5 Solara from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
            {
                title: 'Emberheart Curator',
                text: 'Minted at least 5 Emberheart from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
            {
                title: 'Aetheris Curator',
                text: 'Minted at least 5 Aetheris from Art of Menhir',
                isUnlocked: false,
                data: 0,
            },
        ],
        src: getBadge(3),
    },
];

function Log() {
    // const [isEnabled, setEnabled] = useState(false);
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
            <Text as="span" color="energyBright">
                {badges.filter((badge) => badge.isUnlocked).length}/{badges.length}
            </Text>
        );
    };

    return (
        <Box position="relative">
            <Stack
                spacing={8}
                position="relative"
                py={8}
                px={10}
                alignItems="center"
                backgroundColor="log"
                borderRadius={BORDER_RADIUS}
                zIndex={2}
            >
                <Stack spacing={0.5} alignItems="center">
                    <Stack spacing={1.5} direction="row" alignItems="center">
                        <IconWithShadow shadowColor="#222">
                            <LuSwords fontSize="19px" />
                        </IconWithShadow>

                        <Text layerStyle="header1Alt" textShadow="1px 1px 0px #222">
                            Traveler's Log
                        </Text>
                    </Stack>

                    <Text fontWeight={500} textShadow="1px 1px 0px #222">
                        Unlocked: {getTotalUnlocked()}
                    </Text>
                </Stack>

                <Stack spacing={8} direction="row">
                    <Stack spacing={2}>
                        <Text layerStyle="header1Alt" textShadow="1px 1px 0px #222">
                            Pages
                        </Text>

                        <Stack>
                            {PAGES.map((page, index) => (
                                <Box key={index}>
                                    <ShadowButton
                                        color="#ae6133"
                                        borderColor="#222"
                                        isEnabled={index === currentPage}
                                        onClick={() => setCurrentPage(index)}
                                    >
                                        <Text textShadow="1px 1px 0px #222" color="white">
                                            {page.title}
                                        </Text>
                                    </ShadowButton>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>

                    <Stack spacing={8}>
                        <Flex justifyContent="space-between" alignItems="center">
                            <Stack spacing={0}>
                                <Text layerStyle="header2" textShadow="1px 1px 0px #222">
                                    {PAGES[currentPage].title}
                                </Text>
                                <Text fontWeight={500} textShadow="1px 1px 0px #222">
                                    Unlocked:{' '}
                                    <Text as="span" color="energyBright">
                                        {_(PAGES[currentPage].badges)
                                            .filter((badge) => badge.isUnlocked)
                                            .size()}
                                        /{PAGES[currentPage].badges.length}
                                    </Text>
                                </Text>
                            </Stack>

                            <Stack direction="row" spacing={3} alignItems="center">
                                <QuestionOutlineIcon color="whitesmoke" fontSize="23px" />
                                <Button colorScheme="blue">Mint page</Button>
                            </Stack>
                        </Flex>

                        <Box
                            display="grid"
                            gridAutoColumns="1fr 1fr"
                            gridTemplateColumns="1fr 1fr 1fr"
                            rowGap={8}
                            columnGap={8}
                        >
                            {PAGES[currentPage].badges.map((badge, index) => (
                                <Stack key={index} spacing={4} position="relative" alignItems="center" width="226px">
                                    <Image src={badge.isUnlocked ? PAGES[currentPage].src : getBadge(1)} maxH="134px" />

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
                </Stack>
            </Stack>

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
