import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';


export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/get-posts');
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPosts();

  }, []);


  return (
    <section className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-xs sm:text-sm'>
          Here you can find my thoughts and ideas about programming, web development, and other related topics. <br />
          Feel free to browse through my posts and let me know what you think. <br />
          If you have any questions or feedback, please don't hesitate to contact me. <br />
          Enjoy!
        </p>

        <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 hover:underline font-bold'>
          View all posts
        </Link>
      </div>

      <div className="p-3 bg-amber-100 dark:bg-slate-700">
        <CallToAction />
      </div>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
        {
          posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h1 className='font-semibold text-2xl text-center'>Recent Posts</h1>
              <div className="flex gap-5 flex-wrap">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>

              <Link to={'/search'} className='text-xs sm:text-sm text-teal-500 hover:underline font-bold text-center'>View all posts</Link>
            </div>
          )
        }
      </div>

    </section>
  )
};
