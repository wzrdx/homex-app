import { Flex, Text, Image } from '@chakra-ui/react';
import { RESOURCE_ELEMENTS } from '../services/resources';
import { map } from 'lodash';
import { Quest } from '../types';

type Props = {
    quest: Quest;
};

const MAIN_RESOURCES = Object.keys(RESOURCE_ELEMENTS).slice(0, 4);
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

    return (
        <Flex alignItems="center">
            <Flex alignItems="center">{getRequirements()}</Flex>

            <Text mx={1} fontWeight={500} color="header.gold">
                {quest.name}
            </Text>

            <Flex alignItems="center">{getRewards()}</Flex>
        </Flex>
    );
};
