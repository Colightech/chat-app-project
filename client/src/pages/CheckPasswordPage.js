import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
// import { FaRegCircleUser } from "react-icons/fa6";
import Avatar from '../components/avatar';
import { setToken } from '../redux/userSlice';
import { useDispatch } from 'react-redux';


const CheckPassword = () => {

  const [data,setData] = useState({
    password: ""
  })

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  // console.log('Location',location.state)

  useEffect(()=>{
    if(!location?.state?.email){
        navigate('/checkemail')
    }
  },[])

  const changeHandler = (e) => {
    const { name, value } = e.target

    setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/checkpassword`;
  
    try {
      const res = await axios({
        method : "post",
        url : URL,
        data : {
          userId : location?.state?._id,
          password : data.password
        },
        withCredentials : true
      })
  
      // Handle success
      toast.success(res.data.message);
      if (res.data.success) {
        dispatch(setToken(res?.data?.token))
        localStorage.setItem("token",res?.data?.token)

        setData({ 
          password : "" 
        });
        navigate("/");
      }
    } catch (error) {
      // Handle error
      const errorMessage =
        error?.res?.data?.message || "wrong password";
      toast.error(errorMessage);
    }
  };




  return (
    <div className='my-20'>
    <div className='bg-white w-full max-w-md mx:2 rounded overflow-hidden p-4 md:mx-auto'>

        <div className=' w-fit mx-auto mb-5 flex justify-center items-center flex-col'>
           {/* <FaRegCircleUser
           size={80}
            /> */}
            <Avatar
              width={80}
              height={80}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <p className='font-bold text-lg mt-2'>{location?.state?.name}</p>
        </div>

        <h1 className='font-bold mt-10'>Welcome to chat app</h1>

        <form className='grid gap-5 mt-5' onSubmit={handleSubmit}>


              <div className='flex flex-col gap-1'>
                    <label htmlFor='password'>Password :</label>
                    <input
                      type='password'
                      id='password'
                      name='password'
                      placeholder='enter your password'
                      className='bg-slate-100 px-2 focus:outline-primary py-1 rounded-sm'
                      value={data.password}
                      onChange={changeHandler}
                      required
                    />
             </div>
            

            <button 
              className='bg-primary text-lg text-white font-bold px-4 py-1 mt-2 rounded-sm hover:bg-secondary mb-2'
            >
              Continue
            </button>

        </form>
        <p className='mt-3 text-center my-5'><Link to={'/forgotpassword'} className='hover:text-primary font-bold'>Forgot password</Link></p>
    </div>
</div>
  )
}

export default CheckPassword
