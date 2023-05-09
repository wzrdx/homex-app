import { useEffect, useState } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { QUESTS, QuestsContextType, getQuest, getQuestImage, useQuestsContext } from '../services/quests';
import { getBackgroundStyle } from '../services/helpers';
import { useNavigate } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import QuestCard from '../shared/QuestCard';
import { ResourcesContextType, getResourceElements, useResourcesContext } from '../services/resources';
import Requirement from '../shared/Requirement';

function Quests() {
    const [ongoingQuests, setOngoingQuests] = useState<
        Array<{
            id: number;
            timestamp: Date;
        }>
    >([]);

    const { playSound } = useSoundsContext() as SoundsContextType;
    const { quest: currentQuest, setQuest } = useQuestsContext() as QuestsContextType;
    const { resources, getEnergy, getHerbs, getGems, getEssence } = useResourcesContext() as ResourcesContextType;

    const navigate = useNavigate();

    const onQuestClick = (id: number | undefined) => {
        playSound('select_quest');
        setQuest(getQuest(id));
        navigate('/quests');
    };

    const getQuestCards = (type: string) => (
        <Flex flexDir="column" py={5} _last={{ paddingBottom: 0 }}>
            {_(QUESTS)
                .filter((quest) => quest.type === type)
                .map((quest) => (
                    <QuestCard
                        key={quest.id}
                        quest={quest}
                        isActive={quest.id === currentQuest.id}
                        callback={onQuestClick}
                        timestamp={ongoingQuests.find((ongoingQuest) => ongoingQuest.id === quest.id)?.timestamp}
                    />
                ))
                .value()}
        </Flex>
    );

    // Init
    useEffect(() => {
        // TODO: Get all quest states from the sc
    }, []);

    return (
        <Flex height="100%">
            {/* Quest list */}
            <Flex flex={1} justifyContent="center" overflowY="scroll">
                <Flex flexDir="column" width="100%" pl="2px">
                    <Text layerStyle="header1">Basic</Text>
                    {getQuestCards('basic')}

                    <Text layerStyle="header1">Exchange</Text>
                    {getQuestCards('exchange')}

                    <Text layerStyle="header1">Essence</Text>
                    {getQuestCards('essence')}

                    <Text layerStyle="header1">Mission</Text>
                    {getQuestCards('final')}
                </Flex>
            </Flex>

            {/* Quest requirements */}
            <Flex flex={1} justifyContent="center">
                <Flex flexDir="column">
                    <Text>{currentQuest.name}</Text>

                    {Object.keys(currentQuest.requirements).map((resource) => (
                        <Box key={resource}>
                            <Requirement
                                elements={getResourceElements(resource)}
                                valueRequired={currentQuest.requirements[resource]}
                                value={resources[resource]}
                            />
                        </Box>
                    ))}
                </Flex>
            </Flex>

            {/* Quest details */}
            <Flex flex={1} justifyContent="center">
                <Box>{currentQuest.description}</Box>
            </Flex>
        </Flex>
    );
}

export default Quests;
