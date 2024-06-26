import { Flex, Image, Text } from '@chakra-ui/react';
import InnerRing from '../assets/resources/images/ring_inner.png';
import OuterRing from '../assets/resources/images/ring_outer.png';
import { useQuestsContext, QuestsContextType } from '../services/quests';

function Reward({ image, name, value, icon }) {
    const { isDoubleXpActive } = useQuestsContext() as QuestsContextType;

    return (
        <Flex alignItems="center">
            <Flex justifyContent="center" alignItems="center" position="relative">
                <Image
                    zIndex={1}
                    src={image}
                    alt="Reward"
                    borderRadius="50%"
                    width="90px"
                    height="90px"
                    boxShadow="0 0 6px 3px #0000008c"
                    backgroundColor="black"
                />

                <Flex zIndex={2} layerStyle="absoluteCentered" animation="rotationReverse 3s infinite linear">
                    <Image src={InnerRing} alt="InnerRing" />
                </Flex>

                <Flex zIndex={3} layerStyle="absoluteCentered" animation="rotation 14s infinite linear">
                    <Image src={OuterRing} alt="OuterRing" />
                </Flex>
            </Flex>

            <Flex flexDir="column" ml={3}>
                <Text mb={1} fontSize="18px">
                    {name}
                </Text>

                <Flex alignItems="center">
                    <Text fontSize="18px" mr={1.5}>
                        <Text as="span" mr={0.5}>
                            +
                        </Text>
                        <Text as="span" fontWeight={600}>
                            {(name === 'Experience' && isDoubleXpActive() ? 2 : 1) * value}
                        </Text>
                    </Text>

                    {!icon ? (
                        <Text as="span" fontWeight={800} fontSize="18px">
                            XP
                        </Text>
                    ) : (
                        <Image width="28px" src={icon} alt="Icon" />
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Reward;
