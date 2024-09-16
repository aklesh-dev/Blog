import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Comment({ comment, onLike }) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector(state => state.user);
  
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`/api/user/${comment.userId}`);
      const data = await res.json();
      if (res.ok) {
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

        <div className="flex items-center gap-2 pt-2 border-t dark:border-gray-600 max-w-fit">
          <button
            onClick={() => onLike(comment._id)}
            type='button'
            className={`text-gray-500 hover:text-blue-500 
              ${currentUser && comment?.likes?.includes(currentUser._id) ? '!text-blue-500' : ''} `}
          >
            <FaThumbsUp />
          </button>

          <p className='text-gray-500'>
            {
              comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1? "like" : "likes")
            }
          </p>
        </div>
      </div>

    </section>
  )
}
