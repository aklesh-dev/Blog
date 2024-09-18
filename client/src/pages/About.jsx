import React from 'react'

export default function About() {
  return (
    <section className="min-h-svh flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-3 text-justify">
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>About Aklesh's Blog</h1>
          <div className="text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to Aklesh's Blog! This blog is created by Aklesh Yadav as a personal project to share his knowledge and experiences in software development.
              Aklesh is a passionate developer who loves to write about coding, programming, and technology.
            </p>
            <p>
              On this blog, you will find tutorials, articles, and other resources that will help you learn and improve your programming skills.
              You can also find tutorials on various programming languages, frameworks, and tools.
            </p>
            <p>
              We encourage you leave comments on our posts and engage with other readers to help each other learn and grow.
              You can like other user comments and reply to them as well. We believe that community of learners can help each other grow and improve their skills.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
};
