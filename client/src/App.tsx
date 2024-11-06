import './App.css'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Dashboard from './Pages/Dashboard'
import CreateEvent from './Pages/CreateEvent'
import EventCard from './components/EventCard'
import ChakraForm from './components/ChakraForm'
import EventDetails from './components/EventDetails'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/signup' element={<Register />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/createevent' element={<CreateEvent />}></Route>
        {/* <Route path='/eventcard' element={<EventCard />}></Route> */}
        <Route path='/eventdetails/:id' element={<EventDetails />}></Route>
        <Route path='/editevent/:id' element={<ChakraForm />}></Route>
      </Routes>
    </Router>
  )
}

export default App
