import _ from 'lodash';
import { Flex, Spinner, Text, Link, Image, Alert, AlertIcon, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getShortAddress, getTx, getTxExplorerURL, getUsername } from '../../services/helpers';
import {
    EGLD_DENOMINATION,
    ELDERS_COLLECTION_ID,
    ESSENCE_TOKEN_ID,
    TICKETS_TOKEN_ID,
    TOKEN_DENOMINATION,
    TRAVELERS_COLLECTION_ID,
} from '../../blockchain/config';
import { ExternalLinkIcon, CalendarIcon } from '@chakra-ui/icons';
import { format } from 'date-fns';
import { getEldersLogo, getSmallLogo } from '../../services/assets';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { useSection } from '../Section';
import { getRaffleHashes } from '../../blockchain/api/getRaffleHashes';

interface Winner {
    username: string;
    address: string;
    prizes: Array<JSX.Element>;
}

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
            width: '230px',
            minWidth: '230px',
        },
        align: 'right',
    },
];

function Prizes() {
    const { height } = useSection();

    const [winners, setWinners] = useState<Array<Winner>>();

    const [txs, setTxs] = useState<
        Array<{
            timestamp: Date;
            hash: string;
        }>
    >();
    const [isLoadingHashes, setLoadingHashes] = useState<boolean>(true);

    const { address: userAddress } = useGetAccountInfo();

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            bundleHashes(await getRaffleHashes(1));
        } catch (error) {
            console.error(error);
        }
    };

    const bundleHashes = async (hashes: string[]) => {
        const result = await Promise.all(_.map(hashes, (hash) => getTransaction(hash)));

        const parsedWinners = _(result)
            .map((hashResult) => hashResult?.winners)
            .flatten()
            .value();

        const winners = _.map(Array.from(new Set(_.map(parsedWinners, (winner) => winner?.username))), (username) => {
            const entries = _.filter(parsedWinners, (winner) => winner?.username === username);

            return {
                username,
                address: entries[0]?.address,
                prizes: _.map(entries, (entry) => entry?.prize),
            };
        });

        setWinners(winners as Winner[]);

        setTxs(
            _(result)
                .map((hashResult) => ({
                    hash: hashResult?.hash,
                    timestamp: hashResult?.timestamp,
                }))
                .flatten()
                .value() as Array<{
                timestamp: Date;
                hash: string;
            }>
        );

        setLoadingHashes(false);
    };

    const getTransaction = async (hash: string) => {
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

                    if (operation.type === 'nft' && operation.collection === TRAVELERS_COLLECTION_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Image src={getSmallLogo()} height="22px" mr={1.5} alt="NFT" />
                                <Text fontWeight={500} color="primary">
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
                                <Image height="28px" src={RESOURCE_ELEMENTS.tickets.icon} />
                            </Flex>
                        );
                    }

                    if (operation.type === 'esdt' && operation.identifier === ESSENCE_TOKEN_ID) {
                        prize = (
                            <Flex alignItems="center">
                                <Text mr={1.5} fontWeight={500} color={RESOURCE_ELEMENTS.essence.color} minWidth="20px">
                                    {operation.value / TOKEN_DENOMINATION}
                                </Text>
                                <Image height="24px" src={RESOURCE_ELEMENTS.essence.icon} />
                            </Flex>
                        );
                    }

                    return {
                        username,
                        prize,
                        address: operation.receiver,
                    };
                })
            );

            const timestamp = new Date(result.data.timestamp * 1000);

            return {
                winners,
                timestamp,
                hash,
            };
        }
    };

    const isWinner = (address: string = userAddress) => {
        return _.findIndex(winners, (winner) => winner.address === address) > -1;
    };

    return (
        <Flex height={_.isEmpty(txs) ? 'auto' : `calc(100% - ${height}px)`} justifyContent="center">
            {isLoadingHashes ? (
                <Spinner />
            ) : _.isEmpty(txs) ? (
                <Text>No prizes to display</Text>
            ) : (
                <Flex minW="690px">
                    {/* Left */}
                    <Flex flex={1} flexDir="column" overflowY="auto" pl={6}>
                        <Text>Trial #2</Text>
                    </Flex>

                    {/* Right */}
                    <Flex flex={4} flexDir="column" overflowY="auto" pr={6}>
                        {!winners ? (
                            <Flex justifyContent="center">
                                <Spinner />
                            </Flex>
                        ) : (
                            <>
                                <Flex alignItems="center" mb={2}>
                                    <CalendarIcon mr={2} fontSize="14px" color="whiteAlpha.900" />
                                    <Text>{format(_.head(txs)?.timestamp as Date, 'PPPP')}</Text>
                                </Flex>

                                <Text mb={1} fontWeight={600} fontSize="17px">
                                    Hashes
                                </Text>

                                <Box display="grid" gridAutoColumns="1fr" gridTemplateColumns="1fr 1fr 1fr" rowGap={1}>
                                    {_.map(txs, (tx, index) => (
                                        <Flex key={index} alignItems="center" justifyContent="space-between">
                                            <Link href={getTxExplorerURL(tx?.hash as string)} isExternal>
                                                <Flex alignItems="center">
                                                    <Text>{getShortAddress(tx?.hash as string)}</Text>
                                                    <ExternalLinkIcon ml={1.5} />
                                                </Flex>
                                            </Link>
                                        </Flex>
                                    ))}
                                </Box>

                                {isWinner() && (
                                    <Flex mt={4} backgroundColor="#000000e3">
                                        <Alert status="success">
                                            <AlertIcon />
                                            <Flex ml={1} flexDir="column">
                                                <Text>Congratulations!</Text>
                                                <Text>You are one of the winners of this trial</Text>
                                            </Flex>
                                        </Alert>
                                    </Flex>
                                )}

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
                                    {_.map(winners, (winner, index) => (
                                        <Flex key={index} width="100%" alignItems="center" height="28px" mt={2}>
                                            <Text style={COLUMNS[0].style}>{index + 1}</Text>

                                            <Text
                                                pr={6}
                                                layerStyle="ellipsis"
                                                style={COLUMNS[1].style}
                                                color={winner.address === userAddress ? 'redClrs' : '#F5F5F5'}
                                            >
                                                {winner.username}
                                            </Text>

                                            <Flex justifyContent="flex-end" style={COLUMNS[2].style}>
                                                {_.map(winner.prizes, (prize, prizeIndex) => (
                                                    <Box ml={3} key={prizeIndex}>
                                                        {prize}
                                                    </Box>
                                                ))}
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
