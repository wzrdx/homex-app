import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Logo from '../assets/logo_small_white.png';
import { Role } from '../blockchain/types';

export const RoleTag = ({ role }) => {
    const getContent = () => {
        switch (role) {
            case Role.OGTravelers:
                return (
                    <Flex alignItems="center">
                        <Box borderRadius="50%" width="13px" height="13px" backgroundColor="#F2A6F2"></Box>
                        <Image
                            ml={1.5}
                            width="19px"
                            filter="brightness(0) invert(91%) sepia(90%) saturate(1174%) hue-rotate(227deg) brightness(98%) contrast(93%)"
                            src={Logo}
                        />
                        <Text ml={1.5} color="#dbdfe5" fontSize="15px" fontWeight={500}>
                            OG Travelers
                        </Text>
                    </Flex>
                );

            case Role.FirstTravelers:
                return (
                    <Flex alignItems="center">
                        <Box borderRadius="50%" width="13px" height="13px" backgroundColor="#20FFFF"></Box>
                        <Image
                            ml={1.5}
                            width="19px"
                            filter="brightness(0) invert(82%) sepia(95%) saturate(1896%) hue-rotate(127deg) brightness(104%) contrast(106%)"
                            src={Logo}
                        />
                        <Text ml={1.5} color="#dbdfe5" fontSize="15px" fontWeight={500}>
                            The First Travelers
                        </Text>
                    </Flex>
                );

            case Role.Elders:
                return (
                    <Flex alignItems="center">
                        <Box borderRadius="50%" width="13px" height="13px" backgroundColor="#F70008"></Box>
                        <Image
                            ml={1.5}
                            width="19px"
                            filter="brightness(0) invert(21%) sepia(51%) saturate(6303%) hue-rotate(344deg) brightness(84%) contrast(140%)"
                            src={Logo}
                        />
                        <Text ml={1.5} color="#dbdfe5" fontSize="15px" fontWeight={500}>
                            The Elders
                        </Text>
                    </Flex>
                );

            default:
                console.error('[RoleTag] Unknown role');
                return <Box></Box>;
        }
    };

    return (
        <Flex
            alignItems="center"
            justifyContent="center"
            padding="1px 9px"
            backgroundColor="#1A1B1E"
            borderRadius="3px"
        >
            {getContent()}
        </Flex>
    );
};
