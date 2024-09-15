import { Alert, Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector(state => state.user);
  const [comments, setComments] = useState('');
  const [commentError, setCommentError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments.length > 200) return;

    try {
      const res = await fetch(`/api/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: comments,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments('');
        setCommentError(null);
      };
    } catch (error) {
      setCommentError(error.message);
    }

  };

  return (
    <section className="max-w-4xl mx-auto w-full p-3">
      {
        currentUser
          ? (
            <div className="flex items-center gap-1 my-5 text-sm text-gray-500">
              <p>Signed in as:</p>
              <img src={currentUser.profilePic} alt="profile" className='w-10 h-10 object-cover rounded-full shadow-sm' />
              <Link to={'/dashboard?tab=profile'} className='text-blue-500 hover:underline'>
                @{currentUser.username}
              </Link>
            </div>
          )
          : (
            <div className="text-sm text-teal-500 my-5">
              You must be signed in to comment.
              <Link to={'/sign-in'} className='text-blue-500 hover:underline ml-2'>
                Sign in
              </Link>
            </div>
          )
      }

      {
        currentUser && (
          <form onSubmit={handleSubmit} className='border border-teal-400 rounded-md p-3'>
            <Textarea
              placeholder='Write a comment...'
              rows={'3'}
              maxLength={'200'}
              onChange={(e) => setComments(e.target.value)}
              value={comments}
            />
            <div className="flex justify-between items-center mt-5">
              <p className='text-sm text-gray-500'>{200 - comments.length} characters remaining</p>
              <Button type='submit' outline gradientDuoTone={'purpleToBlue'}>Submit</Button>
            </div>
            {
              commentError && <Alert color={'failure'} className='mt-5'>{commentError}</Alert>
            }
          </form>
        )
      }
    </section>
  )
}
