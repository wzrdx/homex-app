import { useCallback, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Checkbox,
    CheckboxGroup,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import _, { find, findIndex, map } from 'lodash';
import { QUESTS, QuestsContextType, getQuest, getQuestImage, meetsRequirements, useQuestsContext } from '../services/quests';
import { AiOutlineEye, AiOutlineExclamation } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import QuestCard from '../shared/QuestCard';
import { RESOURCE_ELEMENTS, ResourcesContextType, getResourceElements, useResourcesContext } from '../services/resources';
import Requirement from '../shared/Requirement';
import { TimeIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { Timer } from '../shared/Timer';
import { addMinutes, differenceInHours, isAfter, isBefore } from 'date-fns';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import Reward from '../shared/Reward';
import { getFrame, getFrameGlow, getSpinningTicket, getVisionImage } from '../services/assets';
import { VideoLayer } from '../shared/VideoLayer';
import { useLayout } from './Layout';
import Separator from '../shared/Separator';
import { CHAIN_ID } from '../blockchain/config';
import { getBackgroundStyle, hDisplay, mDisplay, round } from '../services/helpers';
import { getTrialTimestamp } from '../blockchain/api/getTrialTimestamp';
import { Quest } from '../types';
import { StringOrNumber } from '@chakra-ui/utils';
import { DetailedQuestCard } from '../shared/DetailedQuestCard';

const LARGE_FRAME_SIZE = 326;
const MEDIUM_FRAME_SIZE = 240;

const GRACE_PERIOD_INTERVAL = 24;

function Quests() {
    const { displayToast, closeToast } = useLayout();
    const navigate = useNavigate();

    const { isOpen: isVisionOpen, onOpen: onVisionOpen, onClose: onVisionClose } = useDisclosure();
    const { isOpen: isQuestsModalOpen, onOpen: onQuestsModalOpen, onClose: onQuestsModalClose } = useDisclosure();

    const { address } = useGetAccountInfo();

    const { isQuestTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;
    const { quest: currentQuest, setQuest, ongoingQuests, getOngoingQuests } = useQuestsContext() as QuestsContextType;
    const { resources, isTicketModalOpen, onTicketModalClose } = useResourcesContext() as ResourcesContextType;

    const [isStartButtonLoading, setStartButtonLoading] = useState(false);
    const [isFinishButtonLoading, setFinishButtonLoading] = useState(false);

    const [trialTimestamp, setTrialTimestamp] = useState<Date>();

    const isQuestDefault = (quest: Quest = currentQuest) => findIndex(ongoingQuests, (q) => q.id === quest.id) < 0;
    const isQuestOngoing = () =>
        findIndex(ongoingQuests, (q) => q.id === currentQuest.id && isBefore(new Date(), q.timestamp)) > -1;
    const isQuestComplete = () =>
        findIndex(ongoingQuests, (q) => q.id === currentQuest.id && isAfter(new Date(), q.timestamp)) > -1;

    // Multi-start
    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);
    const areAllQuestsSelected =
        _.size(selectedQuestIds) ===
        _(QUESTS)
            .filter((quest) => isQuestDefault(quest))
            .size();
    const isIndeterminate = _.size(selectedQuestIds) > 0 && !areAllQuestsSelected;

    const canBeCompleted = (): boolean => {
        if (!trialTimestamp) {
            return false;
        }

        return isBefore(addMinutes(new Date(), currentQuest.duration), trialTimestamp);
    };

    // Init
    useEffect(() => {
        init();
    }, []);

    // Trial timestamp handling
    useEffect(() => {
        if (trialTimestamp && differenceInHours(trialTimestamp, new Date()) < GRACE_PERIOD_INTERVAL && !isGamePaused) {
            const difference = differenceInHours(trialTimestamp, new Date());
            const duration =
                difference > 1 ? `about ${difference} hours` : difference === 1 ? `about one hour` : 'less than an hour';

            displayToast(
                'time',
                `Trial ends in ${duration}`,
                'Claim your quest rewards before the end or they will be lost',
                'orangered',
                7000,
                'top-right',
                {
                    margin: '2rem',
                }
            );
        }

        return () => {
            closeToast();
        };
    }, [trialTimestamp]);

    const init = async () => {
        getOngoingQuests();
        setTrialTimestamp(await getTrialTimestamp());
    };

    const startQuest = async () => {
        setStartButtonLoading(true);

        const user = new Address(address);
        const requiredResources: string[] = Object.keys(currentQuest.requirements);

        try {
            const tx = smartContract.methods
                .startQuest([currentQuest.id])
                .withMultiESDTNFTTransfer(
                    requiredResources.map((resource) =>
                        TokenTransfer.fungibleFromAmount(
                            RESOURCE_ELEMENTS[resource].tokenId,
                            currentQuest.requirements[resource],
                            6
                        )
                    )
                )
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(8000000 + requiredResources.length * 500000)
                .buildTransaction();

            await refreshAccount();

            const { sessionId } = await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    processingMessage: 'Processing transaction',
                    errorMessage: 'Error',
                    successMessage: 'Transaction successful',
                },
                redirectAfterSign: false,
            });

            setStartButtonLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.StartQuest,
                    questId: currentQuest.id,
                    resolution: TxResolution.UpdateResources,
                    data: {
                        resources: Object.keys(currentQuest.requirements),
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured during startQuest', err);
        }
    };

    const completeQuest = async () => {
        setFinishButtonLoading(true);

        const user = new Address(address);

        const rewardsCount: number = currentQuest.rewards.length;
        const isMission: boolean = currentQuest.type === 'final';
        const gasLimit: number = 6000000 + rewardsCount * 750000 + (isMission ? 2500000 : 0);

        try {
            const tx = smartContract.methods
                .completeQuest([currentQuest.id])
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(gasLimit)
                .buildTransaction();

            await refreshAccount();

            const { sessionId } = await sendTransactions({
                transactions: tx,
                transactionsDisplayInfo: {
                    processingMessage: 'Processing transaction',
                    errorMessage: 'Error',
                    successMessage: 'Transaction successful',
                },
                redirectAfterSign: false,
            });

            setFinishButtonLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.CompleteQuest,
                    questId: currentQuest.id,
                    resolution: TxResolution.UpdateResources,
                    data: {
                        resources: map(currentQuest.rewards, (reward) => reward.resource),
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured during completeQuest', err);
        }
    };

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
                        timestamp={find(ongoingQuests, (ongoingQuest) => ongoingQuest.id === quest.id)?.timestamp}
                    />
                ))
                .value()}
        </Flex>
    );

    const getQuestDuration = (duration: number) => {
        return `${hDisplay(Math.floor(duration / 60))}:${mDisplay(duration % 60)}:00`;
    };

    const onCheckboxGroupChange = useCallback((array: string[]) => {
        setSelectedQuestIds(array);
    }, []);

    const onSelectAll = () => {
        if (areAllQuestsSelected) {
            setSelectedQuestIds([]);
        } else {
            setSelectedQuestIds(
                _(QUESTS)
                    .filter((quest) => isQuestDefault(quest))
                    .map((quest) => quest.id.toString())
                    .value()
            );
        }
    };

    const getRequiredResources = (): {
        energy: number;
        herbs: number;
        gems: number;
        essence: number;
    } => {
        const quests: Quest[] = _.map(selectedQuestIds, (questId) => getQuest(Number.parseInt(questId)));
        const requirements = { energy: 0, herbs: 0, gems: 0, essence: 0 };

        _.forEach(quests, (quest) => {
            _.forEach(Object.keys(quest.requirements), (resource) => {
                requirements[resource] += quest.requirements[resource];
            });
        });

        return requirements;
    };

    const getTotalRequirements = () => {
        const requirements = getRequiredResources();

        return (
            <Flex>
                {_.map(Object.keys(requirements), (resource, index) => (
                    <Flex key={index} alignItems="center" mr={4}>
                        <Image width="20px" src={RESOURCE_ELEMENTS[resource].icon} />
                        <Text ml={1.5}>
                            <Text
                                color={requirements[resource] > resources[resource] ? 'redClrs' : 'availableResource'}
                                as="span"
                            >{`${resources[resource] >= 10000 ? '10k+' : round(resources[resource], 1)}`}</Text>
                            <Text as="span" mx={0.5}>
                                /
                            </Text>
                            <Text as="span">{requirements[resource]}</Text>
                        </Text>
                    </Flex>
                ))}
            </Flex>
        );
    };

    const getTotalRewards = () => {
        const quests: Quest[] = _.map(selectedQuestIds, (questId) => getQuest(Number.parseInt(questId)));
        const rewards = { energy: 0, herbs: 0, gems: 0, essence: 0, tickets: 0 };

        _.forEach(quests, (quest) => {
            _.forEach(quest.rewards, (reward) => {
                rewards[reward.resource] += reward.value;
            });
        });

        return (
            <Flex>
                {_.map(Object.keys(rewards), (resource, index) => (
                    <Flex key={index} alignItems="center" mr={4}>
                        <Image width="20px" src={RESOURCE_ELEMENTS[resource].icon} />
                        <Text ml={1.5}>{rewards[resource]}</Text>
                    </Flex>
                ))}
            </Flex>
        );
    };

    const canStartMultipleQuests = (): boolean => {
        if (_.size(selectedQuestIds) === 0) {
            return false;
        }

        const requirements = getRequiredResources();
        const keys = Object.keys(requirements);
        const result = keys.every((key) => resources[key] >= requirements[key]);

        return result;
    };

    return (
        <Flex height="100%">
            {/* Quest list */}
            <Flex flex={5} justifyContent="center" overflowY="auto">
                <Flex flexDir="column" width="100%" pl="2px">
                    <Flex mb={6} justifyContent="space-between" mr={8}>
                        <ActionButton colorScheme="blue" customStyle={{ width: '198px' }} onClick={onQuestsModalOpen}>
                            <Text>Start multiple quests</Text>
                        </ActionButton>

                        <ActionButton colorScheme="green" onClick={onQuestsModalOpen}>
                            <Text>Claim all rewards</Text>
                        </ActionButton>
                    </Flex>

                    <Text layerStyle="header1">Herbalism</Text>
                    {getQuestCards('herbalism')}

                    <Text layerStyle="header1">Jewelcrafting</Text>
                    {getQuestCards('jewelcrafting')}

                    <Text layerStyle="header1">Enchanting</Text>
                    {getQuestCards('enchanting')}

                    <Text layerStyle="header1">Divination</Text>
                    {getQuestCards('divination')}

                    <Text layerStyle="header1">Alchemy</Text>
                    {getQuestCards('alchemy')}

                    <Text layerStyle="header1">Missions</Text>
                    {getQuestCards('final')}
                </Flex>
            </Flex>

            {/* Quest requirements */}
            <Flex flex={7} justifyContent="center">
                <Flex pt={1} flexDir="column" justifyContent="center" alignItems="center">
                    <Flex justifyContent="center" alignItems="center" position="relative">
                        <Image
                            src={getFrame()}
                            alt="Frame"
                            zIndex={4}
                            width={[null, MEDIUM_FRAME_SIZE, MEDIUM_FRAME_SIZE, LARGE_FRAME_SIZE]}
                            userSelect="none"
                            pointerEvents="none"
                        />

                        {map(currentQuest.layers, (layer) => (
                            <VideoLayer source={layer.source} mode={layer.mode} key={layer.source} />
                        ))}

                        <Flex layerStyle="absoluteCentered">
                            <Image
                                src={getQuestImage(currentQuest.id)}
                                alt="Quest-Image"
                                zIndex={2}
                                transform="scale(1.2)"
                                mt="16px"
                                clipPath="polygon(50% 3%, 69% 10%, 82% 27%, 82% 95%, 18% 95%, 18% 27%, 31% 10%)"
                                userSelect="none"
                                pointerEvents="none"
                            />
                        </Flex>

                        <Flex layerStyle="absoluteCentered" zIndex={1} userSelect="none" pointerEvents="none">
                            <video style={{ maxWidth: '114%' }} autoPlay={true} muted={true} loop={true}>
                                <source src={getFrameGlow()} type="video/webm" />
                            </video>
                        </Flex>
                    </Flex>

                    <Flex mt={{ md: 5, lg: 8 }} mb={{ md: 4, lg: 7 }}>
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

                    <Box mb={2}>
                        {/* Normal - The quest hasn't started */}
                        {isQuestDefault() && (
                            <ActionButton
                                isLoading={
                                    isStartButtonLoading || isQuestTxPending(TransactionType.StartQuest, currentQuest.id)
                                }
                                disabled={isGamePaused || !meetsRequirements(resources, currentQuest.id) || !canBeCompleted()}
                                onClick={startQuest}
                            >
                                <Text>Start</Text>
                            </ActionButton>
                        )}

                        {/* Ongoing - A quest is ongoing but is not completed */}
                        {isQuestOngoing() && (
                            <ActionButton disabled>
                                <Text>Ongoing</Text>
                            </ActionButton>
                        )}

                        {/* Complete - A quest is completed and its rewards must be claimed */}
                        {isQuestComplete() && (
                            <ActionButton
                                isLoading={
                                    isFinishButtonLoading || isQuestTxPending(TransactionType.CompleteQuest, currentQuest.id)
                                }
                                colorScheme="green"
                                onClick={completeQuest}
                            >
                                <Text>Claim Rewards</Text>
                            </ActionButton>
                        )}
                    </Box>

                    {!isGamePaused && trialTimestamp && isQuestDefault() && !canBeCompleted() && (
                        <Flex alignItems="center">
                            <Text color="redClrs">Quest duration exceeds end of Trial</Text>
                        </Flex>
                    )}

                    <Box>
                        {isQuestDefault() && (
                            <Flex alignItems="center">
                                <TimeIcon boxSize={4} color="whitesmoke" />
                                <Text ml={2}>{getQuestDuration(currentQuest.duration)}</Text>
                            </Flex>
                        )}

                        {isQuestOngoing() && (
                            <Timer
                                isActive={true}
                                timestamp={find(ongoingQuests, (quest) => quest.id === currentQuest.id)?.timestamp as Date}
                                callback={() => {
                                    getOngoingQuests();
                                }}
                                isDescending
                            />
                        )}

                        {isQuestComplete() && (
                            <Flex alignItems="center">
                                <CheckIcon boxSize={4} color="whitesmoke" />
                                <Text ml={2}>Finished</Text>
                            </Flex>
                        )}
                    </Box>
                </Flex>
            </Flex>

            {/* Quest details */}
            <Flex flex={5} justifyContent="center">
                <Flex flexDir="column">
                    <Flex justifyContent="space-between" alignItems="flex-end">
                        <Text fontSize="20px" lineHeight="22px" fontWeight={600} letterSpacing="0.5px" color="header.gold">
                            {currentQuest.name}
                        </Text>

                        <Flex>
                            {currentQuest.rewards.map((reward: { resource: string }, index: number) => (
                                <Box ml={3} key={index}>
                                    <Image height="28px" src={RESOURCE_ELEMENTS[reward.resource].icon} />
                                </Box>
                            ))}
                        </Flex>
                    </Flex>

                    <Box my={3.5}>
                        <Separator type="horizontal" width="100%" height="1px" />
                    </Box>

                    <Box>{currentQuest.description}</Box>

                    <Text fontSize="20px" lineHeight="22px" fontWeight={600} letterSpacing="0.5px" color="header.gold" mt={10}>
                        Quest rewards
                    </Text>

                    <Box
                        mt={3.5}
                        display="grid"
                        gridAutoColumns="1fr 1fr"
                        gridTemplateColumns="1fr 1fr "
                        rowGap={4}
                        columnGap={4}
                    >
                        {map(currentQuest.rewards, (reward, index) => {
                            const { name, color, icon, image } = getResourceElements(reward.resource);
                            return (
                                <Box key={index}>
                                    <Reward image={image} name={name} value={reward.value} icon={icon} />
                                </Box>
                            );
                        })}
                    </Box>

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
                                Story
                            </Text>

                            <Flex mt={3.5}>
                                <ActionButton
                                    colorScheme="lore"
                                    onClick={() => {
                                        playSound('mystery');
                                        onVisionOpen();
                                    }}
                                >
                                    <Flex alignItems="center">
                                        <AiOutlineEye fontSize="18px" />
                                        <Text ml="1">Vision</Text>
                                    </Flex>
                                </ActionButton>
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>

            {/* Ticket */}
            <Modal size="md" onClose={onTicketModalClose} isOpen={isTicketModalOpen} isCentered>
                <ModalOverlay />
                <ModalContent backgroundColor="darkBlue">
                    <ModalHeader>Congratulations!</ModalHeader>
                    <ModalCloseButton
                        zIndex={1}
                        color="white"
                        _focusVisible={{ outline: 0 }}
                        _hover={{ background: 'blackAlpha.300' }}
                        borderRadius="3px"
                    />
                    <ModalBody minHeight="500px">
                        <Flex flexDir="column" justifyContent="center" alignItems="center" py={2}>
                            <Box width="300px" mt={-16} mb={-12}>
                                <video autoPlay={true} muted={true} loop={false} onClick={(e) => (e.target as any).play()}>
                                    <source src={getSpinningTicket()} type="video/webm" />
                                </video>
                            </Box>

                            <Text mt={1.5} fontSize="lg">
                                You have earned 1 ticket!
                            </Text>
                        </Flex>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Vision */}
            <Modal size="full" onClose={onVisionClose} isOpen={isVisionOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton zIndex={1} color="white" _focusVisible={{ outline: 0 }} borderRadius="3px" />
                    <ModalBody padding={0} style={getBackgroundStyle(getVisionImage())}></ModalBody>
                </ModalContent>
            </Modal>

            {/* Multiple quests */}
            <Modal size="xl" onClose={onQuestsModalClose} isOpen={isQuestsModalOpen} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start multiple quests</ModalHeader>

                    <ModalCloseButton zIndex={1} color="white" _focusVisible={{ outline: 0 }} borderRadius="3px" />
                    <ModalBody>
                        <Checkbox
                            ml={2}
                            mb={2}
                            isChecked={areAllQuestsSelected}
                            isIndeterminate={isIndeterminate}
                            onChange={() => onSelectAll()}
                        >
                            Select all
                        </Checkbox>

                        <CheckboxGroup
                            value={selectedQuestIds}
                            onChange={onCheckboxGroupChange}
                            colorScheme="blue"
                            defaultValue={[]}
                        >
                            <Stack
                                spacing={{ md: 1, lg: 1.5 }}
                                direction="column"
                                maxHeight={{ md: '348px', lg: '500px' }}
                                overflowY="auto"
                            >
                                {_(QUESTS)
                                    .filter((quest) => isQuestDefault(quest))
                                    .map((quest) => (
                                        <Checkbox
                                            key={quest.id}
                                            value={quest.id.toString()}
                                            transition="all 0.05s ease-in"
                                            backgroundColor="#364255"
                                            _hover={{ backgroundColor: '#3c485c' }}
                                            px={2}
                                            py={{ md: 0.5, lg: 1 }}
                                            borderRadius="2px"
                                        >
                                            <DetailedQuestCard quest={quest} />
                                        </Checkbox>
                                    ))
                                    .value()}
                            </Stack>
                        </CheckboxGroup>

                        <Flex alignItems="center" mt={5} mb={1}>
                            <Text layerStyle="header2" mr={1}>
                                Total Requirements
                            </Text>

                            {!canStartMultipleQuests() && _.size(selectedQuestIds) > 0 && (
                                <Flex alignItems="center" color="brightRed">
                                    <AiOutlineExclamation style={{ marginBottom: '1px' }} fontSize="20px" />
                                    <Text ml={-0.5} fontSize="15px">
                                        Not enough resources
                                    </Text>
                                </Flex>
                            )}
                        </Flex>

                        {getTotalRequirements()}

                        <Text mt={5} layerStyle="header2">
                            Total Rewards
                        </Text>

                        {getTotalRewards()}
                    </ModalBody>

                    <ModalFooter>
                        <ActionButton
                            colorScheme="blue"
                            customStyle={{ width: '142px' }}
                            disabled={!canStartMultipleQuests()}
                            onClick={() => console.log('Click')}
                        >
                            <Text>Start Quests</Text>
                        </ActionButton>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Quests;
