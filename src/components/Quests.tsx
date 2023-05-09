import { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import _ from 'lodash';
import { QUESTS, QuestsContextType, getQuest, getQuestImage, useQuestsContext } from '../services/quests';
import Frame from '../assets/frame.png';
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
    >([
        {
            id: 1,
            timestamp: new Date('2023-05-09T16:46:51.771Z'),
        },
        {
            id: 5,
            timestamp: new Date('2023-05-09T15:16:51.771Z'),
        },
    ]);

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
        <Flex flexDir="column" py={5} _last={{ paddingBottom: '2px' }}>
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
                <Flex flexDir="column" justifyContent="center" alignItems="center">
                    <Text fontSize="20px" fontWeight={600} letterSpacing="0.5px" mb={9}>
                        {currentQuest.name}
                    </Text>

                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        width="320px"
                        height="320px"
                        mb={9}
                    >
                        <Flex
                            justifyContent="center"
                            alignItems="center"
                            position="absolute"
                            top={0}
                            right={0}
                            bottom={0}
                            left={0}
                        >
                            <Image src={Frame} alt="Frame" zIndex={3} width="240px" />
                        </Flex>

                        <Image
                            src={getQuestImage(currentQuest.id)}
                            alt="Quest-Image"
                            zIndex={2}
                            width="320px"
                            clipPath="polygon(50% 3%, 69% 10%, 82% 27%, 82% 95%, 18% 95%, 18% 27%, 31% 10%)"
                        />
                    </Flex>

                    <Flex>
                        {Object.keys(currentQuest.requirements).map((resource) => (
                            <Flex key={resource} width="102px" justifyContent="center">
                                <Requirement
                                    elements={getResourceElements(resource)}
                                    valueRequired={currentQuest.requirements[resource]}
                                    value={resources[resource]}
                                />
                            </Flex>
                        ))}
                    </Flex>

                    <Button colorScheme="red">Start</Button>
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
