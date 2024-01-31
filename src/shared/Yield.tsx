import { Box, Text, Flex, Alert, AlertIcon } from '@chakra-ui/react';
import { NFT, RarityClass } from '../blockchain/types';
import { Rarity } from '../blockchain/game/api/getRarityClasses';
import { useEffect, useState } from 'react';
import { getRarityClassInfo } from '../services/helpers';
import _ from 'lodash';

interface YieldEntry {
    count: number;
    yield: number;
    color: string;
    label: string;
}

function Yield({ travelers, elders, rarities }: { travelers: NFT[]; elders: NFT[]; rarities?: Rarity[] }) {
    const [travelerEntries, setTravelerEntries] = useState<Array<YieldEntry>>();
    const [otherEntries, setOtherEntries] = useState<Array<YieldEntry>>();

    useEffect(() => {
        if (!_.isEmpty(rarities)) {
            // Travelers
            const rarityClassesCount = _(travelers)
                .map((traveler) => _.find(rarities, (rarity) => traveler.nonce === rarity.nonce))
                .countBy('rarityClass')
                .value();

            const travelerEntries: Array<YieldEntry> = [];

            for (let [rarityClass, count] of Object.entries(rarityClassesCount)) {
                let { label, color, energyYield } = getRarityClassInfo(Number.parseInt(rarityClass));
                travelerEntries.push({
                    count,
                    yield: energyYield,
                    color,
                    label,
                });
            }

            setTravelerEntries(travelerEntries);

            // Elders
            let others: Array<YieldEntry> = [];

            if (!_.isEmpty(elders)) {
                let { label: elderLabel, color: elderColor, energyYield: elderYield } = getRarityClassInfo(RarityClass.Elder);

                const elderEntry = {
                    count: _.size(elders),
                    yield: elderYield,
                    color: elderColor,
                    label: elderLabel,
                };

                others = [elderEntry];
            }

            setOtherEntries(others);
        }
    }, [travelers, elders, rarities]);

    const getTotal = (): number => {
        if (!travelerEntries || !otherEntries) {
            return 0;
        }

        const energyYield = _([...travelerEntries, ...otherEntries])
            .map((entry) => entry.count * entry.yield)
            .sum();

        return energyYield;
    };

    const getLegend = (): JSX.Element => {
        const array = Array.from({ length: 5 }, (_, i) => i + 1);

        return (
            <Flex flexDir="column" width="50%" backgroundColor="#b3daf50d" borderRadius="2px" px={3} py={1.5}>
                {_.map(array, (item, index) => {
                    let { label, color, energyYield } = getRarityClassInfo(item);

                    return (
                        <Flex key={index} justifyContent="space-between">
                            <Text color={color} minW="106px">
                                {label}
                            </Text>
                            <Text color="energyBright">{energyYield}</Text>
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
                Travelers
            </Text>

            {_.map(travelerEntries, (entry, index) => (
                <Flex key={index} alignItems="center" _notLast={{ marginBottom: 1 }}>
                    <Text fontSize="17px">
                        <Text as="span" fontWeight={500}>
                            {entry.count * entry.yield}{' '}
                        </Text>
                        from
                        <Text as="span" color={entry.color}>
                            {' '}
                            {`${entry.label}s`}
                        </Text>
                    </Text>

                    <Text ml={1.5}>
                        ({entry.count} NFT{entry.count > 1 ? 's' : ''} x{' '}
                        <Text as="span" color="energyBright">
                            {entry.yield} Energy
                        </Text>
                        )
                    </Text>
                </Flex>
            ))}

            {!_.isEmpty(otherEntries) && (
                <>
                    <Text
                        mt={3}
                        mb={1.5}
                        color="brightWheat"
                        textTransform="uppercase"
                        fontWeight={600}
                        fontSize="18px"
                        letterSpacing="0.75px"
                    >
                        Elders
                    </Text>

                    {_.map(otherEntries, (entry, index) => (
                        <Flex key={index} alignItems="center" _notLast={{ marginBottom: 1 }}>
                            <Text fontSize="17px">
                                <Text as="span" fontWeight={500}>
                                    {entry.count * entry.yield}{' '}
                                </Text>
                                from
                                <Text as="span" color={entry.color}>
                                    {' '}
                                    {`${entry.label}s`}
                                </Text>
                            </Text>

                            <Text ml={1.5}>
                                ({entry.count} NFT{entry.count > 1 ? 's' : ''} x{' '}
                                <Text as="span" color="energyBright">
                                    {entry.yield} Energy
                                </Text>
                                )
                            </Text>
                        </Flex>
                    ))}
                </>
            )}

            <Text
                mt={5}
                mb={1.5}
                color="brightWheat"
                textTransform="uppercase"
                fontWeight={600}
                fontSize="18px"
                letterSpacing="0.75px"
            >
                Total Energy per hour
            </Text>

            <Text fontSize="17px" fontWeight={500}>
                {getTotal()}
            </Text>
        </Flex>
    );
}

export default Yield;
