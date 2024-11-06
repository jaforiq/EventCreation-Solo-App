import { Box, Button, Image, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { event } from '../Interfaces/event';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const EventCard = () => {

  const [events, setEvents] = useState([{
    id: 0,
    title: '',
    details: '',
    thumbnailUrl:''
  }]);

  const token = localStorage.getItem('token');
  useEffect(() => {
    fatchEvents(token as string);
  }, [token]); 

  const fatchEvents = async (token: string) => {
    const response = await axios.get('http://localhost:3000/api/events/all',);

    const res = response.data.data;
    if(!res){
      throw new Error('Failed to fetch event details');
    }
    const result = response.data.data.map((res: event) => ({
      id: res.id,
      title: res.title,
      details: res.details,
      thumbnailUrl: res.thumbnailUrl
    }));
    setEvents(result);
  }

  const navigate = useNavigate();
  const handleEditClick = (e: React.MouseEvent, eventId: Number) => {
    e.stopPropagation();
    navigate(`/editevent/${eventId}`);
  }

  const handleCardClick = (eventId: Number) => {
    navigate(`/eventdetails/${eventId}`);
  }
console.log("events: ", events);
  return (
    <div className="w-full mt-5">
    <div className="flex flex-wrap justify-center items-center mx-auto w-full gap-8">
      {events.length > 0 && events.map(res => (
        <Box 
        key={res.id} 
        maxW="sm" 
        borderWidth="1px" 
        borderRadius="lg" 
        overflow="hidden"
        onClick={() => handleCardClick(res.id)}
        cursor="pointer"
        _hover={{ boxShadow: 'lg' }}
        >
          <Image src={res.thumbnailUrl} alt={res.title} />
          <Box p="6">
            <Box fontWeight="bold" as="h4" lineHeight="tight">
              {res.title}
            </Box>
            <Text mt="2" fontSize="sm">
              {res.details}
            </Text>
            <Box mt="4" display="flex" gap="2">
              <Button 
              variant="solid" 
              colorScheme="teal"
              onClick={(e) => handleEditClick(e, res.id)}
              ></Button>
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





