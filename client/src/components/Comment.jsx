import { useEffect, useState } from 'react';
import moment from 'moment';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Button, Textarea } from 'flowbite-react';

export default function Comment({ comment, onLike, onEdit, onDelete }) {
  const { currentUser } = useSelector(state => state.user);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/comment/edit-comment/${comment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editedContent
        })
      });

      if (res.ok) {
        onEdit(comment, editedContent);
        setIsEditing(false);
      }

    } catch (error) {
      console.log(error.message);
    }
  }

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

        {
          isEditing ? (
            <>
              <Textarea
                className='mb-2'
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex items-center justify-end gap-4">
                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='purpleToBlue'
                  onClick={handleSave}
                >
                  Save
                </Button>

                <Button
                  type='button'
                  size='sm'
                  gradientDuoTone='pinkToOrange'
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
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
                    comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (comment.numberOfLikes === 1 ? "like" : "likes")
                  }
                </p>
                {/* --edit btn-- */}
                {
                  currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <>
                      <button type='button' onClick={handleEdit} className='text-gray-500 hover:text-blue-500'>Edit</button>
                      <button type='button' onClick={() => onDelete(comment._id)} className='text-gray-500 hover:text-red-500'>Delete</button>
                    </>
                  )
                }
              </div>
            </>
          )
        }

      </div>

    </section>
  )
}
