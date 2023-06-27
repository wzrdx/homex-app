import { Box, Text, Flex } from '@chakra-ui/react';
import { NFT, RarityClass } from '../blockchain/types';
import { Rarity } from '../blockchain/api/getRarityClasses';
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
            let { label: elderLabel, color: elderColor, energyYield: elderYield } = getRarityClassInfo(RarityClass.Elder);

            const elderEntry = {
                count: _.size(elders),
                yield: elderYield,
                color: elderColor,
                label: elderLabel,
            };

            setOtherEntries([elderEntry]);
        }
    }, [travelers, elders, rarities]);

    return (
        <Flex flexDir="column">
            <Text
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
        </Flex>
    );
}

export default Yield;
