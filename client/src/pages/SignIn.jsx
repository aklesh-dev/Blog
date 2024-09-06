import { Alert, Button, FloatingLabel, Spinner } from 'flowbite-react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields.'));
    }
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }

  };

  return (
    <section className="min-h-screen mt-20">
      <div className="flex gap-5 p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center">
        {/* left side */}
        <div className="flex-1">
          <Link to={'/'} className=' text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Aklesh's</span>Blog
          </Link>
          <p className="text-sm mt-5">
            Welcome to my blog, where I share my thoughts and experiences on various topics.
          </p>
        </div>

        {/* right side */}
        <div className="flex-1">
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <FloatingLabel onChange={handleChange} variant='outlined' label='Email' id='email' type='email' />
            <FloatingLabel onChange={handleChange} variant='outlined' label='Password' id='password' type='password' />

            <Button gradientDuoTone="purpleToPink" className='uppercase' type='submit' disabled={loading}>
              {loading ?
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </> : 'sign in'
              }
            </Button>
            <OAuth/>
          </form>

          <div className="flex gap-2 mt-4 text-sm">
            <span>Don't have an account ?</span>
            <Link to='/sign-up' className='text-blue-500 hover:text-blue-700'>Sign up</Link>
          </div>

          {
            errorMessage && <Alert className='mt-4' color='failure' icon={HiInformationCircle}>
              <span className="font-semibold">Info alert! </span>{errorMessage}
            </Alert>
          }

        </div>

      </div>
    </section>
  )
}
