import { Alert, Button, FloatingLabel, Spinner } from 'flowbite-react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { HiInformationCircle } from "react-icons/hi";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill in all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
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
            <FloatingLabel onChange={handleChange} variant='outlined' label='Username' id='username' type='text' />
            <FloatingLabel onChange={handleChange} variant='outlined' label='Email' id='email' type='email' />
            <FloatingLabel onChange={handleChange} variant='outlined' label='Password' id='password' type='password' />

            <Button gradientDuoTone="purpleToPink" className='uppercase' type='submit' disabled={loading}>
              {loading ?
                <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                </> : 'sign up'
              }
            </Button>
          </form>

          <div className="flex gap-2 mt-4 text-sm">
            <span>Already have an account ?</span>
            <Link to='/sign-in' className='text-blue-500 hover:text-blue-700'>Sign in</Link>
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
