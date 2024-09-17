import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashComments() {
  const { currentUser } = useSelector(state => state.user);
  const [comments, setComments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showMore, setShowMore] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = React.useState(null);


  React.useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setLoading(false);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
        else {
          console.log(data.message);
        }

      } catch (error) {
        console.log(error);
      }

    };

    if (currentUser.isAdmin) {
      fetchComments();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/get-comments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/delete-comment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }

    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <section className="table-auto overflow-x-scroll md:mx-auto p-3 whitespace-nowrap scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">

      {loading ? <Spinner size={'xl'} color={'purple'} className='my-7' />
        : currentUser.isAdmin && comments.length > 0
          ? (
            <>
              <Table hoverable className='shadow-md'>
                <Table.Head>
                  <Table.HeadCell>Date created</Table.HeadCell>
                  <Table.HeadCell>Comment Content</Table.HeadCell>
                  <Table.HeadCell>Number of likes</Table.HeadCell>
                  <Table.HeadCell>PostId</Table.HeadCell>
                  <Table.HeadCell>userId</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>

                </Table.Head>

                {
                  comments.map((comment) => (
                    <Table.Body key={comment._id} className='divide-y'>
                      <Table.Row className='font-semibold bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          {comment.content}
                        </Table.Cell>

                        <Table.Cell className='text-gray-900 dark:text-white'>
                          {comment.numberOfLikes}
                        </Table.Cell>

                        <Table.Cell>
                          {comment.postId}
                        </Table.Cell>
                        <Table.Cell>
                          {comment.userId }
                        </Table.Cell>

                        <Table.Cell>
                          <div className="flex items-center gap-1 justify-center text-red-600 cursor-pointer">
                            <MdDelete className=' hover:rotate-3' />
                            <span onClick={() => {
                              setShowModal(true)
                              setCommentIdToDelete(comment._id)
                            }} className='font-semibold hover:underline '>Delete</span>
                          </div>
                        </Table.Cell>

                      </Table.Row>
                    </Table.Body>
                  ))
                }


              </Table>

              {
                showMore && <button onClick={handleShowMore} className='w-full text-teal-500 self-center py-7 text-sm'>Show More</button>
              }
            </>
          )
          : (<p className='text-2xl text-blue-400 text-center mt-4'>No comments available!</p>)
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
              <Button color="failure"
                onClick={handleDeleteComment}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>

      </Modal>



    </section >
  )
};
