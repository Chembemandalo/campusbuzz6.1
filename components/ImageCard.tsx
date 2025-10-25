import React from 'react';
import { Post, Page } from '../types';

interface ImageCardProps {
    post: Post;
    onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ post, onClick }) => {
    return (
        <div 
            className="mb-4 break-inside-avoid relative rounded-lg overflow-hidden group cursor-pointer"
            onClick={onClick}
        >
            {post.imageUrl && <img src={post.imageUrl} alt={post.content.substring(0, 50)} className="w-full h-auto" />}
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div></div>
                <div className="flex items-center">
                    <img src={post.author.avatarUrl} alt={post.author.name} className="w-8 h-8 rounded-full border-2 border-white" />
                    <p className="ml-2 text-white font-semibold text-sm truncate">{post.author.name}</p>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;