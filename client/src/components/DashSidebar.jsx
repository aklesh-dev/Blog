import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiChartPie, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { signoutUserInFailure, signoutUserInStart, signoutUserInSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BsFillPostcardFill } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi2";
import { FaCommentDots } from "react-icons/fa";


export default function DashSidebar() {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl)
        };
    }, [location.search]);

    const handleSignoutUser = async () => {
        try {
            dispatch(signoutUserInStart());
            const res = await fetch('/api/auth/signout');
            const data = await res.json();
            if (data.success === false) {
                dispatch(signoutUserInFailure(data.message));
            } else {
                dispatch(signoutUserInSuccess(data));
            }

        } catch (error) {
            dispatch(signoutUserInFailure(error.message));
        }
    };



    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {
                        currentUser && currentUser.isAdmin && (
                            <Link to='/dashboard?tab=dash'>
                                <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                        )
                    }
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor="dark" as='div'>
                            Profile
                        </Sidebar.Item>
                    </Link>

                    {/* link is available to only admin user */}
                    {
                        currentUser.isAdmin &&
                        <>
                            <Link to='/dashboard?tab=posts'>
                                <Sidebar.Item active={tab === 'posts'} icon={BsFillPostcardFill} as='div'>
                                    Post
                                </Sidebar.Item>
                            </Link>
                            
                            <Link to='/dashboard?tab=users'>
                                <Sidebar.Item active={tab === 'users'} icon={HiUserGroup} as='div'>
                                    User
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=comments'>
                                <Sidebar.Item active={tab === 'comments'} icon={FaCommentDots} as='div'>
                                    Comment
                                </Sidebar.Item>
                            </Link>
                            
                        </>
                    }
                    

                    <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer" onClick={handleSignoutUser}>
                        Sign out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}
