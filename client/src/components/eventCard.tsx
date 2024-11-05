import { Box, Button, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { event } from '../Interfaces/event';
import axios from 'axios';


const EventCard = () => {

  const [events, setEvents] = useState([{
    title: '',
    details: '',
    thumbnailUrl:''
  }]);

  const token = localStorage.getItem('token');
  useEffect(() => {
    fatchEvents(token as string);
  }, [token]); 

  const fatchEvents = async (token: string) => {
    const response = await axios.get('http://localhost:3000/api/events/all', {headers: {authorization: `Bearer ${token}`}});

    const result = response.data.data.map((res: event) => ({
      title: res.title,
      details: res.details,
      thumbnailUrl: res.thumbnailUrl
    }));
    setEvents(result);
  }

  return (
    <div className="w-full">
    <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
      {events.length > 0 && events.map(res => (
        <Box key={res.title} maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
          <Image src={res.thumbnailUrl} alt={res.title} />
          <Box p="6">
            <Box fontWeight="bold" as="h4" lineHeight="tight">
              {res.title}
            </Box>
            <Text mt="2" fontSize="xl">
              {res.details}
            </Text>
            <Box mt="4" display="flex" gap="2">
              <Button variant="solid" colorScheme="teal">Edit</Button>
              <Button variant="ghost" colorScheme="teal">Delete</Button>
            </Box>
          </Box>
        </Box>
      ))}
      </div>
    </div>
  );
  
}

export default EventCard;





