import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ChakraBaseProvider, useToast, Text, Flex } from '@chakra-ui/react';
import { routeNames, routes } from './services/routes';
import { AuthenticationProvider } from './services/authentication';
import { TransactionsToastList, NotificationModal, SignTransactionsModals } from '@multiversx/sdk-dapp/UI';
import { theme } from './theme';
import { ProtectedRoute } from './shared/ProtectedRoute';
import Layout from './components/Layout';
import Unlock from './components/Unlock';
import { ResourcesContextType, useResourcesContext } from './services/resources';
import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import { map, head, includes, first, find, cloneDeep, remove, forEach, isEmpty, isNaN, size } from 'lodash';
import { useEffect } from 'react';
import {
    useTransactionsContext,
    TransactionsContextType,
    TransactionType,
    Transaction,
    TxResolution,
} from './services/transactions';
import { useSoundsContext, SoundsContextType } from './services/sounds';
import ResourcesToast from './shared/ResourcesToast';
import { QuestsContextType, getQuest, useQuestsContext } from './services/quests';
import { Quest } from './types';
import { CustomToast } from './shared/CustomToast';
import { useStoreContext, StoreContextType } from './services/store';
import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';
import { getTx } from './services/helpers';
import { ENERGY_TOKEN_ID, TOKEN_DENOMINATION } from './blockchain/config';
import { useRewardsContext, RewardsContextType } from './services/rewards';

function App() {
    const toast = useToast();

    const { pendingTxs, setPendingTxs, isGamePaused } = useTransactionsContext() as TransactionsContextType;
    const { playSound } = useSoundsContext() as SoundsContextType;

    const { failedTransactionsArray } = useGetFailedTransactions();
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    const { getOngoingQuests, onQuestsModalClose } = useQuestsContext() as QuestsContextType;
    const { getStakingInfo, getWalletNFTs } = useStoreContext() as StoreContextType;

    const { getEnergy, getHerbs, getGems, getEssence, getTickets, onTicketModalOpen } =
        useResourcesContext() as ResourcesContextType;

    const { getRaffles, getBattles, getTicketsAmount } = useRewardsContext() as RewardsContextType;

    // Init
    useEffect(() => {
        window.localStorage['chakra-ui-color-mode'] = 'dark';
        window['mobileCheck'] = function () {
            let check = false;
            (function (a) {
                if (
                    /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
                        a
                    ) ||
                    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                        a.substr(0, 4)
                    )
                )
                    check = true;
            })(navigator.userAgent || window['opera']);
            return check;
        };

        console.log((window as any).mobileCheck());
    }, []);

    useEffect(() => {
        if (isGamePaused) {
            displayPauseToast();
        }
    }, [isGamePaused]);

    useEffect(() => {
        removeTxs(failedTransactionsArray);
    }, [failedTransactionsArray]);

    useEffect(() => {
        if (hasSuccessfulTransactions) {
            const txs: Transaction[] = removeTxs(successfulTransactionsArray);

            forEach(txs, async (tx) => {
                if (tx.resolution) {
                    applyTxResolution(tx);
                }

                switch (tx.type) {
                    case TransactionType.CompleteQuest:
                        const quest: Quest = getQuest(tx.questId);
                        const isMission = quest.type === 'final';

                        displayResourcesToast(`${isMission ? 'Mission' : 'Quest'} complete`, quest.rewards, 'ticket');

                        if (isMission) {
                            onTicketModalOpen();
                        }

                        break;

                    case TransactionType.CompleteAllQuests:
                        displayResourcesToast('Quests complete', tx.data.gains, 'ticket');

                        displayToast(
                            'Success',
                            `Successfully completed ${
                                size(tx.data.completedQuestsIds) > 1 ? size(tx.data.completedQuestsIds) : 'one'
                            } quest${size(tx.data.completedQuestsIds) > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        break;

                    case TransactionType.StartQuest:
                        playSound('start_quest');
                        break;

                    case TransactionType.StartMultipleQuests:
                        displayToast(
                            'Success',
                            `Successfully started ${size(tx.data.questIds) > 1 ? size(tx.data.questIds) : 'one'} quest${
                                size(tx.data.questIds) > 1 ? 's' : ''
                            }`,
                            'green.500',
                            'start_quest'
                        );
                        break;

                    case TransactionType.Stake:
                        displayToast(
                            'Staking succesful',
                            `Successfully staked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500',
                            'stake'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.Unstake:
                        displayToast(
                            'Unstaking succesful',
                            `Successfully unstaked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.ClaimUnbondedNFTs:
                        displayToast(
                            'Claiming succesful',
                            `Successfully claimed ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        break;

                    case TransactionType.Restake:
                        displayToast(
                            'Restaking succesful',
                            `Successfully restaked ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.Migration:
                        displayToast(
                            'Migration succesful',
                            `Successfully migrated ${tx.data} NFT${tx.data > 1 ? 's' : ''}`,
                            'green.500'
                        );
                        break;

                    case TransactionType.ClaimEnergy:
                        displayEnergyGain(tx?.hash);
                        break;

                    case TransactionType.JoinRaffle:
                        displayToast('Tickets sent', 'Successfully joined the raffle', 'green.500');
                        break;

                    case TransactionType.JoinBattle:
                        displayToast('Tickets sent', 'Successfully joined the battle', 'green.500');
                        break;

                    case TransactionType.ClaimReward:
                        displayResourcesToast(
                            'Successfully claimed reward',
                            [{ resource: 'tickets', value: tx.data.ticketsAmount }],
                            'ticket'
                        );

                        break;

                    default:
                        console.error('Unknown TransactionType');
                }
            });
        }
    }, [successfulTransactionsArray]);

    const removeTxs = (transactions: [string, SignedTransactionsBodyType][]): Transaction[] => {
        let victims: Transaction[] = [];

        const victimSessionIds: string[] = map(transactions, (tx) => tx[0]);
        const pendingSessionIds: string[] = map(pendingTxs, (tx) => tx.sessionId);
        const hasTxsToRemove = victimSessionIds.some((id) => includes(pendingSessionIds, id));

        if (hasTxsToRemove) {
            const txs = cloneDeep(pendingTxs);
            victims = remove(txs, (tx) => includes(victimSessionIds, tx.sessionId));

            setPendingTxs(txs);
        }

        victims = map(victims, (victimTx) => {
            let hash: string | undefined;

            const tx = find(transactions, (tx) => tx[0] === victimTx.sessionId);

            if (tx && !isEmpty(tx[1].transactions)) {
                hash = head(tx[1].transactions)?.hash;
            }

            return { ...victimTx, hash };
        });

        return victims;
    };

    const applyTxResolution = (tx: Transaction) => {
        switch (tx.resolution) {
            case TxResolution.UpdateEnergy:
                getEnergy();
                break;

            case TxResolution.UpdateTicketsAndRewards:
                getTickets();
                getTicketsAmount();
                break;

            case TxResolution.UpdateTicketsAndRaffles:
                getTickets();
                getRaffles();
                break;

            case TxResolution.UpdateTicketsAndBattles:
                getTickets();
                getBattles();
                break;

            case TxResolution.UpdateQuestsAndResources:
                const resources: string[] = tx.data.resources;
                getOngoingQuests();
                onQuestsModalClose();

                const calls = map(resources, (resource) => getResourceCall(resource));
                forEach(calls, (call) => call());
                break;

            case TxResolution.UpdateStakingAndNFTs:
                getWalletNFTs();
                getEnergy();
                getStakingInfo();
                break;

            case TxResolution.UpdateStakingInfo:
                getEnergy();
                getStakingInfo();
                break;

            default:
                console.error('Unknown TxResolution');
        }
    };

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

    const displayResourcesToast = (
        title: string,
        gains: {
            resource: string;
            value: number;
        }[],
        sound = 'complete_quest'
    ) => {
        playSound(sound);

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '1rem',
                marginRight: '2rem',
            },
            duration: 8000,
            render: () => <ResourcesToast title={title} rewards={gains}></ResourcesToast>,
        });
    };

    const displayToast = (title: string, text: string, color = 'redClrs', sound = 'navigate') => {
        playSound(sound);

        toast({
            position: 'top-right',
            containerStyle: {
                marginTop: '1rem',
                marginRight: '2rem',
            },
            duration: 8000,
            render: () => (
                <CustomToast type="success" title={title} color={color}>
                    {text && <Text mt={2}>{text}</Text>}
                </CustomToast>
            ),
        });
    };

    const displayPauseToast = () => {
        toast({
            position: 'bottom-left',
            containerStyle: {
                margin: '3rem',
            },
            duration: 1000000,
            render: () => (
                <CustomToast type={'time'} title={'The game is temporarily paused'} color={'whitesmoke'}></CustomToast>
            ),
        });
    };

    const displayEnergyGain = async (txHash: string | undefined) => {
        if (txHash) {
            const result = await getTx(txHash);

            if (result.data) {
                const operation = find(
                    result.data.operations,
                    (op) => op.action === 'transfer' && op.identifier === ENERGY_TOKEN_ID
                );

                if (!operation) {
                    return;
                }

                const gain: number = operation.value / TOKEN_DENOMINATION;

                if (!gain || Number.isNaN(gain) || gain === 0) {
                    return;
                }

                displayResourcesToast('Energy gained', [{ resource: 'energy', value: gain }], 'unstake');
            }
        }
    };

    return (
        <Flex justifyContent="center" alignItems="center" backgroundColor="black" minH="400px">
            <Text fontSize="xl" color="white">{`${(window as any).mobileCheck()}`}</Text>
        </Flex>
        // <ChakraBaseProvider theme={theme}>
        //     <TransactionsToastList successfulToastLifetime={5000} transactionToastClassName="Tx-Toast" />
        //     <NotificationModal />
        //     <SignTransactionsModals className="Sign-Tx-Modal" />

        //     <AuthenticationProvider>
        //         <Routes>
        //             {/* Authentication */}
        //             <Route path={routeNames.unlock} element={<Unlock />} />

        //             {/* Main routing */}
        //             <Route
        //                 path={routeNames.main}
        //                 element={
        //                     <ProtectedRoute>
        //                         <Layout />
        //                     </ProtectedRoute>
        //                 }
        //             >
        //                 <Route path="/" element={<Navigate to={routeNames.quests} replace />} />

        //                 {routes.map((route, index) => (
        //                     <Route path={route.path} key={'route-key-' + index} element={<route.component />}>
        //                         {route.children && (
        //                             <Route
        //                                 path={'/' + route.path}
        //                                 element={<Navigate to={route.defaultChildRoute as string} replace />}
        //                             />
        //                         )}

        //                         {route.children?.map((childRoute, index) => (
        //                             <Route
        //                                 path={childRoute.path}
        //                                 key={'child-route-key-' + index}
        //                                 element={<childRoute.component />}
        //                             />
        //                         ))}
        //                     </Route>
        //                 ))}

        //                 <Route path="*" element={<Navigate to={routeNames.quests} replace />} />
        //             </Route>

        //             <Route path="*" element={<Navigate to={routeNames.main} replace />} />
        //         </Routes>
        //     </AuthenticationProvider>
        // </ChakraBaseProvider>
    );
}

export default App;
