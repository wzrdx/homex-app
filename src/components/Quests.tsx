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
    const { playSound } = useSoundsContext() as SoundsContextType;
    const { quest: currentQuest, setQuest } = useQuestsContext() as QuestsContextType;
    const { resources, getEnergy, getHerbs, getGems, getEssence } = useResourcesContext() as ResourcesContextType;

    const navigate = useNavigate();

    const onQuestClick = (id: number | undefined) => {
        playSound('select_quest');
        setQuest(getQuest(id));
        navigate('/quests');
    };

    const getQuestCards = (type: string) =>
        _(QUESTS)
            .filter((quest) => quest.type === type)
            .map((quest) => <QuestCard key={quest.id} quest={quest} callback={onQuestClick} />)
            .value();

    return (
        <Flex>
            {/* Quest list */}
            <Flex flex={1} justifyContent="center">
                <Flex flexDir="column">
                    <Text fontSize="22px">Quests</Text>

                    <Text fontSize="20px">Basic</Text>
                    {getQuestCards('basic')}

                    <Text fontSize="20px">Exchange</Text>
                    {getQuestCards('exchange')}

                    <Text fontSize="20px">Essence</Text>
                    {getQuestCards('essence')}

                    <Text fontSize="20px">Mission</Text>
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
                <Text>{currentQuest.description}</Text>
            </Flex>
        </Flex>
    );
}

export default Quests;
