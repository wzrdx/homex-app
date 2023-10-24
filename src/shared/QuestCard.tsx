import { Flex, Box, Text, Image } from '@chakra-ui/react';
import { getBackgroundStyle, timeDisplay } from '../services/helpers';
import { getQuestImage } from '../services/quests';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { differenceInSeconds, isBefore } from 'date-fns';
import { first, map, size } from 'lodash';
import { Quest, QuestReward } from '../types';
import { TimeIcon } from '@chakra-ui/icons';
import { Timer } from './Timer';

const REFRESH_TIME = process.env.NODE_ENV === 'development' ? 1000 : 10000;
const IMAGE_SIZE = '22px';

export const QuestCard: FunctionComponent<
    PropsWithChildren<{
        quest: Quest;
        callback?: (arg0: number) => void;
        timestamp?: Date;
    }>
> = ({ quest, callback, timestamp }) => {
    const [widths, setWidths] = useState<[string, string]>(['0%', '100%']);

    // On timestamp change
    useEffect(() => {
        let timer: string | number | NodeJS.Timer | undefined;

        if (timestamp) {
            setWidths(getOverlayWidths());

            timer = setInterval(() => {
                setWidths(getOverlayWidths());
            }, REFRESH_TIME);
        } else {
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

    const getRequirements = (): JSX.Element => {
        return (
            <>
                {map(Object.keys(quest.requirements), (requirement, index) => (
                    <Flex key={index} alignItems="center" mx={2.5}>
                        <Image height={IMAGE_SIZE} src={RESOURCE_ELEMENTS[requirement].icon} />
                        <Text ml={1.5}>{quest.requirements[requirement]}</Text>
                    </Flex>
                ))}
            </>
        );
    };

    const getRewards = (): JSX.Element => {
        return (
            <Flex>
                {map(quest.rewards, (reward, index) => (
                    <Flex key={index} alignItems="center" mx={2.5}>
                        {!RESOURCE_ELEMENTS[reward.resource].icon ? (
                            <Text fontWeight={600}>XP</Text>
                        ) : (
                            <Image key={index} height={IMAGE_SIZE} src={RESOURCE_ELEMENTS[reward.resource].icon} />
                        )}
                        <Text ml={1.5}>{reward.value}</Text>
                    </Flex>
                ))}
            </Flex>
        );
    };

    const getQuestDuration = (duration: number) => {
        return `${timeDisplay(Math.floor(duration / 60))}:${timeDisplay(duration % 60)}`;
    };

    return (
        <Flex flexDir="column" borderRadius="2px">
            <Flex
                onClick={() => {
                    if (callback) callback(quest.id);
                }}
                style={getBackgroundStyle(getQuestImage(quest.id))}
                flex={1}
                position="relative"
                borderRadius="2px"
                px={4}
                py="2.6rem"
                justifyContent="space-between"
                cursor="pointer"
                outline={widths[0] === '100%' ? '2.5px solid #128712bd' : 'none'}
            >
                <Box zIndex={4} position="relative">
                    <Text zIndex={3} position="relative" textShadow="1px 1px 2px #000" fontSize="17px" mr={4}>
                        {quest.name}
                    </Text>
                </Box>

                {((!!timestamp && isBefore(new Date(), timestamp)) || !timestamp) && (
                    <Flex alignItems="center" zIndex={2} backgroundColor="#333333d1" px={2} py={0.5} borderRadius="2px">
                        {isQuestOngoing() ? (
                            <Timer isActive={true} displayClock={false} timestamp={timestamp as Date} isDescending />
                        ) : (
                            <Flex alignItems="center">
                                <Text mr={1.5} textShadow="0 0 4px black">
                                    {getQuestDuration(quest.duration)}
                                </Text>

                                <TimeIcon mb="1px" boxSize={4} color="whitesmoke" textShadow="0 0 4px black" />
                            </Flex>
                        )}
                    </Flex>
                )}

                {/* Top bar */}
                <Box position="absolute" top={0} right={0} left={0} zIndex={2} backgroundColor="#333333d1">
                    <Flex alignItems="center" justifyContent="center" py={1}>
                        {getRequirements()}
                    </Flex>
                </Box>

                {/* Bottom bar */}
                <Box position="absolute" bottom={0} right={0} left={0} zIndex={2} backgroundColor="#333333d1">
                    <Flex alignItems="center" justifyContent="center" py={1}>
                        {getRewards()}
                    </Flex>
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
