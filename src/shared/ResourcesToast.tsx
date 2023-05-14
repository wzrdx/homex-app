import { CheckCircleIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import { map } from 'lodash';
import { getResourceElements } from '../services/resources';
import { Flex, Image, Text } from '@chakra-ui/react';

function ResourcesToast({ title, rewards }) {
    const [questRewards, setQuestRewards] = useState<any[]>([]);

    useEffect(() => {
        setQuestRewards(
            map(rewards, (reward) => {
                const { icon, color } = getResourceElements(reward.resource);

                return {
                    resource: reward.resource,
                    icon,
                    value: reward.value,
                    color,
                };
            })
        );
    }, [rewards]);

    return (
        <Flex
            flexDir="column"
            backgroundColor="#191919"
            borderInlineStartWidth="4px"
            borderInlineStartColor="#ca2f34"
            padding="12px 32px 12px 12px"
            borderRadius={3}
        >
            <Flex alignItems="center">
                <CheckCircleIcon boxSize={5} color="green.500" />
                <Text ml={2} fontSize="lg" fontWeight={600}>
                    {title}
                </Text>
            </Flex>

            <Text mt={2} fontWeight={500}>
                You've earned:
            </Text>

            <Flex mt={2} flexDir="column">
                {map(questRewards, (reward) => (
                    <Flex _notLast={{ marginBottom: '0.125rem' }} alignItems="center" key={reward.resource}>
                        <Image height="28px" mr={1.5} src={reward.icon} alt="Resource" />
                        <Text fontSize="18px" style={{ color: reward.color }}>
                            <Text as="span" mr={0.5}>
                                +
                            </Text>
                            <Text as="span" fontWeight={600}>
                                {reward.value}
                            </Text>
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
}

export default ResourcesToast;
