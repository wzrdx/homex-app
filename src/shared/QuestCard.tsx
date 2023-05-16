import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { getBackgroundStyle } from '../services/helpers';
import { getQuestImage } from '../services/quests';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { first } from 'lodash';
import { Quest, QuestReward } from '../types';
import { TimeIcon } from '@chakra-ui/icons';

const REFRESH_TIME = 1000;

export const QuestCard: FunctionComponent<
    PropsWithChildren<{
        quest: Quest;
        isActive: boolean;
        callback: (arg0: number) => void;
        timestamp?: Date;
    }>
> = ({ quest, isActive, callback, timestamp }) => {
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
        } else {
            // console.log('QuestCard', quest.id, 'resetting widths');
            setWidths(['0%', '100%']);
        }

        return () => {
            clearInterval(timer);
        };
    }, [timestamp]);

    const getOverlayWidths = (): [string, string] => {
        const remainingSeconds = differenceInSeconds(timestamp as Date, new Date());
        const durationInSeconds = quest.duration * 60;

        const remainingPercentage = Math.max(0, (remainingSeconds * 100) / durationInSeconds);
        const elapsedPercentage = 100 - remainingPercentage;

        return [`${elapsedPercentage}%`, `${remainingPercentage}%`];
    };

    const isQuestOngoing = (): boolean => !!timestamp && differenceInSeconds(timestamp, new Date()) > 0;

    return (
        <Flex justifyContent="space-between" alignItems="center" _notLast={{ marginBottom: 4 }}>
            <Box mr={8}>
                {isQuestOngoing() ? (
                    <TimeIcon boxSize="28px" color="almostWhite" />
                ) : (
                    <Image
                        width="28px"
                        src={RESOURCE_ELEMENTS[(first<QuestReward>(quest.rewards) as QuestReward).resource].icon}
                    />
                )}
            </Box>

            <Flex
                onClick={() => callback(quest.id)}
                style={getBackgroundStyle(getQuestImage(quest.id))}
                flex={1}
                position="relative"
                borderRadius="2px"
                boxShadow={isActive ? '0 0 8px 1px rgb(255 170 20 / 70%)' : '1px 1px 2px rgb(0 0 0 / 40%)'}
                px={4}
                py={4}
                mr={8}
                justifyContent="center"
                cursor="pointer"
                outline={isActive ? '2.5px solid #d29835' : widths[0] === '100%' ? '2.5px solid #128712' : 'none'}
            >
                <Box position="relative" zIndex={1} pointerEvents="none">
                    <Text zIndex={1} position="relative" textShadow="1px 1px 2px #000">
                        {quest.name}
                    </Text>

                    {/* Blurred rectangle */}
                    <Box
                        position="absolute"
                        top="7px"
                        right={-1}
                        bottom={'2px'}
                        left={-1}
                        background="black"
                        filter="blur(5px)"
                        opacity="0.2"
                    ></Box>
                </Box>

                {/* Overlay */}
                <Flex position="absolute" top={0} right={0} bottom={0} left={0}>
                    <Box width={widths[0]} transition="all 0.25s ease-in"></Box>
                    <Box
                        width={widths[1]}
                        transition="all 0.25s ease-in"
                        backdropFilter="grayscale(1) brightness(0.75) contrast(1.15)"
                    ></Box>
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
        </Flex>
    );
};

export default QuestCard;
