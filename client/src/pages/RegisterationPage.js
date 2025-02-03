import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helper/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';

const Registeration = () => {

  const [data,setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: ""
  })

  const [uploadPhoto,setUploadPhoto] = useState("")
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

  // This Function Handles Photo Uploads
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)
    setUploadPhoto(file)

    setData((preve)=>{
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }

  //This Function Clear the profile picture upload
  const clearUploadPhoto = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto("Upload profile Photo")
  }

  //Handle Submit Function
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

      // this line linked the backend
    const URL = `${process.env.REACT_APP_BACKEND_URL}api/signup`
    try {
      const res = await axios.post(URL,data)
      // console.log('response',res)
      toast.success(res.data.message)
      if(res.data.success){
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: ""
        })
        navigate('/checkemail')
      }
    } catch (error) {
      toast.error(error?.res?.data?.message)
      // console.log('error',error)
    }

    // console.log("data", data)
  }

  return (
    <div className='my-20'>
        <div className='bg-white w-full max-w-md mx:2 rounded overflow-hidden p-4 md:mx-auto'>
            <h1 className='font-bold'>Welcome to chat app</h1>

            <form className='grid gap-5 mt-5' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name :</label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      placeholder='enter your name'
                      className='bg-slate-100 px-2 focus:outline-primary py-1 rounded-sm'
                      value={data.name}
                      onChange={changeHandler}
                      required
                    />
                 </div>

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

                <div className='flex flex-col gap-1'>
                    <label htmlFor='profile_pic'>Photo :

                      <div className='h-14 bg-slate-200 flex justify-center items-center border rounded-sm hover:border-primary cursor-pointer'>
                      <p className='text-sm max-w-[300] text-ellipsis line-clamp-1 flex items-center'> {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile Photo"}
                      </p>
                      {
                          uploadPhoto?.name && (
                            <button className='text-lg ml-2 hover:text-red-600' onClick={clearUploadPhoto}>
                              <IoClose />
                            </button>
                        )
                      }
                      </div>

                    </label>
                    <input
                      type='file'
                      id='profile_pic'
                      name='profile_pic'
                      className='bg-slate-100 px-2 focus:outline-primary hidden'
                      onChange={handleUploadPhoto}
                    />
                </div>

                <button 
                  className='bg-primary text-lg text-white font-bold px-4 py-1 mt-2 rounded-sm hover:bg-secondary'
                >
                  Register
                </button>

            </form>
            <p className='mt-3 text-center'>Already have an account ? <Link to={'/checkemail'} className='hover:text-primary font-bold'>Login</Link></p>
        </div>
    </div>
  )
}

export default Registeration
