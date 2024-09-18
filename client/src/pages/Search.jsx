import { useEffect, useState } from 'react';
import { Button, Select, Spinner, TextInput } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm') || '';
    const sortFromUrl = urlParams.get('sort') || 'desc';
    const categoryFromUrl = urlParams.get('category') || 'uncategorized';

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl
      });
    };

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      try {
        const res = await fetch(`/api/post/get-posts?${searchQuery}`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setLoading(false);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          };
        };

      } catch (error) {
        console.error(error.message);
      }
    };

    fetchPosts();

  }, [location.search]);

  const handleChange = (event) => {
    if (event.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: event.target.value });
    }

    if (event.target.id === 'sort') {
      const order = event.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }

    if (event.target.id === 'category') {
      const category = event.target.value || 'uncategorized';
      setSidebarData({ ...sidebarData, category });
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    try {
      const res = await fetch(`/api/post/get-posts?${searchQuery}`);
      if (res.ok) {
        const data = await res.json();
        setPosts([...posts,...data.posts]);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        };
      };
    } catch (error) {
      console.error(error.message);
    }
  };


  return (
    <section className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-svh border-gray-500">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <TextInput placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Sort by:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>Reactjs</option>
              <option value='nextjs'>Nextjs</option>
              <option value='javascript'>JavaScript</option>
              <option value='python'>Python</option>
            </Select>
          </div>

          <Button type='submit' gradientDuoTone='purpleToBlue' outline className='font-semibold'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="w-full">
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts Results:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {
            !loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found.</p>
          }

          <div className="flex justify-center items-center w-full">
            {
              loading && <Spinner size={'xl'} className='' />
            }
          </div>

          {
            !loading && posts && posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          }

          {
            showMore && <div className="flex justify-center items-center w-full">
              <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-4 '>Show More</button>
            </div>
          }

        </div>
      </div>
    </section>
  )
};
