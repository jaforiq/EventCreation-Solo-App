import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import { EventData } from '@/Interfaces/event';

const EventDetails: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [event, setEvent] = useState<EventData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  //Attendy state
  const [goingCount, setGoingCount] = useState(0);
  const [interestedCount, setInterestedCount] = useState(0);
  const [notGoingCount, setNotGoingCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchAttendy();
  }, [id]);

  const handleStatusChange = async (status: number) => {
    //setSelectedStatus(status);
    
    // Increment the local count
    if (status === 1) {
      setGoingCount(1);
      setInterestedCount(0);
      setNotGoingCount(0);
    }
    else if (status === 2) {
      setGoingCount(0);
      setInterestedCount(1);
      setNotGoingCount(0);
    }
    else if (status === 3) {
      setGoingCount(0);
      setInterestedCount(0);
      setNotGoingCount(1);
    }
  
    // Update the status in backend
    try {
      await axios.post(`http://localhost:3000/api/attendy/create/${id}`, { status }, {
        headers: { authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };
  
  const token = localStorage.getItem('token');
  const fetchAttendy = async () => {
    try{
      const res = await axios.get(`http://localhost:3000/api/attendy/get/${id}`, {headers: {authorization: `Bearer ${token}`}});
      // if(!res.data.data) setSelectedStatus(0);
      // else {
      console.log("res: ",res)
      const status = res.data?.data?.status ?? 0;
      setSelectedStatus(status);
    //}
    } catch(err) {
      setError('An error occurred while fetching attendy details. Please try again later.');
    }
  }

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/get/${id}`, {headers: {authorization: `Bearer ${token}`}});
      const result = response.data.data;
      setEvent(result);
      
    } catch (err) {
      setError('An error occurred while fetching event details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading event details...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!event) {
    return <div className="text-center p-8">Event not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <img
        src={event.thumbnailUrl}
        className="w-full h-64 object-cover rounded-lg mb-6"
      />
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="mb-6">
        <p className="text-gray-700 whitespace-pre-wrap">{event.details}</p>
      </div>
      <div className="flex items-center mb-4">
        <MapPin className="w-5 h-5 mr-2 text-gray-500" />
        <span>{event.location}</span>
      </div>
      <div className="">
        {/* //<div> */}
          <Calendar className="w-5 h-5 mr-2 text-gray-500" />
          <span>
            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </span>
        {/* //</div> */}
        <div className="ml-72 flex">
          <label>
            <input type="radio" name="attendance" checked={selectedStatus == 1} onClick={() => handleStatusChange(1)} />
            Going ({goingCount})
          </label>
          <label>
            <input type="radio" name="attendance" checked={selectedStatus == 2} onClick={() => handleStatusChange(2)} />
            Interested ({interestedCount})
          </label>
          <label>
            <input type="radio" name="attendance" checked={selectedStatus == 3} onClick={() => handleStatusChange(3)} />
            Not Going ({notGoingCount})
          </label>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;