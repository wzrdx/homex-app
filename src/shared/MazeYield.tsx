import { Text, Flex } from '@chakra-ui/react';
import { SFT } from '../blockchain/types';
import { useEffect, useState } from 'react';
import { getArtRarityName, getPageYield } from '../services/helpers';
import _ from 'lodash';

interface YieldEntry {
    count: number;
    yield: number;
    color: string;
    label: string;
}

function MazeYield({ stakedArtTokens }: { stakedArtTokens: SFT[] }) {
    const [entries, setEntries] = useState<Array<YieldEntry>>();

    useEffect(() => {
        const countObj = _.chain(stakedArtTokens)
            .groupBy('artRarityClass' as keyof SFT) // Explicitly defining the type of groupBy
            .mapValues((nfts: SFT[]) => _.sumBy(nfts, 'balance'))
            .value();

        const array: Array<YieldEntry> = [];

        for (let [key, count] of Object.entries(countObj)) {
            const artRarityClass = Number.parseInt(key);
            const pageYield = getPageYield(artRarityClass);
            const label = getArtRarityName(artRarityClass);

            array.push({
                count,
                yield: pageYield,
                color: `blizzard${label}`,
                label,
            });
        }

        setEntries(array);
    }, [stakedArtTokens]);

    const getTotal = (): number => {
        if (!entries || _.isEmpty(entries)) {
            return 0;
        }

        const amount = _(entries)
            .map((entry) => entry.count * entry.yield)
            .sum();

        return amount;
    };

    const getLegend = (): JSX.Element => {
        const array = Array.from({ length: 5 }, (_, i) => i + 1);

        return (
            <Flex flexDir="column" width="50%" backgroundColor="#b3daf50d" borderRadius="2px" px={3} py={1.5}>
                {_.map(array, (artRarityClass, index) => {
                    const pageYield = getPageYield(artRarityClass);
                    const label = getArtRarityName(artRarityClass);

                    return (
                        <Flex key={index} justifyContent="space-between">
                            <Text color={`blizzard${label}`} minW="106px">
                                {label}
                            </Text>
                            <Text>{pageYield / 10}</Text>
                        </Flex>
                    );
                })}
            </Flex>
        );
    };

    return (
        <Flex flexDir="column">
            {getLegend()}

            <Text
                mt={5}
                mb={1.5}
                color="brightWheat"
                textTransform="uppercase"
                fontWeight={600}
                fontSize="18px"
                letterSpacing="0.75px"
            >
                Tokens
            </Text>

            {_.map(entries, (entry, index) => (
                <Flex key={index} alignItems="center" _notLast={{ marginBottom: 1 }}>
                    <Text fontSize="17px">
                        <Text as="span" fontWeight={500}>
                            {(entry.count * entry.yield) / 10}{' '}
                        </Text>
                        from{' '}
                        <Text as="span" color={entry.color}>
                            {entry.label == 'Legendary' ? 'Legendaries' : `${entry.label}s`}
                        </Text>
                    </Text>

                    <Text ml={1.5}>
                        ({entry.count} Token{entry.count > 1 ? 's' : ''} x{' '}
                        <Text as="span" color="mirage">
                            {entry.yield / 10} Maze
                        </Text>
                        )
                    </Text>
                </Flex>
            ))}

            <Text
                mt={5}
                mb={1.5}
                color="brightWheat"
                textTransform="uppercase"
                fontWeight={600}
                fontSize="18px"
                letterSpacing="0.75px"
            >
                Total Maze per day
            </Text>

            <Text fontSize="17px" fontWeight={500} color="mirage">
                {getTotal() / 10}
            </Text>
        </Flex>
    );
}

export default MazeYield;
