import { Button, Table } from "flowbite-react";
import { useEffect, useState } from "react"
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function DashboardComp() {
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [lastMonthUsers, setLastMonthUsers] = useState(0);
    const [lastMonthPosts, setLastMonthPosts] = useState(0);
    const [lastMonthComments, setLastMonthComments] = useState(0);
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`/api/user/getusers?limit=5`);
                const data = await res.json();
                if (res.ok) {
                    setUsers(data.users);
                    setTotalUsers(data.totalUsers);
                    setLastMonthUsers(data.lastMonthUsers);
                }
            } catch (error) {
                console.error(error.message);
            }

        };

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/get-posts?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPosts(data.totalPosts);
                    setLastMonthPosts(data.lastMonthPosts);
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        const fetchComments = async () => {
            try {
                const res = await fetch('/api/comment/getComments?limit=5');
                const data = await res.json();
                if (res.ok) {
                    setComments(data.comments);
                    setTotalComments(data.totalComments);
                    setLastMonthComments(data.lastMonthComments);
                }
            } catch (error) {
                console.error(error.message);
            }
        };

        if (currentUser.isAdmin) {
            fetchUsers();
            fetchPosts();
            fetchComments();
        }
    }, [currentUser]);
    return (
        <section className="p-3 md:mx-auto">
            <section className="flex gap-4 flex-wrap justify-center">
                {/* --user section-- */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 uppercase">Total Users</h3>
                            <p className="text-2xl">{totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthUsers}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                {/* --comment section-- */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 uppercase">Total comments</h3>
                            <p className="text-2xl">{totalComments}</p>
                        </div>
                        <HiAnnotation className="bg-indigo-500 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthComments}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>

                {/* --post section-- */}
                <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
                    <div className="flex justify-between">
                        <div className="">
                            <h3 className="text-gray-500 uppercase">Total posts</h3>
                            <p className="text-2xl">{totalPosts}</p>
                        </div>
                        <HiDocumentText className="bg-teal-500 text-white rounded-full text-5xl p-3 shadow-lg" />
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-green-500 flex items-center">
                            <HiArrowNarrowUp />
                            {lastMonthPosts}
                        </span>
                        <div className="text-gray-500">Last Month</div>
                    </div>
                </div>
            </section>

            <section className="mt-5 flex flex-wrap gap-4 py-4 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Users</h1>
                        <Button outline gradientDuoTone={'purpleToPink'} className="font-semibold">
                            <Link to={`/dashboard?tab=users`}>
                                See all
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable >
                        <Table.Head>
                            <Table.HeadCell>user image</Table.HeadCell>
                            <Table.HeadCell>username</Table.HeadCell>
                        </Table.Head>
                        {users && users.map((user) => (
                            <Table.Body key={user._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                    <Table.Cell>
                                        <img src={user.profilePic}
                                            alt={'user'}
                                            className="w-10 h-10 rounded-full bg-gray-500"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        {user.username}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Comments</h1>
                        <Button outline gradientDuoTone={'purpleToPink'} className="font-semibold">
                            <Link to={`/dashboard?tab=comments`}>
                                See all
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable >
                        <Table.Head>
                            <Table.HeadCell>comment content</Table.HeadCell>
                            <Table.HeadCell>likes</Table.HeadCell>
                        </Table.Head>
                        {comments && comments.map((comment) => (
                            <Table.Body key={comment._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                    <Table.Cell className="w-96">
                                        <p className="line-clamp-2">{comment.content}</p>
                                    </Table.Cell>
                                    <Table.Cell>
                                        {comment.numberOfLikes}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>

                <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Recent Posts</h1>
                        <Button outline gradientDuoTone={'purpleToPink'} className="font-semibold">
                            <Link to={`/dashboard?tab=posts`}>
                                See all
                            </Link>
                        </Button>
                    </div>

                    <Table hoverable >
                        <Table.Head>
                            <Table.HeadCell>post image</Table.HeadCell>
                            <Table.HeadCell>post title</Table.HeadCell>
                            <Table.HeadCell>category</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post._id} className="divide-y">
                                <Table.Row className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                    <Table.Cell>
                                        <img src={post.image}
                                            alt={'user'}
                                            className="w-14 h-10 rounded-md bg-gray-500"
                                        />
                                    </Table.Cell>
                                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                                    <Table.Cell className="w-5">{post.category}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        ))}
                    </Table>
                </div>
            </section>
        </section>
    )
};
