import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/get-posts?slug=${postSlug}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
        else if (!res.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }

      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchPost();

  }, [postSlug]);

  if (loading) return (
    <div className="min-h-screen flex justify-center items-center">
      <Spinner size='xl' />
    </div>
  );

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-svh">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">{post && post.title}</h1>

      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color={'gray'} pill size={'xs'}>{post && post.category}</Button>
      </Link>

      <img src={post && post.image} alt={post && post.title} className="p-3 w-full max-h-[600px] object-cover mt-10" />

      <div className="flex justify-between p-3 border-b border-slate-400 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">{post && (post.content.length / 1000).toFixed(0)} mins read</span>
      </div>

      <div dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="p-3 max-w-2xl mx-auto w-full post-content"
      >

      </div>

      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>


    </main>
  )
};
