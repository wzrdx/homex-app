import { Flex, Text, Image } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { map } from 'lodash';
import { Quest } from '../types';
import { timeDisplay } from '../services/helpers';

type Props = {
    quest: Quest;
};

const IMAGE_SIZE = '20px';

export const DetailedQuestCard = ({ quest }: Props) => {
    const getRequirements = (): JSX.Element => {
        return (
            <>
                {map(Object.keys(quest.requirements), (requirement, index) => (
                    <Flex key={index} alignItems="center" mr={2.5}>
                        <Image width={IMAGE_SIZE} src={RESOURCE_ELEMENTS[requirement].icon} />
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
                    <Flex key={index} alignItems="center" ml={2.5}>
                        <Image key={index} width={IMAGE_SIZE} src={RESOURCE_ELEMENTS[reward.resource].icon} />
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
        <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
                <Flex alignItems="center">{getRequirements()}</Flex>

                <Text mx={1} fontWeight={500} color="header.gold">
                    {quest.name}
                </Text>

                <Flex alignItems="center">{getRewards()}</Flex>
            </Flex>

            <Text color="#ebeef4">{getQuestDuration(quest.duration)}</Text>
        </Flex>
    );
};
