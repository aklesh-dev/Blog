import { Alert, Button, Textarea, Modal } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { set } from 'mongoose';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector(state => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) return;

    try {
      const res = await fetch(`/api/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComment([data, ...comments])
      };
    } catch (error) {
      setCommentError(error.message);
    }

  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comments/${postId}`);
        const data = await res.json();

        if (res.ok) {
          setComments(data);

        } else {
          console.error("Failed to fetch the comments");
          setComment([]);
        }

      } catch (error) {
        console.error('Error fetching comments:', error);
        setComment([]);
      }
    };

    fetchComments();

  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/like-comment/${commentId}`, {
        method: 'PUT',
      });
      if (res.ok) {
        const data = await res.json();

        setComments(comments.map((comment) =>
          comment._id === commentId ? {
            ...comment,
            likes: data.likes,
            numberOfLikes: data.numberOfLikes,
          } : comment
        ));
      }

    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (comment, editedContent) => {

    setComments(
      comments.map((c) => (
        c._id === comment._id ? { ...c, content: editedContent } : c
      ))
    );

  };

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }

      const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
        setShowModal(false);
      };

    } catch (error) {
      console.error(error.message);
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
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
            <div className="flex justify-between items-center mt-5">
              <p className='text-sm text-gray-500'>{200 - comment.length} characters remaining</p>
              <Button type='submit' outline gradientDuoTone={'purpleToBlue'}>Submit</Button>
            </div>
            {
              commentError && <Alert color={'failure'} className='mt-5'>{commentError}</Alert>
            }
          </form>
        )
      }

      {/* --show comments-- */}
      {
        comments && comments.length === 0 ? (
          <p className='text-sm my-5'>No comments yet!</p>
        ) : (
          <>
            <div className="text-sm my-5 flex items-center gap-1">
              <p className="">Comments</p>
              <div className="border border-gray-400 py-1 px-2 rounded-sm">
                <p className="">{comments.length}</p>
              </div>
            </div>

            {
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              ))
            }

          </>
        )
      }

      {/*--popup modal-- */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'md'}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-500 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-red-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>

            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>
    </section>
  )
}
