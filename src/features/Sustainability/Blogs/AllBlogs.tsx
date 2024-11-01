import React, { useEffect, useState } from 'react';
import BlogsCard from './components/BlogsCard';
import { Blog } from './constants/index.ts';
import { useNavigate } from 'react-router-dom';

export const AllBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog/published', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          // Sort blogs by creation date (newest first)
          const sortedBlogs = data.sort((a: Blog, b: Blog) =>
            new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
          );
          setBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Featured blog skeleton */}
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="h-[600px] bg-gray-200 rounded-2xl animate-pulse" />
          </div>
          {/* Secondary blogs skeleton */}
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-[200px] bg-gray-200 rounded-xl animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-16">
          {/* Featured/Main Blog */}
          {blogs.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Featured Story</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
              </div>
              <div 
                className="relative group rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:shadow-2xl"
                onClick={() => navigate(`/blogs/${blogs[0].blogId}`)}
              >
                <div className="aspect-[16/9] md:aspect-[21/9]">
                  <img
                    src={blogs[0].sections[0]?.content || '/placeholder-image.jpg'}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 right-0 p-8 md:p-12">
                    <div className="space-y-4 transform transition-transform duration-300 group-hover:translate-y-[-8px] text-right">
                      <span className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm">
                        Featured
                      </span>
                      <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">{blogs[0].title}</h1>
                      <p className="text-lg md:text-xl text-gray-200 line-clamp-2 max-w-3xl ml-auto">{blogs[0].subtitle}</p>
                      <div className="flex items-center gap-4 text-gray-300 text-sm justify-end">
                        <span>{new Date(blogs[0].createdOn).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                        <span>•</span>
                        <span>Read article →</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Secondary Blogs Section */}
          <section className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.length > 1 ? (
                blogs.slice(1).map((blog) => (
                  <BlogsCard key={blog.blogId} blog={blog} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500">
                  <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14" />
                  </svg>
                  <p className="text-xl font-medium">No articles available</p>
                  <p className="text-gray-400">Check back soon for new content</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
