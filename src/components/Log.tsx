import { Box, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ShadowButton } from '../shared/ShadowButton';
import { getBadge } from '../services/assets';
import { getPageCelestialsCustodian } from '../blockchain/api/achievements/getPageCelestialsCustodian';
import { LuSwords } from 'react-icons/lu';
import { IconWithShadow } from '../shared/IconWithShadow';

const OFFSET = 0.5;
const BORDER_RADIUS = '16px';

const PAGES = [
    {
        title: 'Celestials Custodian',
        badges: [
            {
                text: 'Minted Aurora',
                isUnlocked: true,
                data: 1,
            },
            {
                text: 'Minted Verdant',
                isUnlocked: true,
                data: 7,
            },
            {
                text: 'Minted Solstice',
                isUnlocked: false,
                data: 0,
            },
            {
                text: 'Minted Zephyr',
                isUnlocked: false,
                data: 0,
            },
            {
                text: 'Minted Ember',
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
                text: 'Minted 5 or more Aurora',
                isUnlocked: false,
                data: 1,
            },
            {
                text: 'Minted 5 or more Verdant',
                isUnlocked: true,
                data: 7,
            },
            {
                text: 'Minted 5 or more Solstice',
                isUnlocked: false,
                data: 0,
            },
            {
                text: 'Minted 5 or more Zephyr',
                isUnlocked: false,
                data: 0,
            },
            {
                text: 'Minted 5 or more Ember',
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
                <Stack spacing={1.5} direction="row" alignItems="center">
                    <IconWithShadow shadowColor="#222">
                        <LuSwords fontSize="19px" />
                    </IconWithShadow>

                    <Text layerStyle="header1Alt" textShadow="1px 1px 0px #222">
                        Traveler's Log
                    </Text>
                </Stack>

                <Stack spacing={8} direction="row">
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

                    <Box
                        display="grid"
                        gridAutoColumns="1fr 1fr"
                        gridTemplateColumns="1fr 1fr 1fr"
                        rowGap={8}
                        columnGap={8}
                        backgroundColor="log"
                    >
                        {PAGES[currentPage].badges.map((badge) => (
                            <Stack alignItems="center" minW="186px">
                                <Box position="relative" px={4}>
                                    {!!badge.data && (
                                        <Box position="absolute" top={0} left={0}>
                                            <Text>{badge.data}</Text>
                                        </Box>
                                    )}

                                    <Image src={badge.isUnlocked ? PAGES[currentPage].src : getBadge(1)} maxH="132px" />
                                </Box>

                                <Text
                                    fontSize="14px"
                                    textShadow="1px 1px 0px #222"
                                    color={badge.isUnlocked ? 'whitesmoke' : '#bebebe'}
                                >
                                    {badge.text}
                                </Text>
                            </Stack>
                        ))}
                    </Box>
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
