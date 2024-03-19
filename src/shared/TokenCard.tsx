import { Image, Flex, Text, Box } from '@chakra-ui/react';
import { NFT, Rarity, MainRarityClass, SFT, ArtRarityClass } from '../blockchain/types';
import { getSmallLogo } from '../services/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getRarityClassInfo, getUnbondingDuration, hasFinishedUnbonding } from '../services/helpers';
import { ELDERS_COLLECTION_ID } from '../blockchain/config';
import { addSeconds } from 'date-fns';
import { Timer } from './Timer';
import { useState } from 'react';

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
    // Used to force a re-render
    const [_mockState, setState] = useState<boolean>();

    const getColor = () => {
        switch (token.tokenId) {
            case ELDERS_COLLECTION_ID:
                return 'redClrs';

            default:
                return 'whitesmoke';
        }
    };

    const getRarityLabel = (rarityClass: MainRarityClass) => {
        let { label, color } = getRarityClassInfo(rarityClass);

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

    const getArtRarityName = (value: number): string => {
        for (const key in ArtRarityClass) {
            if ((ArtRarityClass as any)[key] === value) {
                return key;
            }
        }

        return '';
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
                p="3px"
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
                    <Flex position="absolute" right={0} bottom={0}>
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
                        bg="#2b1d11"
                        borderColor="#593815"
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
