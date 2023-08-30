import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Text,
    Image,
    useDisclosure,
    Link,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuGroup,
    MenuDivider,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { routeNames, routes as serviceRoutes } from '../services/routes';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSoundsContext, SoundsContextType } from '../services/sounds';
import { findIndex } from 'lodash';
import { BsExclamation, BsTwitter, BsGlobe, BsDiscord } from 'react-icons/bs';
import { AiOutlineSetting } from 'react-icons/ai';
import { IoVolumeHighOutline, IoVolumeMuteOutline, IoDocumentTextOutline } from 'react-icons/io5';
import { TbMusic, TbMusicOff, TbBook } from 'react-icons/tb';
import Wallet from '../shared/Wallet';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import Resource from '../shared/Resource';
import Gameplay from './Gameplay';
import { getSmallLogo } from '../services/assets';
import _ from 'lodash';
import Separator from '../shared/Separator';
import Settings from './Settings';
import SponsorLogo from '../assets/images/dw_logo.svg';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getShortAddress } from '../services/helpers';
import { useAuthenticationContext, AuthenticationContextType } from '../services/authentication';
import { logout } from '@multiversx/sdk-dapp/utils';

function Header({}) {
    const { resources } = useResourcesContext() as ResourcesContextType;

    const location = useLocation();
    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    const [routes, setRoutes] = useState<Array<string>>([]);

    // Init
    useEffect(() => {
        setRoutes(
            _(serviceRoutes)
                .filter((route) => route.isMainRoute)
                .map((route) => route.path)
                .value()
        );
    }, []);

    const disconnect = () => {
        setAuthentication(false);

        logout(`/unlock`, (callbackUrl) => {
            navigate(callbackUrl as string);
        });
    };

    return (
        <Flex flexDir="column">
            {/* Main header */}
            <Flex flex={1} px={3} py={4} justifyContent="space-between" position="relative" background="#00000036">
                <Box ml="1px">
                    <Resource imageSrc={RESOURCE_ELEMENTS['tickets'].icon} value={resources.tickets} height="46px" />
                </Box>

                <Menu>
                    <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon fontSize="38px" />} variant="ghost" />
                    <MenuList>
                        <MenuGroup title="Menu">
                            <MenuItem>
                                <NavLink to={routeNames.staking}>Staking</NavLink>
                            </MenuItem>
                            <MenuItem>
                                <NavLink to={routeNames.quests}>Quests</NavLink>
                            </MenuItem>
                        </MenuGroup>

                        <MenuDivider />

                        <MenuGroup title={getShortAddress(address)}>
                            <MenuItem onClick={disconnect}>Disconnect</MenuItem>
                        </MenuGroup>
                    </MenuList>
                </Menu>

                <Flex
                    pointerEvents="none"
                    justifyContent="center"
                    alignItems="center"
                    position="absolute"
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    zIndex={5}
                >
                    <Image width="60px" opacity={0.9} src={getSmallLogo()} />
                </Flex>
            </Flex>

            {/* Secondary header */}
            <Flex mt={1} flexDir="column" position="relative">
                <Flex justifyContent="space-between" width="100%">
                    {Object.keys(RESOURCE_ELEMENTS)
                        .slice(0, 3)
                        .map((element: string, index: number) => (
                            <Box key={index} mx={3.5}>
                                <Resource imageSrc={RESOURCE_ELEMENTS[element].icon} value={resources[element]} />
                            </Box>
                        ))}
                </Flex>

                <Flex mx={3.5} mt={2}>
                    <Resource imageSrc={RESOURCE_ELEMENTS.essence.icon} value={resources.essence} />
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Header;
