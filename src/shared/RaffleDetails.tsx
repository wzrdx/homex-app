import _ from 'lodash';
import { Box, Flex, Text, Image } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { AiOutlineEye, AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { TICKETS_TOKEN_ID, CHAIN_ID } from '../blockchain/config';
import { smartContract } from '../blockchain/smartContract';
import { useResourcesContext, ResourcesContextType, RESOURCE_ELEMENTS } from '../services/resources';
import { useTransactionsContext, TransactionsContextType, TransactionType, TxResolution } from '../services/transactions';
import { ActionButton } from './ActionButton/ActionButton';
import { getFullTicket, getLogoBox, getMvxLogo, getSmallLogo } from '../services/assets';
import { Timer } from './Timer';
import { getRaffleTimestamp } from '../blockchain/api/getRaffleTimestamp';
import { isAfter } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

function RaffleDetails() {
    const navigate = useNavigate();

    let { id } = useParams();

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {};

    return (
        <Flex flexDir="column">
            <Flex justifyContent="center">
                <Flex
                    alignItems="center"
                    px={2}
                    transition="all 0.1s ease-in"
                    cursor="pointer"
                    _hover={{ color: '#b8b8b8' }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon />
                    <Text ml={1.5}>Back</Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default RaffleDetails;
