import { Button, FloatingLabel } from 'flowbite-react';
import React from 'react'
import { Link } from 'react-router-dom';

export default function SignUp() {
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
          <form className='flex flex-col gap-4'>
            <FloatingLabel className='' variant='outlined' label='Username' id='username' type='text' />
            <FloatingLabel variant='outlined' label='Email' id='email' type='email' />
            <FloatingLabel variant='outlined' label='Password' id='password' type='password' />         
            
            <Button gradientDuoTone="purpleToPink" className='uppercase' type='submit'>Sign Up</Button>
          </form>

          <div className="flex gap-2 mt-4 text-sm">
            <span>Already have an account ?</span>
            <Link to='/sign-in' className='text-blue-500 hover:text-blue-700'>Sign in</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
