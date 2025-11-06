import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axios'
import { setUser } from './authSlice'
import Logo from '../../components/Logo'

const LoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(LoginSchema),
    mode: "onBlur"
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/feed', { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (formData) => {
    try {
      // Backend expects either 'username' or 'email', so send identifier as both
      const loginData = {
        username: formData.identifier,
        email: formData.identifier,
        password: formData.password
      };

      if (import.meta.env.DEV) {
        console.log("Login data:", loginData);
      }
      
      const res = await api.post('/login', loginData);
      
      if (import.meta.env.DEV) {
        console.log("Login response:", res);
      }
      
      toast.success("Welcome back!");
      dispatch(setUser(res.data.user));
      navigate('/feed');

    } catch (err) {
      if (import.meta.env.DEV) {
        console.error("Login error:", err);
      }
      
      toast.error(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50'>
      <div className='flex w-full max-w-4xl shadow-2xl shadow-indigo-200 rounded-2xl bg-white'>
        <div className='w-full md:w-1/2 p-8 flex flex-col justify-center'>
          <div className='text-center text-2xl text-indigo-600 font-bold mb-2'>Welcome back</div>
          <p className='text-center text-gray-600 mb-6'>Log in to your account</p>

          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="identifier" className='text-gray-700 font-medium'>Username or Email</label>
              <input 
                id='identifier' 
                type="text"
                {...register("identifier")}
                placeholder='Enter your username or email'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.identifier && (
                <p className="text-red-500 text-xs">{errors.identifier.message}</p>
              )}
            </div>

            <div className='flex flex-col space-y-0.5'>
              <label htmlFor="password" className='text-gray-700 font-medium'>Password</label>
              <input 
                id='password' 
                type="password"
                {...register("password")}
                placeholder='Enter your password'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50'
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password.message}</p>
              )}
            </div>

            <button 
              type='submit'
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/50"
            >
              {isSubmitting ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className='mt-4 text-center text-sm text-gray-600'>
            Don't have an account?{' '}
            <Link to="/signup" className='text-indigo-600 hover:text-indigo-700 font-semibold'>
              Sign up
            </Link>
          </div>
        </div>

        <div className='hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-br from-indigo-600 to-purple-700 rounded-r-2xl'>
          <Logo />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
