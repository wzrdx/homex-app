import { useCallback, useEffect, useState } from 'react';
import { Checkbox, CheckboxGroup, Flex, Modal, ModalOverlay, Text, Image, Box } from '@chakra-ui/react';
import _, { find, findIndex, round } from 'lodash';
import { QUESTS, QuestsContextType, getQuest, useQuestsContext } from '../services/quests';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import QuestCard from '../shared/QuestCard';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { Address, List, TokenTransfer, U8Type, U8Value } from '@multiversx/sdk-core/out';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { smartContract } from '../blockchain/smartContract';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { addMinutes, differenceInHours, isAfter, isBefore } from 'date-fns';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { useLayout } from './Layout';
import { CHAIN_ID } from '../blockchain/config';
import { getTotalQuestsRewards } from '../services/helpers';
import { getTrialTimestamp } from '../blockchain/api/getTrialTimestamp';
import { Quest } from '../types';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import { MdOutlineErrorOutline } from 'react-icons/md';

const GRACE_PERIOD_INTERVAL = 24;

function Quests() {
    const { closeToast } = useLayout();

    const { address } = useGetAccountInfo();

    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { ongoingQuests, getOngoingQuests, isQuestsModalOpen, onQuestsModalClose } = useQuestsContext() as QuestsContextType;

    const { resources } = useResourcesContext() as ResourcesContextType;

    const [isCompleteAllButtonLoading, setCompleteAllLoading] = useState(false);
    const [isStartButtonLoading, setStartButtonLoading] = useState(false);

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

    const init = async () => {
        getOngoingQuests();
        setTrialTimestamp(await getTrialTimestamp());
    };

    const startQuests = async () => {
        setStartButtonLoading(true);

        const user = new Address(address);
        const requirements = getRequiredResources();

        const transfers = _(Object.keys(requirements))
            .filter((resource) => requirements[resource] > 0)
            .map((resource) => TokenTransfer.fungibleFromAmount(RESOURCE_ELEMENTS[resource].tokenId, requirements[resource], 6))
            .value();

        const args = new List(
            new U8Type(),
            _.map(selectedQuestIds, (id) => new U8Value(Number.parseInt(id)))
        );

        try {
            const tx = smartContract.methods
                .startQuests([args])
                .withMultiESDTNFTTransfer(transfers)
                .withSender(user)
                .withChainID(CHAIN_ID)
                .withGasLimit(9250000 + 250000 * _.size(transfers) + 550000 * _.size(selectedQuestIds))
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
                    type: TransactionType.StartMultipleQuests,
                    resolution: TxResolution.UpdateQuestsAndResources,
                    data: {
                        questIds: selectedQuestIds,
                        resources: Object.keys(requirements),
                    },
                },
            ]);
        } catch (err) {
            console.error('Error occured during startQuests', err);
        }
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

    const getRequiredResources = () => {
        const quests: Quest[] = _.map(selectedQuestIds, (questId) => getQuest(Number.parseInt(questId)));
        const requirements = {};

        _.forEach(quests, (quest) => {
            _.forEach(Object.keys(quest.requirements), (resource) => {
                if (!requirements[resource]) {
                    requirements[resource] = 0;
                }

                requirements[resource] += quest.requirements[resource];
            });
        });

        return requirements;
    };

    const getTotalRequirements = () => {
        const requirements = getRequiredResources();

        return (
            <>
                {_.isEmpty(requirements) ? (
                    <></>
                ) : (
                    <Flex py={2.5} backgroundColor="#000000d9" borderRadius="2px">
                        {_.map(Object.keys(requirements), (resource, index) => (
                            <Flex key={index} alignItems="center" mx={4}>
                                <Image width="20px" src={RESOURCE_ELEMENTS[resource].icon} />
                                <Text
                                    ml={1.5}
                                    color={requirements[resource] > resources[resource] ? 'redClrs' : 'availableResource'}
                                    as="span"
                                >
                                    {requirements[resource]}
                                </Text>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </>
        );
    };

    const getQuestCards = (type: string) => (
        <Flex flexDir="column" py={5} _last={{ paddingBottom: '2px' }}>
            {_(QUESTS)
                .filter((quest) => quest.type === type)
                .map((quest) => (
                    <Box mb={4} key={quest.id}>
                        {isQuestDefault(quest) ? (
                            <Checkbox
                                className="Detailed-Quest-Checkbox"
                                width="100%"
                                value={quest.id.toString()}
                                transition="all 0.05s ease-in"
                            >
                                <Box ml={2}>
                                    <QuestCard
                                        key={quest.id}
                                        quest={quest}
                                        timestamp={
                                            find(ongoingQuests, (ongoingQuest) => ongoingQuest.id === quest.id)?.timestamp
                                        }
                                    />
                                </Box>
                            </Checkbox>
                        ) : (
                            <Box>
                                <QuestCard
                                    key={quest.id}
                                    quest={quest}
                                    timestamp={find(ongoingQuests, (ongoingQuest) => ongoingQuest.id === quest.id)?.timestamp}
                                />
                            </Box>
                        )}
                    </Box>
                ))
                .value()}
        </Flex>
    );

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

    const onCheckboxGroupChange = useCallback((array: string[]) => {
        setSelectedQuestIds(array);
    }, []);

    const canStartMultipleQuests = (): boolean => {
        if (_.size(selectedQuestIds) === 0) {
            return false;
        }

        const requirements = getRequiredResources();
        const keys = Object.keys(requirements);
        const result = keys.every((key) => resources[key] >= requirements[key]);

        return result;
    };

    const getLongestQuestInfo = (): { longestQuest: Quest; isAfterEnd: boolean } => {
        const quests: Quest[] = _.map(selectedQuestIds, (questId) => getQuest(Number.parseInt(questId)));
        const longestQuest = _(quests).orderBy('duration', 'desc').first() as Quest;
        const isAfterEnd = isAfter(addMinutes(new Date(), longestQuest.duration), trialTimestamp as Date);

        return {
            longestQuest,
            isAfterEnd,
        };
    };

    const canBeCompleted = (): boolean => {
        if (!trialTimestamp) {
            return false;
        }

        if (_.isEmpty(selectedQuestIds)) {
            return true;
        }

        const { isAfterEnd } = getLongestQuestInfo();

        return !isAfterEnd;
    };

    const checkCompletionTime = () => {
        let result = <Flex></Flex>;

        if (!trialTimestamp || _.isEmpty(selectedQuestIds)) {
            return result;
        }

        const { longestQuest, isAfterEnd } = getLongestQuestInfo();

        if (isAfterEnd) {
            result = (
                <Flex flexDir="column" mt={4}>
                    <Flex alignItems="center" color="brightRed">
                        <MdOutlineErrorOutline style={{ marginBottom: '1px' }} fontSize="19px" />
                        <Text ml={1}>Quest duration exceeds end of Trial </Text>
                    </Flex>

                    <Text>{longestQuest.name}</Text>
                </Flex>
            );
        }

        return result;
    };

    return (
        <Flex>
            <Flex zIndex={5} position="fixed" bottom={6} right={4} left={4} justifyContent="center">
                {getTotalRequirements()}
            </Flex>

            {/* Quest list */}
            <Flex flex={5} justifyContent="center">
                <Flex flexDir="column" width="100%">
                    <Flex mb={1} justifyContent="space-between">
                        <ActionButton
                            colorScheme="blue"
                            disabled={isGamePaused || !canStartMultipleQuests() || !canBeCompleted()}
                            customStyle={{ width: '148px' }}
                            isLoading={isStartButtonLoading || isTxPending(TransactionType.StartMultipleQuests)}
                            onClick={startQuests}
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

                    {checkCompletionTime()}

                    <Box mt={4}>
                        <CheckboxGroup
                            value={selectedQuestIds}
                            onChange={onCheckboxGroupChange}
                            colorScheme="blue"
                            defaultValue={[]}
                        >
                            <Flex justifyContent="space-between" alignItems="center">
                                <Text layerStyle="header1">Herbalism</Text>
                                <Checkbox
                                    isChecked={areAllQuestsSelected}
                                    isIndeterminate={isIndeterminate}
                                    onChange={() => onSelectAll()}
                                >
                                    Select all
                                </Checkbox>
                            </Flex>

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
                    </Box>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Quests;
