import {
    Box,
    Flex,
    Image,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    MenuGroup,
    MenuDivider,
    Text,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { routeNames, routes } from '../services/routes';
import { NavLink, useNavigate } from 'react-router-dom';
import { RESOURCE_ELEMENTS, ResourcesContextType, useResourcesContext } from '../services/resources';
import Resource from '../shared/Resource';
import { getSmallLogo } from '../services/assets';
import _ from 'lodash';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { getShortAddress, toTitleCase } from '../services/helpers';
import { useAuthenticationContext, AuthenticationContextType } from '../services/authentication';
import { logout } from '@multiversx/sdk-dapp/utils';

function Header({}) {
    const { resources } = useResourcesContext() as ResourcesContextType;

    const { setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

    const { address } = useGetAccountInfo();
    const navigate = useNavigate();

    // Init
    useEffect(() => {}, []);

    const disconnect = () => {
        setAuthentication(false);

        logout(`/unlock`, (callbackUrl) => {
            navigate(callbackUrl as string);
        });
    };

    return (
        <Flex flexDir="column">
            {/* Main header */}
            <Flex flex={1} px={3} py={4} justifyContent="space-between" position="relative">
                <Box ml="1px">
                    <Resource imageSrc={RESOURCE_ELEMENTS['tickets'].icon} value={resources.tickets} height="46px" />
                </Box>

                <Menu autoSelect={false}>
                    <MenuButton as={IconButton} aria-label="Options" icon={<HamburgerIcon fontSize="38px" />} variant="ghost" />
                    <MenuList>
                        <MenuGroup title="Menu">
                            {routes.map((route, index) => (
                                <NavLink key={index} to={route.path}>
                                    <MenuItem>
                                        <Text>{toTitleCase(route.path)}</Text>
                                    </MenuItem>
                                </NavLink>
                            ))}
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
