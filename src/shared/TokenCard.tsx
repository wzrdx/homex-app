import { Image, Flex, Text, Box } from '@chakra-ui/react';
import { NFTType } from '../blockchain/types';
import { getSmallLogo } from '../services/assets';
import { LazyLoadImage } from 'react-lazy-load-image-component';

function TokenCard({ isSelected, name, url, type }) {
    const getColor = () => (type === NFTType.Traveler ? 'whitesmoke' : 'redClrs');

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

                <LazyLoadImage src={url} alt="NFT" loading="lazy" effect="opacity" />
            </Box>

            <Text fontSize="15px" fontWeight={500} userSelect="none" color={getColor()}>
                {name}
            </Text>
        </Flex>
    );
}

export default TokenCard;
