import { Button, FloatingLabel } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function DashProfile() {
    const { currentUser } = useSelector(state => state.user);
    return (
        <section className="max-w-lg mx-auto w-full p-3">
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>

            <form className='flex flex-col gap-4'>
                <div className="w-32 h-32 self-center cursor-pointer shadow-md rounded-full overflow-hidden">
                    <img src={currentUser.profilePic} alt="user"
                        className='w-full h-full rounded-full object-cover border-8 border-double border-[#dddbdb]'
                    />
                </div>

                <FloatingLabel variant='outlined' label='username' defaultValue={currentUser.username} id='username' />
                <FloatingLabel variant='outlined' label='email' defaultValue={currentUser.email} id='email' />
                <FloatingLabel variant='outlined' label='password'  id='password' />
                <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
            </form>

            <div className="flex justify-between text-red-500 my-5">
                <span className="cursor-pointer hover:text-red-700">Delete Account</span>
                <span className="cursor-pointer hover:text-red-700">Sign out</span>
            </div>
        </section>
    )
}
