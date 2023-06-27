import { Image, Flex, Text, Box } from '@chakra-ui/react';
import { NFTType, RarityClass } from '../blockchain/types';
import { getSmallLogo } from '../services/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { getRarityClassInfo } from '../services/helpers';

function TokenCard({ isSelected, name, url, type, rarity }) {
    const getColor = () => (type === NFTType.Traveler ? 'whitesmoke' : 'redClrs');

    const getRarityLabel = (rarityClass: RarityClass) => {
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

    return (
        <Flex className="NFT" flexDir="column">
            <Flex position="relative" minWidth="170px" minHeight="170px">
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

                {rarity && (
                    <Flex position="absolute" right={0} bottom={0}>
                        {getRarityLabel(rarity.rarityClass)}
                    </Flex>
                )}

                <LazyLoadImage src={url} alt="NFT" loading="lazy" effect="opacity" />
            </Flex>

            <Text mt={1.5} fontSize="15px" fontWeight={500} userSelect="none" color={getColor()}>
                {name}
            </Text>
        </Flex>
    );
}

export default TokenCard;
