import React, { useEffect, useRef, useState } from 'react'
import Avatar from '../components/avatar'
import uploadFile from '../helper/uploadFile'
import Divider from './Divider'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'

const EditUserDetails = ({onClose,user}) => {

    
    const [data,setData] = useState({
        name : user?.user,
        profile_pic : user?.profile_pic
    })

    const uploadPhotoRef = useRef()
    const dispatch = useDispatch()

    useEffect(()=>{
        setData((preve)=>{
            return {
                ...preve,
                ...user
            }
        })
    },[user])

    const handleOnChange = (e) =>{ 
        const {name, value} = e.target

        setData((preve)=>{
            return {
                ...preve,
                [name] : value
            }
        })
    }

    const handleOpenUploadPhoto = (e) =>{
        e.preventDefault()
        e.stopPropagation()
        uploadPhotoRef.current.click()
    }


// This Function Handles Photo Uploads
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setData((preve)=>{
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
         const URL = `${process.env.REACT_APP_BACKEND_URL}api/updateuser`
         const res = await axios({
            method: 'post',
            url: URL,
            data: data,
            withCredentials: true
         })
         toast.success(res.data.message)

         if (res.data.success) {
            dispatch(setUser(res.data.data))
            onClose()
         }

    } catch (error) {
        toast.error(error?.res?.data?.message)
    }
  }

  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10'>
        <div className='bg-white p-6 m-1 rounded w-full max-w-sm'>
            <h2 className='font-semibold'> Edit User Profile details</h2>
            {/* <p className='text-sm'>Edit User Details</p> */}

            <form className='grid gap-3 mt-3' onSubmit={handleSubmit}>
                <div className='flex flex-col gap-1'>
                    <label htmlFor='name'>Name: </label>
                    <input
                        type='text'
                        name='name'
                        id='name'
                        value={data.name}
                        onChange={handleOnChange}
                        className='w-full py-1 px-2 focus:outline-primary border-1'
                    />
                </div>

                <div className='flex flex-col gap-1'>
                    <label htmlFor='profile_pic'>Photo: </label>
                    <div className='mt-1  flex items-center gap-4'>
                        <Avatar
                            width={40}
                            height={40}
                            imageUrl={data?.profile_pic}
                            name={data?.name}
                        />
                        <button onClick={handleOpenUploadPhoto} className='font-bold'>Change photo</button>
                        <input
                            type='file'
                            className='hidden'
                            onChange={handleUploadPhoto}
                            ref={uploadPhotoRef}
                        />
                    </div>
                </div>
                {/* <hr className='p-[0.5px] bg-slate-200 my-1'/> */}
                <Divider/>
                <div className='flex gap-2 ml-auto'>
                    <button onClick={onClose} className='border-primary border text-primary px-4 py-1 rounded hover:bg-primary hover:text-white'>Cancel</button>
                    <button onClick={handleSubmit} className='border-primary border bg-primary  text-white px-4 py-1 rounded hover:bg-secondary'>Update</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default EditUserDetails
