import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import { EventData } from '@/Interfaces/event';

const EventDetails: React.FC = () => {
  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const token = localStorage.getItem('token');
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
      <div className="flex items-center mb-4">
        <Calendar className="w-5 h-5 mr-2 text-gray-500" />
        <span>
          {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default EventDetails;