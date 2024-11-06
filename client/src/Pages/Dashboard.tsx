
import { Search, Globe, Menu } from 'lucide-react';
import logo from "../images/ui-1.svg";
import img2 from "../images/ui-2.svg";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '@/components/eventCard';

function App() {
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:3000/api/me', {headers: {authorization: `Bearer ${token}`}}).then((res)=>{
        //console.log(res.data.status)
        setIsLogin(res.data.status)
    }).catch((error)=>{
      console.log(error)
    });
    
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLogin(false);
  };
console.log("Login: ",isLogin)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-70">
            <div className="flex items-center gap-8">
              {/* Meetup Logo */}
              <a href="/" className="flex-shrink-0">
                <img 
                  src={logo}
                  alt="Meetup Logo"
                  className="h-8"
                />
              </a>
              {/* Search Bar */}
              <div className="flex items-center bg-gray-100 rounded-full px-4 ">
                <input
                  type="text"
                  placeholder="Search for keywords"
                  className="bg-transparent border-none focus:outline-none text-lg w-75 h-50"
                />
                <Search className="h-5 w-5 text-gray-500" />
              </div>
            </div> 
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button className="text-gray-700 hover:text-gray-900">Start a group</button>
              <div className="flex items-center gap-1">
                <Globe className="h-5 w-5" />
                
                English
              </div>
              {
                isLogin ? (<>
                <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500"><Link to="/createevent">Create Event</Link></button>
                <button className="bg-slate-300 text-black px-4 py-2 rounded-md hover:bg-slate-500">Your Event</button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600" onClick=
                {() =>{
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

      
      <EventCard/>




      {/* Main Content */}
      {/* <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold">The people platform - Where interests become friendships</h1>
              <p className="text-xl text-gray-600">Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup.</p>
            </div>
            <div className="hidden md:block">
              <img 
                src={img2}
                alt="Meetup Illustration"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </main> */}
      

      {/* Footer */}
      {/* <footer className="bg-gray-100">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Your Account</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Settings</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Log out</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Help</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Discover</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Groups</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Calendar</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Topics</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Meetup</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Follow us</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Facebook</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Twitter</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t">
            <p className="text-center text-gray-600">© 2024 Meetup clone</p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default App;