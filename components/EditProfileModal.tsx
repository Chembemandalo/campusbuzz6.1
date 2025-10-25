import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { User } from '../types';
import { SpinnerIcon, CameraIcon } from './icons';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateProfile: (updatedData: Partial<User>) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, currentUser, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    major: '',
    department: '',
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name,
        bio: currentUser.bio,
        major: currentUser.major,
        department: currentUser.department,
      });
      setProfilePicPreview(currentUser.avatarUrl);
      setCoverPhotoPreview(currentUser.coverPhotoUrl);
    }
  }, [currentUser, isOpen]); // Rerun effect when modal opens

  if (!isOpen) {
    return null;
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfilePicPreview(reader.result as string);
        } else {
          setCoverPhotoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    
    const updatedData: Partial<User> = {
      ...formData,
      avatarUrl: profilePicPreview || currentUser.avatarUrl,
      coverPhotoUrl: coverPhotoPreview || currentUser.coverPhotoUrl
    };
    
    await onUpdateProfile(updatedData);
    setIsSaving(false);
    // onClose will be called by parent component after update
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
            <div className="p-6">
                {/* Cover and Profile Photo */}
                <div className="relative mb-16">
                    <div className="h-40 bg-gray-200 rounded-lg relative group">
                        <img src={coverPhotoPreview || ''} alt="Cover preview" className="w-full h-full object-cover rounded-lg"/>
                         <label htmlFor="cover-photo-upload" className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <CameraIcon className="w-8 h-8"/>
                        </label>
                        <input type="file" id="cover-photo-upload" ref={coverPhotoInputRef} onChange={(e) => handleFileChange(e, 'cover')} className="hidden" accept="image/*" />
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">
                         <div className="w-32 h-32 rounded-full border-4 border-white bg-white relative group">
                             <img src={profilePicPreview || ''} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
                             <label htmlFor="profile-pic-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <CameraIcon className="w-8 h-8"/>
                            </label>
                            <input type="file" id="profile-pic-upload" ref={profilePicInputRef} onChange={(e) => handleFileChange(e, 'profile')} className="hidden" accept="image/*" />
                         </div>
                    </div>
                </div>

                {/* Text Fields */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea name="bio" id="bio" value={formData.bio} onChange={handleInputChange} rows={3}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">Major</label>
                            <input type="text" name="major" id="major" value={formData.major} onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                            <input type="text" name="department" id="department" value={formData.department} onChange={handleInputChange}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 border-t flex justify-end space-x-2 sticky bottom-0 bg-white">
                <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 w-32 flex justify-center items-center disabled:bg-indigo-300"
                >
                    {isSaving ? <SpinnerIcon /> : 'Save Changes'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;