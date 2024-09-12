import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from "react-icons/md";
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DashPosts() {
  const { currentUser } = useSelector(state => state.user);
  const [userPosts, setUserPosts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [userPostsError, setUserPostsError] = React.useState(false);
  const [showMore, setShowMore] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [postIdToDelete, setPostIdToDelete] = React.useState(null);


  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          setLoading(false);
          setUserPostsError(false);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
        else {
          setUserPostsError(data.message);
        }

      } catch (error) {
        setUserPostsError(error);
      }

    };

    if (currentUser.isAdmin) {
      fetchPosts();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/get-posts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/delete-post/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }

    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <section className="table-auto overflow-x-scroll md:mx-auto p-3 whitespace-nowrap scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">

      {loading ? <Spinner size={'xl'} color={'purple'} className='my-7' />
        : currentUser.isAdmin && userPosts.length > 0
          ? (
            <>
              <Table hoverable className='shadow-md'>
                <Table.Head>
                  <Table.HeadCell>Date Updated</Table.HeadCell>
                  <Table.HeadCell>Post Image</Table.HeadCell>
                  <Table.HeadCell>Post Title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>
                  <Table.HeadCell>
                    <span>Edit</span>
                  </Table.HeadCell>
                </Table.Head>

                {
                  userPosts.map((post) => (
                    <Table.Body key={post._id} className='divide-y'>
                      <Table.Row className='font-semibold bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                          <Link to={`/post/${post.slug}`}>
                            <img src={post.image} alt={post.title}
                              className='w-20 h-20 object-cover bg-gray-500 hover:scale-110 transition-scale duration-100'
                            />
                          </Link>
                        </Table.Cell>
                        <Table.Cell className='text-gray-900 dark:text-white'>
                          <Link to={`/post/${post.slug}`}>
                            {post.title}
                          </Link>
                        </Table.Cell>
                        <Table.Cell>
                          {post.category}
                        </Table.Cell>
                        <Table.Cell>
                          <div className="flex items-center gap-1 justify-center text-red-600 cursor-pointer">
                            <MdDelete className=' hover:rotate-3' />
                            <span onClick={() => {
                              setShowModal(true)
                              setPostIdToDelete(post._id)
                            }} className='font-semibold hover:underline '>Delete</span>
                          </div>
                        </Table.Cell>
                        <Table.Cell>
                          <Link to={`/update-post/${post._id}`}>
                            <div className="flex items-center gap-1">
                              <MdEdit className='text-blue-600 hover:skew-x-12' />
                              <span className='text-teal-500 font-semibold hover:underline'>Edit</span>
                            </div>
                          </Link>
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
          : (<p className='text-2xl text-blue-400 text-center mt-4'>You have no post yet!</p>)
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
              Are you sure you want to delete this post?
            </h3>

            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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
