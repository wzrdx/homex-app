import { useCallback, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, Flex, Modal, ModalOverlay, Text } from '@chakra-ui/react';
import _, { find, findIndex } from 'lodash';
import { QUESTS, QuestsContextType, useQuestsContext } from '../services/quests';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import QuestCard from '../shared/QuestCard';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Address } from '@multiversx/sdk-core/out';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { differenceInHours, isAfter, isBefore } from 'date-fns';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { useLayout } from './Layout';
import { CHAIN_ID } from '../blockchain/config';
import { getTotalQuestsRewards } from '../services/helpers';
import { getTrialTimestamp } from '../blockchain/api/getTrialTimestamp';
import { Quest } from '../types';
import MultipleQuests from './MultipleQuests';

const GRACE_PERIOD_INTERVAL = 24;

function Quests() {
    const { displayToast, closeToast } = useLayout();

    const { address } = useGetAccountInfo();

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;
    const { ongoingQuests, getOngoingQuests, isQuestsModalOpen, onQuestsModalOpen, onQuestsModalClose } =
        useQuestsContext() as QuestsContextType;

    const [isCompleteAllButtonLoading, setCompleteAllLoading] = useState(false);

    const [trialTimestamp, setTrialTimestamp] = useState<Date>();

    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);

    const isQuestDefault = (quest: Quest) => findIndex(ongoingQuests, (q) => q.id === quest.id) < 0;

    const areAllQuestsSelected =
        _.size(selectedQuestIds) ===
        _(QUESTS)
            .filter((quest) => isQuestDefault(quest))
            .size();

    const isIndeterminate = _.size(selectedQuestIds) > 0 && !areAllQuestsSelected;

    // Init
    useEffect(() => {
        init();
    }, []);

    // Trial timestamp handling
    useEffect(() => {
        if (
            trialTimestamp &&
            differenceInHours(trialTimestamp, new Date()) < GRACE_PERIOD_INTERVAL &&
            !isGamePaused &&
            isBefore(new Date(), trialTimestamp)
        ) {
            const difference = differenceInHours(trialTimestamp, new Date());
            const duration =
                difference > 1 ? `about ${difference} hours` : difference === 1 ? `about one hour` : 'less than an hour';

            displayToast(
                'time',
                `Trial ends in ${duration}`,
                'Claim your quest rewards before the end or they will be lost',
                'orangered',
                5000,
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

    const completeAllQuests = async () => {
        setCompleteAllLoading(true);

        const user = new Address(address);

        const completedQuestsIds = _(ongoingQuests)
            .filter((quest) => isAfter(new Date(), quest.timestamp))
            .map((quest) => quest.id)
            .value();

        const otherOngoingQuestsCount = _(ongoingQuests)
            .filter((quest) => !isAfter(new Date(), quest.timestamp))
            .size();

        if (_.isEmpty(completedQuestsIds)) {
            displayToast('error', `Unable to claim rewards`, 'No quests can be completed yet', 'orangered');
            setCompleteAllLoading(false);
            return;
        }

        const completedQuests: Quest[] = _.filter(QUESTS, (quest) => _.includes(completedQuestsIds, quest.id));

        const rewards = getTotalQuestsRewards(completedQuests);
        const rewardedResources = Object.keys(rewards);

        const gains = _.map(rewardedResources, (resource) => ({
            resource,
            value: rewards[resource],
        }));

        const gasLimit: number =
            12000000 +
            300000 * otherOngoingQuestsCount +
            (rewardedResources.includes('tickets') ? 1500000 : 0) +
            250000 * _.size(rewardedResources) +
            250000 * _.size(completedQuests);

        try {
            const tx = smartContract.methods
                .completeAllQuests()
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

            setCompleteAllLoading(false);

            setPendingTxs((txs) => [
                ...txs,
                {
                    sessionId,
                    type: TransactionType.CompleteAllQuests,
                    resolution: TxResolution.UpdateQuestsAndResources,
                    data: {
                        resources: rewardedResources,
                        completedQuestsIds,
                        gains,
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured during completeAllQuests', err);
        }
    };

    const onQuestClick = () => {
        playSound('select_quest');
    };

    const getQuestCards = (type: string) => (
        <Flex flexDir="column" py={5} _last={{ paddingBottom: '2px' }}>
            {_(QUESTS)
                .filter((quest) => quest.type === type)
                .map((quest) => (
                    <Checkbox
                        className="Detailed-Quest-Checkbox"
                        key={quest.id}
                        value={quest.id.toString()}
                        mb={3}
                        transition="all 0.05s ease-in"
                    >
                        <QuestCard
                            key={quest.id}
                            quest={quest}
                            callback={onQuestClick}
                            timestamp={find(ongoingQuests, (ongoingQuest) => ongoingQuest.id === quest.id)?.timestamp}
                        />
                    </Checkbox>
                ))
                .value()}
        </Flex>
    );

    const onCheckboxGroupChange = useCallback((array: string[]) => {
        setSelectedQuestIds(array);
    }, []);

    return (
        <Flex>
            {/* Quest list */}
            <Flex flex={5} justifyContent="center">
                <Flex flexDir="column" width="100%">
                    <Flex mb={6} justifyContent="space-between">
                        <ActionButton
                            colorScheme="blue"
                            disabled={_.isEmpty(selectedQuestIds)}
                            customStyle={{ width: '148px' }}
                        >
                            <Text>Start quests</Text>
                        </ActionButton>

                        <ActionButton
                            colorScheme="green"
                            isLoading={isCompleteAllButtonLoading || isTxPending(TransactionType.CompleteAllQuests)}
                            customStyle={{ width: '180px' }}
                            onClick={completeAllQuests}
                        >
                            <Text>Claim all rewards</Text>
                        </ActionButton>
                    </Flex>

                    {/* <ActionButton colorScheme="red" onClick={onQuestsModalOpen}>
                        <Text>Multiple</Text>
                    </ActionButton> */}

                    <CheckboxGroup
                        value={selectedQuestIds}
                        onChange={onCheckboxGroupChange}
                        colorScheme="blue"
                        defaultValue={[]}
                    >
                        <Text layerStyle="header1">Herbalism</Text>
                        {getQuestCards('herbalism')}

                        <Text layerStyle="header1">Jewelcrafting</Text>
                        {getQuestCards('jewelcrafting')}

                        <Text layerStyle="header1">Divination</Text>
                        {getQuestCards('divination')}

                        <Text layerStyle="header1">Alchemy</Text>
                        {getQuestCards('alchemy')}

                        <Text layerStyle="header1">Missions</Text>
                        {getQuestCards('final')}
                    </CheckboxGroup>
                </Flex>
            </Flex>

            {/* Quest details */}
            {/* <Flex flex={5} justifyContent="center">
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

                    <Text
                        fontSize="20px"
                        lineHeight="22px"
                        fontWeight={600}
                        letterSpacing="0.5px"
                        color="header.gold"
                        mt={{ md: 5, lg: 10 }}
                    >
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
            </Flex> */}

            {/* Multiple quests */}
            <Modal size="xl" onClose={onQuestsModalClose} isOpen={isQuestsModalOpen} isCentered>
                <ModalOverlay />
                <MultipleQuests />
            </Modal>
        </Flex>
    );
}

export default Quests;
