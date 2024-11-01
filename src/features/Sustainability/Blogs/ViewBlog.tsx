import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Blog } from './constants';
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar, User, Clock } from "lucide-react";
import { BlogCategory } from './constants';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import BlogsCard from './components/BlogsCard';

export const ViewBlog = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`/api/blog/${blogId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedBlogs = async () => {
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
          const sortedBlogs = data
            .sort((a: Blog, b: Blog) => 
              new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
            )
            .filter((b: Blog) => b.blogId !== blogId)
            .slice(0, 5);
          setRelatedBlogs(sortedBlogs);
        }
      } catch (error) {
        console.error('Error fetching related blogs:', error);
      }
    };

    fetchBlog();
    fetchRelatedBlogs();
  }, [blogId]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(relatedBlogs.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(relatedBlogs.length / 3) - 1 : prev - 1
    );
  };

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  if (loading) {
    return (
      <div className="wrapper max-w-4xl mx-auto">
        <Skeleton className="h-[400px] w-full mb-8 rounded-xl" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/4 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return <div className="wrapper">Blog not found</div>;
  }

  return (
    <motion.article 
      className="wrapper max-w-4xl mx-auto"
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      {/* Main Image */}
      <motion.div 
        className="relative w-full h-[500px] mb-12 overflow-hidden rounded-xl shadow-lg"
        variants={fadeIn}
      >
        <img
          src={blog.sections[0]?.content || '/placeholder-image.jpg'}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </motion.div>

      {/* Blog Header */}
      <div className="mb-12">
        <motion.div 
          className="flex items-center gap-4 mb-6"
          variants={fadeIn}
        >
          <Badge variant="secondary" className="px-4 py-1 text-sm">
            {blog.category ? BlogCategory[blog.category] : '-'}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground gap-4">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(blog.createdOn).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              GudFood Team
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {`${Math.ceil(blog.sections.length * 0.8)} min read`}
            </span>
          </div>
        </motion.div>

        <motion.h1 
          className="text-5xl font-bold mb-2 text-left leading-tight"
          variants={fadeIn}
        >
          {blog.title}
        </motion.h1>
        
        <motion.p 
          className="text-2xl text-muted-foreground mb-8 text-left leading-relaxed"
          variants={fadeIn}
        >
          {blog.subtitle}
        </motion.p>

        {/* Blog Content */}
        <motion.div 
          className="prose prose-lg max-w-none"
          variants={fadeIn}
        >
          {blog.sections.slice(1).map((section, index) => (
            <motion.div 
              key={index} 
              className="mb-8"
              variants={fadeIn}
              transition={{ delay: index * 0.1 }}
            >
              {section.type === 'TEXT' ? (
                <p 
                  className="text-l text-left leading-relaxed text-gray-700"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(section.content)
                  }}
                />
              ) : (
                <img
                  src={section.content}
                  alt={`Blog content ${index}`}
                  className="w-[800px] h-[400px] object-cover mx-auto rounded-lg transition-transform duration-300 hover:scale-105"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Related Blogs Carousel */}
        {relatedBlogs.length > 0 && (
          <motion.div 
            className="mt-16"
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold mb-8">Read More Like This</h2>
            <div className="relative">
              <div className="flex gap-6 transition-all duration-500 ease-in-out" 
                   style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {relatedBlogs.slice(0, 3).map((relatedBlog) => (
                  <div key={relatedBlog.blogId} className="min-w-[calc(33.333%-1rem)]">
                    <BlogsCard blog={relatedBlog} onClick={() => navigate(`/blogs/${relatedBlog.blogId}`)} />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.article>
  );
};
