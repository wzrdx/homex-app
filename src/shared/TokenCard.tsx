import { Box, Flex, Image, Text, useTheme } from '@chakra-ui/react';
import { addSeconds } from 'date-fns';
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { config } from '../blockchain/config';
import { MainRarityClass, NFT, Rarity, SFT } from '../blockchain/types';
import { getSmallLogo } from '../services/assets';
import { getArtRarityName, getMainRarityClassInfo, getUnbondingDuration, hasFinishedUnbonding } from '../services/helpers';
import { Timer } from './Timer';

export enum TokenType {
    NFT = 'NFT',
    SFT = 'SFT',
}

function TokenCard({
    isSelected,
    token,
    rarity,
    tokenType = TokenType.NFT,
}: {
    isSelected: boolean;
    token: NFT | SFT;
    rarity?: Rarity | false;
    tokenType?: TokenType;
}) {
    const theme = useTheme();

    // Used to force a re-render
    const [_mockState, setState] = useState<boolean>();

    const getColor = () => {
        switch (token.tokenId) {
            case config.eldersCollectionId:
                return 'redClrs';

            default:
                return 'whitesmoke';
        }
    };

    const getRarityLabel = (rarityClass: MainRarityClass) => {
        let { label, color } = getMainRarityClassInfo(rarityClass);

        return (
            <Flex
                alignItems="center"
                background="linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.65) 50%)"
                pr={1.5}
                pl={6}
                py="2px"
            >
                <Box backgroundColor={color} width="9px" height="9px" borderRadius="50%"></Box>
                <Text
                    ml={1}
                    color="whitesmoke"
                    fontSize="12.5px"
                    letterSpacing="0.25px"
                    fontWeight={500}
                    textTransform="uppercase"
                >
                    {label}
                </Text>
            </Flex>
        );
    };

    return (
        <Flex className="NFT" flexDir="column">
            <Flex
                position="relative"
                minWidth="170px"
                minHeight="170px"
                borderColor={
                    tokenType === TokenType.SFT ? `blizzard${getArtRarityName((token as SFT).artRarityClass)}` : 'transparent'
                }
                borderWidth={tokenType === TokenType.SFT ? '1px' : '0px'}
                borderStyle="solid"
                p="4px"
            >
                {isSelected && (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="absolute"
                        top={0}
                        right={0}
                        bottom={0}
                        left={0}
                        backgroundColor="#0000008f"
                        p={6}
                        zIndex={2}
                    >
                        <Image className="Selected-NFT" src={getSmallLogo()} alt="Logo" userSelect="none" />
                    </Flex>
                )}

                {!isSelected && (
                    <Flex
                        className="NFT-Overlay"
                        justifyContent="center"
                        alignItems="center"
                        position="absolute"
                        top={0}
                        right={0}
                        bottom={0}
                        left={0}
                    ></Flex>
                )}

                {tokenType === TokenType.NFT && (token as NFT).timestamp && !hasFinishedUnbonding(token) && (
                    <Flex
                        justifyContent="center"
                        alignItems="center"
                        position="absolute"
                        top={0}
                        right={0}
                        bottom={0}
                        left={0}
                        backgroundColor="#0000008f"
                        p={1}
                    >
                        <Timer
                            timestamp={addSeconds((token as NFT).timestamp as Date, getUnbondingDuration())}
                            callback={() => setState(true)}
                            displayClock={false}
                            customStyle={{ fontSize: '21px', fontWeight: 500, userSelect: 'none' }}
                            isActive
                            isDescending
                            displayDays
                        />
                    </Flex>
                )}

                {rarity && (
                    <Flex position="absolute" right="4px" bottom="4px">
                        {getRarityLabel(rarity.rarityClass)}
                    </Flex>
                )}

                <LazyLoadImage className="Lazy-Loaded-Token" src={token.url} alt="NFT" loading="lazy" effect="opacity" />
            </Flex>

            <Flex mt={1.5} alignItems="center" justifyContent="space-between">
                <Text fontSize="15px" fontWeight={500} userSelect="none" color={getColor()}>
                    {token.name}
                </Text>

                {tokenType === TokenType.SFT && (
                    <Text
                        color={`blizzard${getArtRarityName((token as SFT).artRarityClass)}`}
                        bg={theme.colors[`blizzard${getArtRarityName((token as SFT).artRarityClass)}`] + '30'}
                        borderColor={`blizzard${getArtRarityName((token as SFT).artRarityClass)}`}
                        borderWidth="1px"
                        borderStyle="solid"
                        fontSize="15px"
                        padding="1px 8px"
                        lineHeight="20px"
                        borderRadius="2px"
                    >
                        {(token as SFT).balance}
                    </Text>
                )}
            </Flex>
        </Flex>
    );
}

export default TokenCard;
