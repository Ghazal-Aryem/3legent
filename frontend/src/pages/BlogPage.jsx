import React, { useState } from 'react';
import { FiChevronDown, FiGrid, FiList, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const BlogPage = () => {
  // Sample blog data from the screenshot
  const allBlogs = [
    { 
      title: "7 ways to decor your home like a professional", 
      author: "Graham HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Inside a beautiful kitchen organization", 
      author: "Chicken HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Decor your bedroom for your children", 
      author: "Chicken HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Modern texas home is beautiful and completely kid-friendly", 
      author: "Graham HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Modern texas home is beautiful and completely kid-friendly", 
      author: "Chicken HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Modern texas home is beautiful and completely kid-friendly", 
      author: "Graham HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Modern texas home is beautiful and completely kid-friendly", 
      author: "Graham HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
    { 
      title: "Modern texas home is beautiful and completely kid-friendly", 
      author: "Graham HK", 
      date: "2013", 
      image: "https://placehold.co/357x325" 
    },
  ];

  const [activeTab, setActiveTab] = useState('All Blog');
  const [sortBy, setSortBy] = useState('Latest');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleShowMore = () => {
    setVisibleBlogs(prev => prev + 3);
  };

  const handleShowLess = () => {
    setVisibleBlogs(6);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const sortedBlogs = [...allBlogs].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'Latest') {
      comparison = new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'Author') {
      comparison = a.author.localeCompare(b.author);
    } else {
      comparison = a.title.localeCompare(b.title);
    }
    
    return sortDirection === 'desc' ? comparison : -comparison;
  });

  const displayedBlogs = sortedBlogs.slice(0, visibleBlogs);
  const canShowLess = visibleBlogs > 6;
  const canShowMore = visibleBlogs < allBlogs.length;

  return (
    <div className="pt-6 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with tabs and sorting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex justify-start items-center gap-4 md:gap-10">
            <button
              onClick={() => setActiveTab('All Blog')}
              className={`pb-2 ${activeTab === 'All Blog' ? 'border-b border-neutral-900 text-neutral-900' : 'text-zinc-500'}`}
            >
              <span className="text-sm font-semibold font-['Inter'] leading-snug">All Blog</span>
            </button>
            <button
              onClick={() => setActiveTab('Featured')}
              className={`pb-2 ${activeTab === 'Featured' ? 'border-b border-neutral-900 text-neutral-900' : 'text-zinc-500'}`}
            >
              <span className="text-sm font-semibold font-['Inter'] leading-snug">Featured</span>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-neutral-900 text-neutral-900 text-base font-semibold font-['Inter'] leading-relaxed pr-8 appearance-none bg-transparent focus:outline-none"
                >
                  <option value="Latest">Latest</option>
                  <option value="Author">Author</option>
                  <option value="Title">Title</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <button 
                onClick={toggleSortDirection}
                className="text-neutral-900 hover:bg-gray-100 p-1 rounded"
                aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
              >
                {sortDirection === 'asc' ? <FiArrowUp size={18} /> : <FiArrowDown size={18} />}
              </button>
            </div>
            
            <div className="flex border border-gray-200 rounded overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')} 
                className={`w-10 h-10 flex items-center justify-center ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                aria-label="Grid view"
              >
                <FiGrid className={viewMode === 'grid' ? 'text-neutral-900' : 'text-zinc-500'} />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={`w-10 h-10 flex items-center justify-center ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors`}
                aria-label="List view"
              >
                <FiList className={viewMode === 'list' ? 'text-neutral-900' : 'text-zinc-500'} />
              </button>
            </div>
          </div>
        </div>

        {/* Blog posts */}
        <div className="pb-20">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBlogs.map((blog, index) => (
                <div key={index} className="flex flex-col gap-6">
                  <div className="w-full h-80 overflow-hidden rounded-lg">
                    <img className="w-full h-full object-cover" src={blog.image} alt={blog.title} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-zinc-800 text-xl font-medium font-['Poppins'] leading-7">{blog.title}</h3>
                    <p className="text-zinc-500 text-xs font-normal font-['Inter'] leading-tight">
                      {blog.date} • {blog.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {displayedBlogs.map((blog, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 h-64 overflow-hidden rounded-lg">
                    <img className="w-full h-full object-cover" src={blog.image} alt={blog.title} />
                  </div>
                  <div className="w-full md:w-2/3 flex flex-col gap-2">
                    <h3 className="text-zinc-800 text-xl font-medium font-['Poppins'] leading-7">{blog.title}</h3>
                    <p className="text-zinc-500 text-xs font-normal font-['Inter'] leading-tight">
                      {blog.date} • {blog.author}
                    </p>
                    <p className="text-zinc-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-20 text-center space-y-4">
            {canShowMore && (
              <button
                onClick={handleShowMore}
                className="px-10 py-1.5 rounded-[80px] border border-neutral-900 inline-flex justify-center items-center gap-2 hover:bg-neutral-100 transition-colors mx-2"
              >
                <span className="text-center text-neutral-900 text-base font-medium font-['Inter'] leading-7">
                  Show more
                </span>
              </button>
            )}
            {canShowLess && (
              <button
                onClick={handleShowLess}
                className="px-10 py-1.5 rounded-[80px] border border-neutral-900 inline-flex justify-center items-center gap-2 hover:bg-neutral-100 transition-colors mx-2"
              >
                <span className="text-center text-neutral-900 text-base font-medium font-['Inter'] leading-7">
                  Show less
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;