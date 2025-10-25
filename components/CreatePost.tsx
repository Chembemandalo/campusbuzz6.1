import React, { useState, useRef, ChangeEvent } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { User } from '../types';
import { PhotoIcon, SparklesIcon, XCircleIcon, SpinnerIcon } from './icons';

interface CreatePostProps {
  currentUser: User;
  onCreatePost: (content: string, image: string | null) => Promise<void>;
  onPostCreated?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ currentUser, onCreatePost, onPostCreated }) => {
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateImage = async () => {
    if (!postText.trim()) {
      alert('Please enter a description to generate an image.');
      return;
    }
    setIsGenerating(true);
    setImagePreview(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: postText }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
          setImagePreview(imageUrl);
          break; // Assuming one image is generated
        }
      }
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handlePostSubmit = async () => {
    if ((!postText.trim() && !imagePreview) || isSubmitting) return;

    setIsSubmitting(true);
    await onCreatePost(postText, imagePreview);
    setPostText('');
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    setIsSubmitting(false);
    onPostCreated?.();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex space-x-3">
        {/* Campus Buzz: Current user's avatar in the Create Post component */}
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-12 h-12 rounded-full" />
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder={`Share what are you thinking...`}
          className="w-full bg-gray-100 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={3}
        />
      </div>

      {(imagePreview || isGenerating) && (
        <div className="mt-4 relative flex justify-center items-center bg-gray-100 rounded-lg p-2 min-h-[200px]">
          {isGenerating ? (
            <div className="flex flex-col items-center text-gray-500">
                <SparklesIcon className="w-8 h-8 animate-pulse text-purple-500" />
                <p className="mt-2 text-sm font-semibold">Generating your image...</p>
                <p className="text-xs">This might take a moment.</p>
            </div>
          ) : (
            imagePreview && (
              <>
                {/* Campus Buzz: Image preview for a new post (uploaded or generated) */}
                <img src={imagePreview} alt="Post preview" className="rounded-lg max-h-80 object-contain" />
                <button 
                  onClick={removeImage} 
                  className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75 transition-colors"
                  aria-label="Remove image"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </>
            )
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
      
      <div className="flex justify-between items-center pt-4 mt-2 border-t">
        <div className="flex space-x-1 sm:space-x-2">
            <button 
                onClick={triggerFileUpload}
                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors"
            >
                <PhotoIcon className="w-5 h-5 text-green-500" />
                <span className="hidden sm:inline">Photo</span>
            </button>
            <button 
                onClick={handleGenerateImage}
                disabled={isGenerating || !postText.trim()}
                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-gray-100 text-gray-600 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <SparklesIcon className="w-5 h-5 text-purple-500" />
                <span className="hidden sm:inline">Generate</span>
            </button>
        </div>
        <button 
            onClick={handlePostSubmit}
            disabled={(!postText.trim() && !imagePreview) || isGenerating || isSubmitting}
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors w-24 flex justify-center"
        >
          {isSubmitting ? <SpinnerIcon /> : 'Post'}
        </button>
      </div>
    </div>
  );
};

export default CreatePost;