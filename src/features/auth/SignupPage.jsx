import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { setUser } from './authSlice'
import Logo from '../../components/Logo'

const SignupSchema = z.object({
  username: z.string().min(3, "Username required").max(20, "Username too long").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  email: z.string().email("Enter a valid email address"),
  displayName: z.string().min(3, "Display name is required").max(20, "Display name too long"),
  password: z.string().min(6, "Password should be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Password should be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});


const SignupPage = () => {


  const { register, handleSubmit, formState: { errors, isDirty, isSubmitting, isValid } } = useForm({
    resolver: zodResolver(SignupSchema),
    mode: "onChange"
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    const { confirmPassword, ...dataToSend } = formData;

    try {
      if (import.meta.env.DEV) {
        console.log("Form data:", dataToSend);
      }
      
      const res = await api.post('/register', dataToSend);
      
      if (import.meta.env.DEV) {
        console.log("Response from backend:", res);
      }
      
      toast.success("Account created!");
      dispatch(setUser(res.data.user));
      navigate('/signup/complete');

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Error registering user:", err);
      }
      
      toast.error(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50'>
      <div className='flex w-full max-w-4xl shadow-2xl shadow-indigo-200 rounded-2xl bg-white'> {/* this is the card containing two sections */}
        <div className='w-full md:w-1/2 p-8 flex flex-col justify-center'>
          <div className='text-center text-2xl text-indigo-600 font-bold'>Create your account</div>
          <p className='text-center text-gray-600'>Welcome to SnapShare</p>

          <form className='space-y-4'
            onSubmit={handleSubmit(onSubmit)} >
            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="username" className='text-gray-700 font-medium'>Username</label>
              <input id='username' type="text"
                {...register("username")}
                placeholder='Enter your username'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.username && (
                <p className="text-red-500 text-xs">{errors.username.message}</p>
              )}
            </div>



            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="displayName" className='text-gray-700 font-medium'>Display Name</label>
              <input id='displayName' type="text"
                {...register("displayName")}
                placeholder='Enter your display name'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.displayName && (
                <p className="text-red-500 text-xs">{errors.displayName.message}</p>
              )}

            </div>

            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="email" className='text-gray-700 font-medium'>Email</label>
              <input id='email' type="email"
                {...register("email")}
                placeholder='Enter your email'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>



            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="password" className='text-gray-700 font-medium'>Password</label>
              <input id='password' type="password"
                {...register("password")}
                placeholder='Enter your password'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>



            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="confirmPassword" className='text-gray-700 font-medium'>Confirm password</label>
              <input id='confirmPassword' type="password"
                {...register("confirmPassword")}
                placeholder='Confirm your password'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>
              )}

            </div>


            <button type='submit'
              disabled={isSubmitting || !isValid}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/50">
              Sign Up
            </button>

          </form>


        </div>

        <div className='hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700 rounded-r-2xl'>
          <Logo />
        </div>

      </div>
    </div>

  )
}

export default SignupPage
