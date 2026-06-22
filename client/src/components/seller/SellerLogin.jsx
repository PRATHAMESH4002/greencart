import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';

const SellerLogin = () => {

    const {isSeller, setIsSeller, navigate, axios} = useAppContext() ;
    const [email, setEmail] = useState("") ;
    const [password, setPassword] = useState("") ;

    const onSubmitHandler = async(e) => {
        try{
            e.preventDefault() ;
            const { data } = await axios.post('/api/seller/login', {email, password}) ;
            if(data.success){
                setIsSeller(true) ;
                navigate('/seller') ;
            }else{
                setIsSeller(false) ;
                toast.error(data.message) ;
            }
        }catch(err){
            toast.error(err.message) ;
            setIsSeller(false) ;
        }

    }

  return !isSeller && (
    <div className='min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4'>
      <form onSubmit={onSubmitHandler} className='fade-in flex flex-col gap-6 m-auto items-start p-8 py-12 min-w-80 sm:min-w-96 rounded-2xl glass-effect shadow-2xl border border-white/20 backdrop-blur-lg'>
          <p className='text-3xl font-bold m-auto gradient-text animate-pulse'>
              <span className='text-primary'>Seller</span> Login
          </p>

          <div className='w-full'>
              <p className='text-gray-700 font-medium mb-2'>Email</p>
              <input onChange={(e) => setEmail(e.target.value)} value={email} name="email" type="email" placeholder='Enter your email'
              className='border border-gray-300/50 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/70 backdrop-blur-sm transition-all duration-300' required/>
          </div>

          <div className='w-full'>
              <p className='text-gray-700 font-medium mb-2'>Password</p>
              <input onChange={(e) => setPassword(e.target.value)} value={password} name="password" type="password" placeholder='Enter your password'
              className='border border-gray-300/50 rounded-xl w-full p-3 mt-1 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white/70 backdrop-blur-sm transition-all duration-300' required/>
          </div>

          <button className='bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white w-full py-3 rounded-xl cursor-pointer font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bounce-in'>Login</button>

          {/* Floating elements for visual interest */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-4 h-4 bg-secondary/30 rounded-full animate-pulse"></div>
      </form>
    </div>
  )
}

export default SellerLogin ;
