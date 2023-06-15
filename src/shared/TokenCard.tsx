import { Image, Flex, Text } from '@chakra-ui/react';

function TokenCard({ name, nonce, url }) {
    const getColor = () =>
        url.includes('bafybeid5o2igawcrql62b6ecdrsxzf6gullytuzyxl3qvd6pryhmx4pajq') ? 'whitesmoke' : 'redClrs';

    return (
        <Flex flexDir="column">
            <Image mb={1} src={url} alt="NFT" borderRadius="1px" userSelect="none" />

            <Text fontSize="15px" fontWeight={500} userSelect="none" color={getColor()}>
                {name}
            </Text>
        </Flex>
    );
}

export default TokenCard;
