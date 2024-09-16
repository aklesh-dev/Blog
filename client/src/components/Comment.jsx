import { useEffect, useState } from 'react';
import moment from'moment';

export default function Comment({ comment }) {
  const [user, setUser] = useState({});
 
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${comment.userId}`);
      const data = await res.json();
      if(res.ok) {
        setUser(data);
      }
    };

    fetchUser();
  }, [comment]);

  return (
    <section className="flex p-4 border-b dark:border-gray-600 text-sm ">
      <div className="flex-shrink-0 mr-3">
        <img src={user.profilePic} alt={user.username} className='w-10 h-10 rounded-full' />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className='truncate text-xs font-bold mr-3'>{user ? user.username : 'Unknown User'}</span>
          <span className='text-xs text-gray-500'>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>

        <p className='text-gray-700 dark:text-gray-300 pb-2'>{comment.content}</p>
      </div>

    </section>
  )
}
