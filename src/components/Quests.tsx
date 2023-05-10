import { useEffect, useState } from 'react';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import _ from 'lodash';
import {
    QUESTS,
    QuestsContextType,
    getQuest,
    getQuestImage,
    meetsRequirements,
    useQuestsContext,
} from '../services/quests';
import Frame from '../assets/frame.png';
import { AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import QuestCard from '../shared/QuestCard';
import {
    RESOURCE_ELEMENTS,
    ResourcesContextType,
    getResourceElements,
    useResourcesContext,
} from '../services/resources';
import Requirement from '../shared/Requirement';
import { ActionButton } from '../shared/ActionButton/ActionButton';

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

    const isQuestDefault = () => true;

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

    const startQuest = async () => {};

    return (
        <Flex height="100%">
            {/* Quest list */}
            <Flex flex={5} justifyContent="center" overflowY="scroll">
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
            <Flex flex={7} justifyContent="center">
                <Flex pb={4} flexDir="column" justifyContent="center" alignItems="center">
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        width="400px"
                        height="400px"
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
                            <Image src={Frame} alt="Frame" zIndex={3} width="300px" />
                        </Flex>

                        <Image
                            src={getQuestImage(currentQuest.id)}
                            alt="Quest-Image"
                            zIndex={2}
                            width="400px"
                            clipPath="polygon(50% 3%, 69% 10%, 82% 27%, 82% 95%, 18% 95%, 18% 27%, 31% 10%)"
                        />
                    </Flex>

                    <Flex mb={9}>
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

                    <Box>
                        {/* Normal - The quest hasn't started */}
                        {isQuestDefault() && (
                            <ActionButton
                                isLoading={false}
                                disabled={!meetsRequirements(resources, currentQuest.id)}
                                onClick={startQuest}
                            >
                                <Text>Start</Text>
                            </ActionButton>
                        )}
                    </Box>
                </Flex>
            </Flex>

            {/* Quest details */}
            <Flex flex={5} justifyContent="center">
                <Flex flexDir="column">
                    <Flex justifyContent="space-between" alignItems="flex-end">
                        <Text
                            fontSize="20px"
                            lineHeight="20px"
                            fontWeight={600}
                            letterSpacing="0.5px"
                            color="header.gold"
                        >
                            {currentQuest.name}
                        </Text>

                        <Box>
                            {currentQuest.rewards.map((reward: { resource: string }, index: number) => (
                                <Box key={index}>
                                    <Image width="28px" src={RESOURCE_ELEMENTS[reward.resource].icon} />
                                </Box>
                            ))}
                        </Box>
                    </Flex>

                    <Box
                        my={3.5}
                        width="100%"
                        height="2px"
                        background="linear-gradient(90deg, rgb(62 62 62 / 20%) 0%, rgb(150 150 150) 50%, rgb(62 62 62 / 20%) 100%)"
                    ></Box>

                    <Box>{currentQuest.description}</Box>

                    <Text
                        fontSize="20px"
                        lineHeight="22px"
                        fontWeight={600}
                        letterSpacing="0.5px"
                        color="header.gold"
                        mt={10}
                    >
                        Quest rewards
                    </Text>

                    <Flex flexDir="column" mt={3.5}>
                        {_.map(currentQuest.rewards, (reward, index) => {
                            const { name, color, icon, image } = getResourceElements(reward.resource);

                            return (
                                <Flex key={index} alignItems="center">
                                    <Box position="relative">
                                        <Image
                                            src={image}
                                            alt="Reward"
                                            borderRadius="18px"
                                            width="100px"
                                            height="100px"
                                            boxShadow="0 0 6px 3px #0000008c"
                                        />

                                        {/* Inner shadow */}
                                        <Box
                                            position="absolute"
                                            borderRadius="18px"
                                            zIndex={1}
                                            top={0}
                                            right={0}
                                            bottom={0}
                                            left={0}
                                            boxShadow="inset 0 0 12px 4px #0000003d"
                                        ></Box>
                                    </Box>

                                    <Flex flexDir="column" ml={4}>
                                        <Text mb={1} fontSize="18px">
                                            {reward.name}
                                        </Text>

                                        <Flex alignItems="center">
                                            <Text fontSize="18px" mr={2}>
                                                <Text as="span" mr={1}>
                                                    +
                                                </Text>
                                                <Text as="span" fontWeight={600}>
                                                    {reward.value}
                                                </Text>
                                            </Text>

                                            {!!icon && <Image width="28px" mr={2} src={icon} alt="Icon" />}
                                        </Flex>
                                    </Flex>
                                </Flex>
                            );
                        })}
                    </Flex>

                    {currentQuest.type === 'final' && (
                        <>
                            <Text
                                fontSize="20px"
                                lineHeight="22px"
                                fontWeight={600}
                                letterSpacing="0.5px"
                                color="header.gold"
                                mt={10}
                            >
                                Vision
                            </Text>

                            <Flex mt={2}>
                                <ActionButton colorScheme="lore">
                                    <Flex alignItems="center">
                                        <AiOutlineEye fontSize="18px" />
                                        <Text ml="1">Story</Text>
                                    </Flex>
                                </ActionButton>
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Quests;
