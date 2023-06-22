import { Image, Flex, Text, Box } from '@chakra-ui/react';
import { NFTType, RarityClass } from '../blockchain/types';
import { getSmallLogo } from '../services/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function TokenCard({ isSelected, name, url, type, rarity }) {
    const getColor = () => (type === NFTType.Traveler ? 'whitesmoke' : 'redClrs');

    const getRarityLabel = (rarityClass: RarityClass) => {
        let label: string;
        let color: string;

        switch (rarityClass) {
            case RarityClass.Common:
                label = 'Common';
                color = 'gray';
                break;

            case RarityClass.Uncommon:
                label = 'Uncommon';
                color = 'white';
                break;

            case RarityClass.Rare:
                label = 'Rare';
                color = 'dodgerblue';
                break;

            case RarityClass.Royal:
                label = 'Royal';
                color = '#fe3bff';
                break;

            case RarityClass.OneOfOne:
                label = '1/1';
                color = 'orange';
                break;
        }

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
                    fontSize="13px"
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
            <Box position="relative" minWidth="170px" minHeight="170px">
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
                    <Flex position="absolute" right={0} bottom={0} mb="7px">
                        {getRarityLabel(rarity.rarityClass)}
                    </Flex>
                )}

                <LazyLoadImage src={url} alt="NFT" loading="lazy" effect="opacity" />
            </Box>

            <Text fontWeight={500} userSelect="none" color={getColor()}>
                {name}
            </Text>
        </Flex>
    );
}

export default TokenCard;
