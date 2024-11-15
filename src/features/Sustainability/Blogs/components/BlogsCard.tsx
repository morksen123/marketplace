import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Blog, BlogCategory } from '../constants/index.ts';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogsCardProps {
  blog: Blog;
}

const BlogsCard: React.FC<BlogsCardProps> = ({ blog }) => {
  const navigate = useNavigate();
  const mainImage = blog.sections[0]?.content || '/placeholder-image.jpg';

  const handleClick = () => {
    navigate(`/blogs/${blog.blogId}`);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="group h-full overflow-hidden bg-white hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col" 
        onClick={handleClick}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
          <motion.img 
            src={mainImage} 
            alt={blog.title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute top-4 left-4 z-20">
            <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm font-medium px-3 py-1">
              {blog.category ? BlogCategory[blog.category] : '-'}
            </Badge>
          </div>
        </div>

        <CardHeader className="flex-1 flex flex-col gap-3 p-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(blog.createdOn).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {`${Math.ceil(blog.sections.length * 0.8)} min read`}
            </div>
          </div>

          <CardTitle className="text-xl font-bold line-clamp-2">
          {truncateText(blog.title, 50)}
          </CardTitle>

          <p className="text-muted-foreground text-sm line-clamp-2">
          {truncateText(blog.subtitle || "No description available", 100)}
          </p>

        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default BlogsCard;
