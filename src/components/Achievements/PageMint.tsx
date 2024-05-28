import { Box, Button, Center, Flex, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { BsGem } from 'react-icons/bs';
import { isPageMinted } from '../../blockchain/auxiliary/api/isPageMinted';
import { PAGE_HEADERS } from '../../services/achievements';
import { getAOMLogo } from '../../services/assets';
import { Transaction, TransactionType, TransactionsContextType, useTransactionsContext } from '../../services/transactions';
import { Interactor } from './Interactor';

export const PageMint = ({ index, page, goBack }) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [isMinted, setPageMinted] = useState<boolean>();

    const { pendingTxs } = useTransactionsContext() as TransactionsContextType;
    const { hasSuccessfulTransactions, successfulTransactionsArray } = useGetSuccessfulTransactions();

    // Init
    useEffect(() => {
        getState();
    }, []);

    const getState = async () => {
        console.log(index);
        setLoading(true);
        setPageMinted(await isPageMinted(index));
        setLoading(false);
    };

    // Successful minting txs
    useEffect(() => {
        if (hasSuccessfulTransactions) {
            const successfulSessionIds: string[] = _.intersection(
                _.map(pendingTxs, (tx) => tx.sessionId),
                _.map(successfulTransactionsArray, (array) => array[0])
            );

            const successfulMintingTxs = _.filter(
                pendingTxs,
                (tx: Transaction) => _.includes(successfulSessionIds, tx.sessionId) && tx.type === TransactionType.MintPage
            );

            if (!_.isEmpty(successfulMintingTxs)) {
                getState();
            }
        }
    }, [pendingTxs, hasSuccessfulTransactions]);

    return (
        <Center height="100%" position="relative">
            <Flex position="absolute" top={0} left={0} py={1.5} alignItems="flex-start">
                <Button colorScheme="blue" onClick={goBack}>
                    Go back
                </Button>
            </Flex>

            {isLoading ? (
                <Spinner />
            ) : (
                <Stack spacing={5} height="100%" py={12} alignItems="center" justifyContent="center">
                    <Stack spacing={2} alignItems="center" mb="-1px">
                        <Text layerStyle="header1Alt" lineHeight="16px">
                            {PAGE_HEADERS[index].title}
                        </Text>

                        <Stack direction="row" alignItems="center">
                            <Box color={`blizzard${page.rarity}`} pt="2px">
                                <BsGem fontSize="21px" />
                            </Box>

                            <Text as="span" color={`blizzard${page.rarity}`} fontWeight={500}>
                                {page.rarity}
                            </Text>
                        </Stack>
                    </Stack>

                    <Box position="relative" height="80%">
                        {!!isMinted && (
                            <Center
                                position="absolute"
                                top={0}
                                right={0}
                                bottom={0}
                                left={0}
                                backgroundColor="#00ff206e"
                                zIndex={2}
                            >
                                <Image src={getAOMLogo()} maxW="50%" filter="grayscale(1) brightness(2.5)" alt="AoM" />
                            </Center>
                        )}

                        <Image
                            height="100%"
                            src={PAGE_HEADERS[index].image}
                            outline="2px solid"
                            outlineColor={`blizzard${page.rarity}`}
                            outlineOffset="4px"
                            minW="278px"
                            minH="392px"
                            alt="Page"
                        />
                    </Box>

                    {!isMinted && <Interactor index={index} />}
                </Stack>
            )}
        </Center>
    );
};
