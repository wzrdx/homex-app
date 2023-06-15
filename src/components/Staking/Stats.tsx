import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect } from 'react';
import { RESOURCE_ELEMENTS } from '../../services/resources';
import { COLLECTION_SIZE, ELDER_YIELD_PER_HOUR, TRAVELER_YIELD_PER_HOUR } from '../../blockchain/config';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { round } from '../../services/helpers';
import { StatsEntry } from '../../shared/StatsEntry';

function Stats({ stakedNFTsCount, stakedAddressesCount, travelersCount, eldersCount, stakingInfo }) {
    useEffect(() => {}, []);

    const getEnergyPerHour = (): number => {
        if (!stakingInfo) {
            return 0;
        }

        const travelersYield = round(TRAVELER_YIELD_PER_HOUR * stakingInfo?.travelerNonces?.length, 1);
        const eldersYield = round(ELDER_YIELD_PER_HOUR * stakingInfo?.elderNonces?.length, 1);
        return round(travelersYield + eldersYield, 1);
    };

    return (
        <Flex justifyContent="center" height="100%">
            <Flex flexDir="column">
                {/* Local */}
                <Text mb={3} layerStyle="header1">
                    Your NFTs
                </Text>

                <StatsEntry label="Travelers staked" value={travelersCount} />
                <StatsEntry label="Elders staked" value={eldersCount} />
                <StatsEntry label="Staking rewards" color="energyBright" value={stakingInfo.rewards}>
                    <Image width="22px" ml={1.5} src={RESOURCE_ELEMENTS.energy.icon} alt="Energy" />
                </StatsEntry>
                <StatsEntry label="Energy per hour" color="energyBright" value={getEnergyPerHour()} />

                {/* Global */}
                <Text mt={5} mb={3} layerStyle="header1">
                    Global Stats
                </Text>

                <StatsEntry
                    label="Total NFTs staked"
                    value={`${stakedNFTsCount} (${round((100 * stakedNFTsCount) / COLLECTION_SIZE, 1)}%)`}
                />

                <StatsEntry label="Total wallets staked" value={stakedAddressesCount} />
            </Flex>
        </Flex>
    );
}

export default Stats;
