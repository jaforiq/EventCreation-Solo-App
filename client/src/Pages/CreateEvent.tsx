import React, {  useEffect, useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { genre } from '../Interfaces/genre';
import '@preline/select';
import { MultiSelect } from 'react-multi-select-component';



const EventCreationForm: React.FC = () => {
  const [eventData, setEventData] = useState({
    title: '',
    details: '',
    location: '',
    startDate: '',
    endDate: '',
    genreId: [],
    thumbnailUrl: null as string | null,
  });

  //const [genres, setGenres] = useState<genre[]>([]);
  const [selected, setSelected] = useState([]);
  const [options, setOption] = useState([{
    label: '',
    value: ''
  }]);

  
  const token = localStorage.getItem('token');
  useEffect(() => {
    fetchGenres(token as string);
  }, [token]);

  const fetchGenres = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:3000/api/genres', {headers: {authorization: `Bearer ${token}`}});
      console.log("data", response.data.data);

      const result = response.data.data.map((res: genre) => (
        {label: res.name,
        value: res.id}
      ))
      setOption(result);
      //console.log("Res: ",result);
      //setGenres(response.data.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };
  console.log("Gen: ", selected);


  // const handleCreateGenre = async () => {     // create new genre

  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await axios.post('http://localhost:3000/api/genres/create', { name: inputValue }, {headers: {authorization: `Bearer ${token}`}});
  //     const newGenre = response.data;
  //     setGenres([...genres, newGenre]);
  //     // setSelectedGenres([...selectedGenres, newGenre]);
  //     //setInputValue('');
  //   } catch (error) {
  //     console.error("Error creating genre:", error);
  //   }
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { console.log("inside Filechange");
    const cloudName = "dvrwupgzz";
    const presetName = "fr3ws4o";
    if (e.target.files && e.target.files) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', presetName);
      axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData)
      .then(res => { console.log("Res: ",res.data);
        setEventData(prev => ({ ...prev, thumbnailUrl: res.data.secure_url}))})
      .catch(err => console.log(err));      
    }
  };

  const navigate = useNavigate();
  eventData.genreId = selected;
  //console.log("Data2: ", eventData.genreId);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    //console.log('Event Data:', eventData);
    axios.post("http://localhost:3000/api/events/create", eventData, {headers: {authorization: `Bearer ${token}`}} )
    .then(res => {
      console.log(res);
      navigate("/");
    })
    .catch(err => console.log(err)); 
  };
  //{console.log(eventData.picture)}
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Event</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 flex-1">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Event Title</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={eventData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>

          <div>
            <label htmlFor="details" className="block text-sm font-medium text-gray-700">Event Details</label>
            <textarea
              id="details"
              name="details"
              rows={4}
              required
              value={eventData.details}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={eventData.location}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>


          <MultiSelect 
          options={options} 
          value={selected}
          onChange={setSelected}
          labelledBy="Select">
            
          </MultiSelect>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={eventData.startDate}
                  onChange={handleInputChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  required
                  value={eventData.endDate}
                  onChange={handleInputChange}
                  className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="picture" className="block text-sm font-medium text-gray-700">Event Picture</label>
            <input
              type="file"
              id="picture"
              name="picture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Event
            </button>
          </div>
        </form>

        <div className="flex-1 mt-8 md:mt-0">
          
          {eventData.thumbnailUrl ? (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src={eventData.thumbnailUrl}
                alt="Event Preview" 
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Upload className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCreationForm;