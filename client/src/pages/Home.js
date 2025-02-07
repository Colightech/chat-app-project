import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice'
import SideBar from '../components/SideBar'
import logo from '../assets/logo.png'
import io from 'socket.io-client'

const Home = () => {

  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()


  const fetchUserDetails = async () =>{
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}api/userdetails`
      const res = await axios({
        url : URL,
        withCredentials : true
      })

      dispatch(setUser(res.data.data))


      if (res.data.data.logout) {
        dispatch(logout())
        navigate('/checkemail')
      }

    } catch (error) {
      console.log("error",error)
    }
  }

  useEffect(()=>{
    fetchUserDetails()
  },[])

  // Socket connection
  useEffect(()=>{
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth : {
        token : localStorage.getItem('token')
      }
    })

    socketConnection.on('onlineuser',(data)=>{
      dispatch(setOnlineUser(data))
    })

    dispatch(setSocketConnection(socketConnection))

    return () => {
      socketConnection.disconnect()
    }

  },[])

  // console.log('location side',location)
  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section  className={`bg-white ${!basePath && 'hidden'} lg:block`}>
            <SideBar/>
        </section>

        <div className='lg:flex flex-col gap-2 hidden relative'>
            {/* Message Section */}
              <section className={`${basePath && 'hidden'}`}>
                  <Outlet/>
              </section>

            <div className={`absolute top-80 left-80 flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`} >
                <div>
                    <img
                      src={logo}
                      width={250}
                      alt='logo'
                    />
                </div>
                <p className='text-lg font-bold text-slate-400'>Select user to start messaging</p>
            </div>
        </div>
    </div>
  )
}

export default Home
