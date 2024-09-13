import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { MdDelete } from "react-icons/md";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import{ FaCheck, FaTimes} from 'react-icons/fa';

export default function DashUsers() {
  const { currentUser } = useSelector(state => state.user);
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showMore, setShowMore] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [userIdToDelete, setUserIdToDelete] = React.useState(null);


  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        
        if (res.ok) {
          setUsers(data.users);
          setLoading(false);
          if (data.users.length < 9) {
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
      fetchUsers();
    }

  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/deleteuser/${userIdToDelete}/${currentUser._id}`, {
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
        : currentUser.isAdmin && users.length > 0
          ? (
            <>
              <Table hoverable className='shadow-md'>
                <Table.Head>
                  <Table.HeadCell>Date created</Table.HeadCell>
                  <Table.HeadCell>User Image</Table.HeadCell>
                  <Table.HeadCell>Username</Table.HeadCell>
                  <Table.HeadCell>email</Table.HeadCell>
                  <Table.HeadCell>Admin</Table.HeadCell>
                  <Table.HeadCell>Delete</Table.HeadCell>

                </Table.Head>

                {
                  users.map((user) => (
                    <Table.Body key={user._id} className='divide-y'>
                      <Table.Row className='font-semibold bg-white dark:border-gray-700 dark:bg-gray-800'>
                        <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>

                          <img src={user.profilePic} alt={user.username}
                            className='w-10 h-10 rounded-full object-cover bg-gray-500 hover:scale-110 transition-scale duration-100'
                          />

                        </Table.Cell>

                        <Table.Cell className='text-gray-900 dark:text-white'>                          
                            {user.username}                          
                        </Table.Cell>

                        <Table.Cell>
                          {user.email}
                        </Table.Cell>
                        <Table.Cell>
                          {user.isAdmin ? (<FaCheck className='text-green-500' />): (<FaTimes className='text-red-500' />)}
                        </Table.Cell>

                        <Table.Cell>
                          <div className="flex items-center gap-1 justify-center text-red-600 cursor-pointer">
                            <MdDelete className=' hover:rotate-3' />
                            <span onClick={() => {
                              setShowModal(true)
                                setUserIdToDelete(user._id)
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
          : (<p className='text-2xl text-blue-400 text-center mt-4'>No user available!</p>)
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
              Are you sure you want to delete this user?
            </h3>

            <div className="flex justify-center gap-4">
              <Button color="failure"
                onClick={handleDeleteUser}
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
