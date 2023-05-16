import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import _, { find, findIndex, includes } from 'lodash';
import {
    QUESTS,
    QUEST_DURATION_INTERVAL,
    QuestsContextType,
    getQuest,
    getQuestImage,
    meetsRequirements,
    useQuestsContext,
} from '../services/quests';
import Frame from '../assets/frame.png';
// import Vision from '../assets/vision.jpg';
import Vision from '../assets/videos/vision.webm';
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
import { TimeIcon, CheckIcon } from '@chakra-ui/icons';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { useGetAccountInfo, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { PendingTx, QuestStatus, TxResolution } from '../blockchain/types';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { Timer } from '../shared/Timer';
import { useGetOngoingQuests } from '../blockchain/hooks/useGetOngoingQuests';
import { isAfter, isBefore } from 'date-fns';
import { TransactionType, TransactionsContextType, useTransactionsContext } from '../services/transactions';

const LARGE_FRAME_SIZE = 318;
const LARGE_IMAGE_SIZE = 424;

const MEDIUM_FRAME_SIZE = 246;
const MEDIUM_IMAGE_SIZE = 328;

function Quests() {
    const navigate = useNavigate();
    const { isOpen: isVisionOpen, onOpen: onVisionOpen, onClose: onVisionClose } = useDisclosure();

    const { address } = useGetAccountInfo();

    const { setTxs, isQuestTxPending } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;
    const { quest: currentQuest, setQuest } = useQuestsContext() as QuestsContextType;
    const { resources, getEnergy, getHerbs, getGems, getEssence, getTickets } =
        useResourcesContext() as ResourcesContextType;

    const [isStartButtonLoading, setStartButtonLoading] = useState(false);
    const [isFinishButtonLoading, setFinishButtonLoading] = useState(false);

    const { ongoingQuests, getOngoingQuests } = useGetOngoingQuests();

    const isQuestDefault = () => findIndex(ongoingQuests, (q) => q.id === currentQuest.id) < 0;
    const isQuestOngoing = () =>
        findIndex(ongoingQuests, (q) => q.id === currentQuest.id && isBefore(new Date(), q.timestamp)) > -1;
    const isQuestComplete = () =>
        findIndex(ongoingQuests, (q) => q.id === currentQuest.id && isAfter(new Date(), q.timestamp)) > -1;

    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();
    const [pendingTxs, setPendingTxs] = useState<PendingTx[]>([]);

    // Init
    useEffect(() => {
        getOngoingQuests();
    }, []);

    // Tx tracker
    useEffect(() => {
        if (hasSuccessfulTransactions) {
            successfulTransactionsArray.forEach((tx: [string, any]) => {
                const pendingTx = _.find(pendingTxs, (pTx) => pTx.sessionId === tx[0]);

                if (pendingTx) {
                    // console.log('TxResolution', pendingTx);

                    setPendingTxs((array) => _.filter(array, (pTx) => pTx.sessionId !== pendingTx.sessionId));

                    switch (pendingTx.resolution) {
                        case TxResolution.UpdateResources:
                            const resources: string[] = pendingTx.data.resources;

                            getOngoingQuests();

                            const calls = _.map(resources, (resource) => getResourceCall(resource));
                            _.forEach(calls, (call) => call());
                            break;

                        default:
                            console.error('Unknown txResolution type');
                    }
                }
            });
        }
    }, [successfulTransactionsArray]);

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
                .withChainID('D')
                .withGasLimit(4000000 + requiredResources.length * 1000000)
                .buildTransaction();

            // console.log(tx.getData().toString());

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

            // console.log('startQuest', sessionId);

            setStartButtonLoading(false);

            setTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.StartQuest,
                    questId: currentQuest.id,
                },
            ]);

            setPendingTxs((array) => [
                ...array,
                {
                    sessionId,
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
        if (isFinishButtonLoading) {
            return;
        }

        const user = new Address(address);

        setFinishButtonLoading(true);

        try {
            const tx = smartContract.methods
                .completeQuest([currentQuest.id])
                .withSender(user)
                .withChainID('D')
                .withGasLimit(7000000)
                .buildTransaction();

            // console.log(tx.getData().toString());

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

            // console.log('completeQuest', sessionId);

            setFinishButtonLoading(false);

            setTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.CompleteQuest,
                    questId: currentQuest.id,
                },
            ]);

            setPendingTxs((array) => [
                ...array,
                {
                    sessionId,
                    resolution: TxResolution.UpdateResources,
                    data: {
                        resources: _.map(currentQuest.rewards, (reward) => reward.resource),
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

    const getResourceCall = (resource: string): (() => Promise<void>) => {
        switch (resource) {
            case 'energy':
                return getEnergy;

            case 'herbs':
                return getHerbs;

            case 'gems':
                return getGems;

            case 'essence':
                return getEssence;

            case 'tickets':
                return getTickets;

            default:
                console.error('getResourceCall(): Unknown resource type');
                return async () => {};
        }
    };

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
                <Flex pb={{ md: 0, lg: 4 }} flexDir="column" justifyContent="center" alignItems="center">
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="relative"
                        width={[null, MEDIUM_IMAGE_SIZE, MEDIUM_IMAGE_SIZE, LARGE_IMAGE_SIZE]}
                        height={[null, MEDIUM_IMAGE_SIZE, MEDIUM_IMAGE_SIZE, LARGE_IMAGE_SIZE]}
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
                            <Image
                                src={Frame}
                                alt="Frame"
                                zIndex={3}
                                width={[null, MEDIUM_FRAME_SIZE, MEDIUM_FRAME_SIZE, LARGE_FRAME_SIZE]}
                            />
                        </Flex>

                        <Image
                            src={getQuestImage(currentQuest.id)}
                            alt="Quest-Image"
                            zIndex={2}
                            width={[null, MEDIUM_IMAGE_SIZE, MEDIUM_IMAGE_SIZE, LARGE_IMAGE_SIZE]}
                            clipPath="polygon(50% 3%, 69% 10%, 82% 27%, 82% 95%, 18% 95%, 18% 27%, 31% 10%)"
                        />
                    </Flex>

                    <Flex my={{ md: 5, lg: 8 }}>
                        {Object.keys(currentQuest.requirements).map((resource) => (
                            <Flex key={resource} width={{ md: '86px', lg: '102px' }} justifyContent="center">
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
                                    isStartButtonLoading ||
                                    isQuestTxPending(TransactionType.StartQuest, currentQuest.id)
                                }
                                disabled={!meetsRequirements(resources, currentQuest.id)}
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
                                    isFinishButtonLoading ||
                                    isQuestTxPending(TransactionType.CompleteQuest, currentQuest.id)
                                }
                                colorScheme="green"
                                onClick={completeQuest}
                            >
                                <Text>Complete</Text>
                            </ActionButton>
                        )}
                    </Box>

                    <Box>
                        {isQuestDefault() && (
                            <Flex alignItems="center">
                                <TimeIcon boxSize={4} color="whitesmoke" />
                                <Text ml={2}>
                                    {`${currentQuest.duration} ${QUEST_DURATION_INTERVAL}${
                                        currentQuest.duration > 1 ? 's' : ''
                                    }`}
                                </Text>
                            </Flex>
                        )}

                        {isQuestOngoing() && (
                            <Timer
                                isActive={true}
                                timestamp={
                                    _.find(ongoingQuests, (quest) => quest.id === currentQuest.id)?.timestamp as Date
                                }
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
                        <Text
                            fontSize="20px"
                            lineHeight="22px"
                            fontWeight={600}
                            letterSpacing="0.5px"
                            color="header.gold"
                        >
                            {currentQuest.name}
                        </Text>

                        <Box>
                            {currentQuest.rewards.map((reward: { resource: string }, index: number) => (
                                <Box key={index}>
                                    <Image height="28px" src={RESOURCE_ELEMENTS[reward.resource].icon} />
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
                                            borderRadius="50%"
                                            width="100px"
                                            height="100px"
                                            boxShadow="0 0 6px 3px #0000008c"
                                            backgroundColor="black"
                                        />
                                    </Box>

                                    <Flex flexDir="column" ml={4}>
                                        <Text mb={1} fontSize="18px">
                                            {name}
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
                                        <Text ml="1">Story</Text>
                                    </Flex>
                                </ActionButton>
                            </Flex>
                        </>
                    )}
                </Flex>
            </Flex>

            {/* Vision */}
            <Modal size="full" onClose={onVisionClose} isOpen={isVisionOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton zIndex={1} color="white" _focusVisible={{ outline: 0 }} borderRadius="3px" />
                    <ModalBody padding={0}>
                        <Box>
                            <video
                                style={{
                                    position: 'fixed',
                                    right: 0,
                                    bottom: 0,
                                    minWidth: '100%',
                                    minHeight: '100%',
                                    transform: 'translateX(calc((100% - 100vw) / 2))',
                                    maxWidth: 'fit-content',
                                }}
                                autoPlay={true}
                                muted={true}
                                loop={true}
                            >
                                <source src={Vision} type="video/webm" />
                            </video>
                        </Box>

                        <Box position="absolute" bottom="16px" right="24px">
                            <Button onClick={onVisionClose} colorScheme="orange">
                                Close
                            </Button>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Flex>
    );
}

export default Quests;
