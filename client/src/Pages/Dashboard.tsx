
import { Search, Globe, Menu } from 'lucide-react';
import logo from "../images/ui-1.svg";
import { Link } from 'react-router-dom';
import { createRef, useEffect,  useState } from 'react';
import axios from 'axios';
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import DefaultSpinner from '@/components/DefaultSpinner';
import { event, EventData } from '@/Interfaces/event';
import EventCard from '@/components/EventCard';

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  
  const searchByTitleRef = createRef<HTMLInputElement>();
  const searchByLocationRef = createRef<HTMLInputElement>();

  const fetchEvents = async () => {
    const response = await axios.get('http://localhost:3000/api/events/all');

    const res = response.data.data;
    if (!res) {
      throw new Error('Failed to fetch event details');
    }
    const result = response.data.data.map((res: event) => ({
      id: res.id,
      title: res.title,
      details: res.details,
      thumbnailUrl: res.thumbnailUrl,
      location: res.location
    }));
    setEvents(result);
  }

  useEffect(() => {
    setLoading(true);

    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/me', { headers: { authorization: `Bearer ${token}` } }).then((res) => {
      setIsLogin(res.data.status)
    }).catch((error) => {
      console.log(error)
    });

    fetchEvents();
    setLoading(false);
  }, []);

  const onSearch = async () => {
    const doesSearchByTitleHasValue = searchByTitleRef.current!.value.length > 0;
    const doesSearchByLocationHasValue = searchByLocationRef.current!.value.length > 0;

    if (!doesSearchByTitleHasValue && !doesSearchByLocationHasValue) await fetchEvents();

    console.log(searchByTitleRef.current!.value);

    let searchedEvents = events;
    if (doesSearchByTitleHasValue) {
      searchedEvents = searchedEvents.filter(event => event.title.toLowerCase().includes(searchByTitleRef.current!.value.toLocaleLowerCase()));
    }

    if (doesSearchByLocationHasValue) {
      searchedEvents.forEach(s => console.log(s));
      searchedEvents = searchedEvents.filter(event => event.location?.toLowerCase().includes(searchByLocationRef.current!.value.toLocaleLowerCase()));
      console.log(searchedEvents, 'coming');
    }

    setEvents([...searchedEvents]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
  };
  console.log("Login: ", isLogin)

  if (isLoading) return <div className='absolute top-[48%] left-[48%]'><DefaultSpinner /></div>

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className='h-16 flex items-center'>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8 h-full">
              {/* Meetup Logo */}
              <a href="/" className="flex-shrink-0">
                <img
                  src={logo}
                  alt="Meetup Logo"
                  className="h-8"
                />
              </a>
              {/* Search Bar */}
              <InputGroup>
                <Input ref={searchByTitleRef} type='text' className='m-0 rounded-l-lg' placeholder='Search by event title' />
                <Input ref={searchByLocationRef} type='text' className='m-0' rounded={'none'} placeholder='Search by location' />
                <InputRightAddon children={<Search className="h-5 w-5" />} onClick={async () => await onSearch()} />
              </InputGroup>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Globe className="h-5 w-5" />

                English
              </div>
              {
                isLogin ? (<>
                  <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500"><Link to="/createevent">Create Event</Link></button>
                  <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500"><Link to="/userevent">Your Event</Link></button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick=
                    {() => {
                      logout();
                    }} ><Link to="/"></Link>Log out</button>
                </>) : (<>
                  <button className="text-gray-700 hover:text-gray-900"><Link to="/login">Log in</Link></button>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"><Link to="/signup">Sign up</Link></button>
                </>)
              }
            </nav>

            {/* Mobile Menu */}
            <button className="md:hidden text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <EventCard events={events} setEvents={setEvents} />    
    </div>
  );
}

export default App;