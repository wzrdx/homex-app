import _ from 'lodash';
import { Flex, Spinner, Text, Link, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTx, getTxExplorerURL, getUsername } from '../../services/helpers';
import { API_URL, EGLD_DENOMINATION, ELDERS_COLLECTION_ID, TICKETS_TOKEN_ID } from '../../blockchain/config';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import { getTxHashes } from '../../blockchain/api/getTxHashes';
import { format } from 'date-fns';
import { useRewards } from '../Rewards';
import { Timer } from '../../shared/Timer';
import { getRaffleTimestamp } from '../../blockchain/api/getRaffleTimestamp';
import { getEldersLogo } from '../../services/assets';
import { RESOURCE_ELEMENTS } from '../../services/resources';

const COLUMNS = [
    {
        name: 'No.',
        style: {
            minWidth: '58px',
        },
        align: 'left',
    },
    {
        name: 'Player',
        style: {
            width: '100%',
        },
        align: 'left',
    },
    {
        name: 'Prize',
        style: {
            width: '180px',
            minWidth: '180px',
        },
        align: 'right',
    },
];

function Prizes() {
    const { height } = useRewards();
    const [timestamp, setTimestamp] = useState<Date>();

    const [tx, setTx] = useState<{
        winners: Array<{
            username: string;
            prize: JSX.Element;
        }>;
        timestamp: Date;
        hash: string;
    }>();

    const [hashes, setHashes] = useState<string[]>([]);
    const [isLoadingHashes, setLoadingHashes] = useState<boolean>(true);

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (hashes.length) {
            getTransaction(_.head(hashes) as string);
        }
    }, [hashes]);

    const init = async () => {
        try {
            setTimestamp(await getRaffleTimestamp());

            const hashes = await getTxHashes();
            setHashes(_.reverse(hashes));

            if (hashes.length) {
                await getTransaction(_.head(hashes) as string);
            }

            setLoadingHashes(false);
        } catch (error) {
            console.error(error);
        }
    };

    const getTransaction = async (hash: string) => {
        // Used to trigger the spinner
        setTx(undefined);

        const result = await getTx(hash);

        if (result.data) {
            const operations = _.filter(result.data.operations, (operation) => operation.action === 'transfer');

            const winners = await Promise.all(
                _.map(operations, async (operation) => {
                    const username = await getUsername(operation.receiver);
                    let prize: JSX.Element = <Flex />;

                    if (operation.type === 'egld') {
                        prize = (
                            <Text color="brightBlue" fontWeight={500}>
                                {Number.parseInt(operation.value) / EGLD_DENOMINATION} $EGLD
                            </Text>
                        );
                    }

                    if (operation.type === 'nft' && operation.ticker === ELDERS_COLLECTION_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Image src={getEldersLogo()} height="22px" mr={1.5} alt="Elder" />
                                <Text fontWeight={500} color="redClrs">
                                    {operation.name}
                                </Text>
                            </Flex>
                        );
                    }

                    if (operation.type === 'nft' && operation.ticker === TICKETS_TOKEN_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Text fontWeight={500} color="brightWheat" minWidth="20px">
                                    {operation.value}
                                </Text>
                                <Image height="28px" src={RESOURCE_ELEMENTS['tickets'].icon} />
                            </Flex>
                        );
                    }

                    return {
                        username,
                        prize,
                    };
                })
            );

            const timestamp = new Date(result.data.timestamp * 1000);

            setTx({
                winners,
                timestamp,
                hash,
            });
        }
    };

    return (
        <Flex height={_.isEmpty(hashes) ? 'auto' : `calc(100% - ${height}px)`} justifyContent="center">
            {isLoadingHashes ? (
                <Spinner />
            ) : _.isEmpty(hashes) ? (
                <Flex flexDir="column" alignItems="Center">
                    <Text mb={3}>Prizes distribution will be displayed here after the raffle ends</Text>

                    <Flex minWidth="158px">
                        <Timer timestamp={timestamp as Date} isActive isDescending displayDays />
                    </Flex>
                </Flex>
            ) : (
                <Flex minW="600px">
                    {/* Left */}
                    <Flex flex={1} flexDir="column" overflowY="auto" pl={6}>
                        {_.map(hashes, (hash, index) => (
                            <Text
                                key={index}
                                color={tx?.hash === hash ? 'white' : 'header.gray'}
                                _notLast={{ mb: 2 }}
                                cursor="pointer"
                                transition="all 0.4s cubic-bezier(0.215, 0.610, 0.355, 1)"
                                _hover={{ color: '#e3e3e3' }}
                                onClick={() => getTransaction(hash)}
                            >
                                Trial #{index + 1}
                            </Text>
                        ))}
                    </Flex>

                    {/* Right */}
                    <Flex flex={4} flexDir="column" overflowY="auto" pr={6}>
                        {!tx ? (
                            <Flex justifyContent="center">
                                <Spinner />
                            </Flex>
                        ) : (
                            <>
                                <Flex alignItems="center" justifyContent="space-between">
                                    <Flex alignItems="center" mb={2}>
                                        <CalendarIcon mr={2} fontSize="14px" color="whiteAlpha.900" />
                                        <Text>{format(tx.timestamp, 'PPPP')}</Text>
                                    </Flex>

                                    <Link href={getTxExplorerURL(tx.hash)} isExternal>
                                        <Flex alignItems="center">
                                            <Text>{getShortAddress(tx.hash)}</Text>
                                            <ExternalLinkIcon ml={1.5} />
                                        </Flex>
                                    </Link>
                                </Flex>

                                {/* Header */}
                                <Flex mb={1} mt={6}>
                                    {_.map(COLUMNS, (column: any, index: number) => (
                                        <Text
                                            key={index}
                                            style={column.style}
                                            textAlign={column.align}
                                            fontWeight={600}
                                            fontSize="17px"
                                        >
                                            {column.name}
                                        </Text>
                                    ))}
                                </Flex>

                                <Flex width="100%" flexDir="column">
                                    {_.map(tx.winners, (winner, index) => (
                                        <Flex key={index} width="100%" alignItems="center" height="28px" mt={2}>
                                            <Text style={COLUMNS[0].style}>{index + 1}</Text>

                                            <Text pr={6} layerStyle="ellipsis" style={COLUMNS[1].style}>
                                                {winner.username}
                                            </Text>

                                            <Flex justifyContent="flex-end" style={COLUMNS[2].style}>
                                                {winner.prize}
                                            </Flex>
                                        </Flex>
                                    ))}
                                </Flex>
                            </>
                        )}
                    </Flex>
                </Flex>
            )}
        </Flex>
    );
}

export default Prizes;
