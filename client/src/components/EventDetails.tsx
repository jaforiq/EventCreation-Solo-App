import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import { EventData } from '@/Interfaces/event';
import { FaStar } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { MdDangerous } from 'react-icons/md';

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
    fetchUserAttendy();
    fetchEventAttendy();
  }, [id, goingCount, interestedCount, notGoingCount]);

  const handleStatusChange = async (status: number) => {
    console.log('select: ', selectedStatus);
    // changing previous selected value
    if (selectedStatus === 1) {
      setGoingCount(goingCount - 1);
    }
    else if (selectedStatus === 2) {
      setInterestedCount(interestedCount - 1);
    }
    else if (selectedStatus === 3) {
      setNotGoingCount(notGoingCount - 1);
    }
    setSelectedStatus(status);
    
    // Increment the local count
    if (status === 1) {
      setGoingCount(goingCount + 1);
    }
    else if (status === 2) {
      setInterestedCount(interestedCount + 1);
    }
    else if (status === 3) {
      setNotGoingCount(notGoingCount + 1);
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
  const fetchUserAttendy = async () => {
      const res = await axios.get(`http://localhost:3000/api/attendy/get/${id}`, {headers: {authorization: `Bearer ${token}`}});
    
      //console.log("res: ",res.data);
      const status = res.data?.status;
      setSelectedStatus(status);

  }

  const fetchEventAttendy = async () => {
    const res = await axios.get(`http://localhost:3000/api/attendy/getallattendy/${id}`)  // get all attendy of a event
    const arr = res.data.arrStatus;
    console.log('arr: ', arr);
    if(arr.length > 0){
      let tempGoing = 0;
      let tempInterested = 0;
      let tempNotGoing = 0;

      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === 1) tempGoing += 1;
        else if (arr[i] === 2) tempInterested += 1;
        else if (arr[i] === 3) tempNotGoing += 1;
      }

      setGoingCount(tempGoing);
      setInterestedCount(tempInterested);
      setNotGoingCount(tempNotGoing);

      //console.log('Going: ', goingCount);
      //console.log('Notgoing: ', notGoingCount);
    } 
  }

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/get/${id}`);  // fatch event details
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
        <div className="ml-72 flex gap-4">
          <div onClick={() => handleStatusChange(1)} className={selectedStatus === 1 ? "text-green-500" : "text-gray-500"}>
          <IoMdCheckmarkCircle className="w-6 h-6 cursor-pointer" />
          <span>Going ({goingCount})</span>
          </div>
          <div onClick={() => handleStatusChange(2)} className={selectedStatus === 2 ? "text-blue-500" : "text-gray-500"}>            
            <FaStar className="w-6 h-6 cursor-pointer" />
              <span>Interested ({interestedCount})</span>
          </div>
          <div onClick={() => handleStatusChange(3)} className={selectedStatus === 3 ? "text-red-500" : "text-gray-500"}>
            <MdDangerous className="w-6 h-6 cursor-pointer" />
              <span>Not Going ({notGoingCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;