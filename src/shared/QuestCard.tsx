import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { getBackgroundStyle } from '../services/helpers';
import { getQuestImage } from '../services/quests';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { useEffect, useState } from 'react';
import { differenceInMinutes } from 'date-fns';

const REFRESH_TIME = 60000;

function QuestCard({ quest, isActive, callback, timestamp }) {
    const [widths, setWidths] = useState<[string, string]>(['0%', '100%']);

    // On timestamp change
    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined;

        if (timestamp) {
            // console.log(quest.id, timestamp);
            setWidths(getOverlayWidths());

            timer = setInterval(() => {
                // console.log(quest.id, 'Updating width');
                setWidths(getOverlayWidths());
            }, REFRESH_TIME);
        }

        return () => {
            clearInterval(timer);
        };
    }, [timestamp]);

    const getOverlayWidths = (): [string, string] => {
        const remainingMinutes = differenceInMinutes(timestamp, new Date());
        const durationInMinutes = quest.duration * 60;

        const remainingPercentage = Math.max(0, (remainingMinutes * 100) / durationInMinutes);
        const elapsedPercentage = 100 - remainingPercentage;

        return [`${elapsedPercentage}%`, `${remainingPercentage}%`];
    };

    return (
        <Flex justifyContent="space-between" alignItems="center" _notLast={{ marginBottom: 4 }}>
            <Flex
                onClick={() => callback(quest.id)}
                style={getBackgroundStyle(getQuestImage(quest.id))}
                flex={1}
                position="relative"
                borderRadius="2px"
                boxShadow="1px 1px 2px rgb(0 0 0 / 40%)"
                px={4}
                py={4}
                justifyContent="center"
                cursor="pointer"
                outline={isActive ? '2px solid #d29835' : 'none'}
            >
                <Box position="relative" zIndex={1} pointerEvents="none">
                    <Text zIndex={1} position="relative" textShadow="1px 1px 2px #000">
                        {quest.name}
                    </Text>

                    {/* Blurred rectangle */}
                    <Box
                        position="absolute"
                        top={0}
                        right={-2}
                        bottom={0}
                        left={-2}
                        background="black"
                        filter="blur(9px)"
                        opacity="0.15"
                    ></Box>
                </Box>

                {/* Overlay */}
                <Flex position="absolute" top={0} right={0} bottom={0} left={0}>
                    <Box width={widths[0]}></Box>
                    <Box width={widths[1]} backdropFilter="grayscale(1) brightness(0.75) contrast(1.15)"></Box>
                </Flex>

                {/* Hover Overlay */}
                <Flex
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    transition="all 0.25s cubic-bezier(0.25, 0.45, 0.45, 0.95)"
                    _hover={{ backdropFilter: 'brightness(1.2) contrast(0.85)' }}
                ></Flex>
            </Flex>

            <Box mx={6}>
                {quest.rewards.map((reward: { resource: string }, index: number) => (
                    <Box key={index}>
                        <Image width="28px" src={RESOURCE_ELEMENTS[reward.resource].icon} />
                    </Box>
                ))}
            </Box>
        </Flex>
    );
}

export default QuestCard;
