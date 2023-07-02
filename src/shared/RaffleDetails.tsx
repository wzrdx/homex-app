import _ from 'lodash';
import { Flex, Text, Image, Spinner } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useSection } from '../components/Section';
import ParticipantsList from './ParticipantsList';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

function RaffleDetails() {
    const { height } = useSection();
    const navigate = useNavigate();

    let { id } = useParams();
    let query = useQuery();

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isCompleted, setCompleted] = useState<boolean>(false);

    // Init
    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        setCompleted(query.get('completed') === 'true');
        setIsLoading(false);
    };

    return (
        <Flex height={`calc(100% - ${height}px)`} flexDir="column" alignItems="center">
            <Flex justifyContent="center">
                <Flex
                    alignItems="center"
                    px={2}
                    pb={4}
                    transition="all 0.1s ease-in"
                    cursor="pointer"
                    _hover={{ color: '#b8b8b8' }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon fontSize="17px" />
                    <Text ml={1} fontSize="17px">
                        Back
                    </Text>
                </Flex>
            </Flex>

            {isLoading ? <Spinner mt={6} /> : isCompleted ? <ParticipantsList id={id} /> : <ParticipantsList id={id} />}
        </Flex>
    );
}

export default RaffleDetails;
