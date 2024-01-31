import { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    AlertIcon,
    Checkbox,
    CheckboxGroup,
    Flex,
    Image,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
    Text,
} from '@chakra-ui/react';
import _, { findIndex } from 'lodash';
import { QUESTS, QuestsContextType, getQuest, useQuestsContext } from '../services/quests';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import { ActionButton } from '../shared/ActionButton/ActionButton';
import { getTotalQuestsRewards, round } from '../services/helpers';
import { Quest } from '../types';
import { DetailedQuestCard } from '../shared/DetailedQuestCard';
import { Address, List, TokenTransfer, U8Type, U8Value } from '@multiversx/sdk-core/out';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/game/smartContract';
import { TransactionType, TransactionsContextType, TxResolution, useTransactionsContext } from '../services/transactions';
import { InfoOutlineIcon, TimeIcon } from '@chakra-ui/icons';
import { getTrialTimestamp } from '../blockchain/game/api/getTrialTimestamp';
import { addMinutes, isAfter, isBefore } from 'date-fns';

function MultipleQuests() {
    const { ongoingQuests, getOngoingQuests } = useQuestsContext() as QuestsContextType;
    const { resources } = useResourcesContext() as ResourcesContextType;
    const { isTxPending, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;

    const [isButtonLoading, setButtonLoading] = useState(false);
    const [trialTimestamp, setTrialTimestamp] = useState<Date>();

    const { address } = useGetAccountInfo();

    const isQuestDefault = (quest: Quest) => findIndex(ongoingQuests, (q) => q.id === quest.id) < 0;

    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);
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
        setButtonLoading(true);

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
                .withGasLimit(26000000 + 250000 * _.size(transfers) + 1500000 * _.size(selectedQuestIds))
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

            setButtonLoading(false);

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
                <Flex flexDir="column">
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
                    <Flex alignItems="center" minH="30px">
                        <InfoOutlineIcon />
                        <Text ml={1.5}>Please select a quest first</Text>
                    </Flex>
                ) : (
                    <Flex minH="30px">
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
                )}
            </>
        );
    };

    const getTotalRewards = () => {
        const quests: Quest[] = _.map(selectedQuestIds, (questId) => getQuest(Number.parseInt(questId)));
        const rewards = getTotalQuestsRewards(quests);

        return (
            <>
                {_.isEmpty(rewards) ? (
                    <Flex alignItems="center" minH="30px">
                        <InfoOutlineIcon />
                        <Text ml={1.5}>Please select a quest first</Text>
                    </Flex>
                ) : (
                    <Flex minH="30px">
                        {_.map(Object.keys(rewards), (resource, index) => (
                            <Flex key={index} alignItems="center" mr={4}>
                                {!RESOURCE_ELEMENTS[resource].icon ? (
                                    <Text as="span" fontWeight={800}>
                                        XP
                                    </Text>
                                ) : (
                                    <Image width="20px" src={RESOURCE_ELEMENTS[resource].icon} />
                                )}
                                <Text ml={1.5}>{rewards[resource]}</Text>
                            </Flex>
                        ))}
                    </Flex>
                )}
            </>
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
        <ModalContent maxW="780px">
            <ModalHeader>Start multiple quests</ModalHeader>

            <ModalCloseButton zIndex={1} color="white" _focusVisible={{ outline: 0 }} borderRadius="3px" />
            <ModalBody>
                {_(QUESTS)
                    .filter((quest) => isQuestDefault(quest))
                    .isEmpty() ? (
                    <Alert status="warning">
                        <AlertIcon />
                        No available quests
                    </Alert>
                ) : (
                    <>
                        <Flex mb={2} px={2} justifyContent="space-between" alignItems="center">
                            <Checkbox
                                isChecked={areAllQuestsSelected}
                                isIndeterminate={isIndeterminate}
                                onChange={() => onSelectAll()}
                            >
                                Select all
                            </Checkbox>

                            <TimeIcon fontSize="17px" />
                        </Flex>

                        <CheckboxGroup
                            value={selectedQuestIds}
                            onChange={onCheckboxGroupChange}
                            colorScheme="blue"
                            defaultValue={[]}
                        >
                            <Stack
                                spacing={{ md: 1, lg: 1.5 }}
                                direction="column"
                                maxHeight={{ md: '354px', lg: '500px' }}
                                overflowY="auto"
                            >
                                {_(QUESTS)
                                    .filter((quest) => isQuestDefault(quest))
                                    .map((quest) => (
                                        <Checkbox
                                            className="Detailed-Quest-Checkbox"
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
                    </>
                )}

                <Flex alignItems="center" mt={6}>
                    <Text layerStyle="header2" mr={1}>
                        Total Requirements
                    </Text>

                    {!canStartMultipleQuests() && _.size(selectedQuestIds) > 0 && (
                        <Flex ml={1} alignItems="center" color="brightRed">
                            <MdOutlineErrorOutline style={{ marginBottom: '1px' }} fontSize="19px" />
                            <Text ml={1}>Not enough resources</Text>
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
                <Flex width="100%" justifyContent="space-between" alignItems="center" minH="48px">
                    {checkCompletionTime()}

                    <ActionButton
                        colorScheme="blue"
                        customStyle={{ width: '142px' }}
                        disabled={isGamePaused || !canStartMultipleQuests() || !canBeCompleted()}
                        isLoading={isButtonLoading || isTxPending(TransactionType.StartMultipleQuests)}
                        onClick={startQuests}
                    >
                        <Text>Start Quests</Text>
                    </ActionButton>
                </Flex>
            </ModalFooter>
        </ModalContent>
    );
}

export default MultipleQuests;
