import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import toast from 'react-hot-toast';
// import { FaRegCircleUser } from "react-icons/fa6";
import Avatar from '../components/avatar';

const CheckEmail = () => {

  const [data,setData] = useState({
    email: ""
  })

  const navigate = useNavigate()

  const changeHandler = (e) => {
    const { name, value } = e.target

    setData((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }


  //Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

      // this line linked the backend
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/checkemail`
    try {
      const res = await axios.post(URL,data)
      console.log('response',res)
      toast.success(res.data.message)
      if(res.data.success){
        setData({
          email: "",
        })
        navigate('/checkpassword',{
          state : res?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.res?.data?.message)
      console.log('error',error)
    }
  }

  return (
    <div className='my-20'>
    <div className='bg-white w-full max-w-md mx:2 rounded overflow-hidden p-4 md:mx-auto'>

        <div className=' w-fit mx-auto mb-5'>
           {/* <FaRegCircleUser
           size={80}
            /> */}
            <Avatar
            width={70}
            />
        </div>

        <h1 className='font-bold flex justify-center'>Welcome to chat app</h1>

        <form className='grid gap-5 mt-5' onSubmit={handleSubmit}>


             <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email :</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='enter your email'
                  className='bg-slate-100 px-2 focus:outline-primary py-1 rounded-sm'
                  value={data.email}
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
        <p className='mt-3 text-center my-5'>Don't have an account ? <Link to={'/signup'} className='hover:text-primary font-bold'>Sign Up</Link></p>
    </div>
</div>
  )
}

export default CheckEmail
