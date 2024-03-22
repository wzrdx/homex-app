import { useEffect, useState } from 'react';
import { map } from 'lodash';
import { getResourceElements } from '../services/resources';
import { Flex, Image, Text } from '@chakra-ui/react';
import { CustomToast } from './CustomToast';
import { useQuestsContext, QuestsContextType } from '../services/quests';

function ResourcesToast({ title, rewards }) {
    const [questRewards, setQuestRewards] = useState<any[]>([]);
    const { isDoubleXpActive } = useQuestsContext() as QuestsContextType;

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
        <CustomToast type="success" title={title} color="#ca2f34">
            <Text mt={2} fontWeight={500}>
                You've earned:
            </Text>

            <Flex mt={2} flexDir="column">
                {map(questRewards, (reward) => (
                    <Flex _notLast={{ marginBottom: '0.5rem' }} alignItems="center" key={reward.resource}>
                        {!reward.icon ? (
                            <Text as="span" fontWeight={800} fontSize="18px">
                                XP
                            </Text>
                        ) : (
                            <Image height="28px" src={reward.icon} alt="Resource" />
                        )}

                        <Text ml={1.5} fontSize="18px" style={{ color: reward.color }}>
                            <Text as="span" mr={0.5}>
                                +
                            </Text>
                            <Text as="span" fontWeight={600}>
                                {(reward.resource === 'xp' && isDoubleXpActive() ? 2 : 1) * reward.value}
                            </Text>
                        </Text>
                    </Flex>
                ))}
            </Flex>
        </CustomToast>
    );
}

export default ResourcesToast;
