import { Outlet } from 'react-router'
import './App.css'
import NavBar from './components/Navbar'

export default function Root() {
  return (
    <>
    <NavBar/>
    <Outlet />
    </>
  )
}

