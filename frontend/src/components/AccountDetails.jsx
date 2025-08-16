'use client';
import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateProfile } from '@/store/profileSlice';
import { auth } from '@/lib/firebase';
import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import axios from 'axios';

const AccountDetails = ({ formData, handleInputChange, showPassword, togglePasswordVisibility }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // Prepare the update data
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email
      };

      // Check if email needs to be updated
      if (formData.email !== currentUser.email) {
        await updateEmail(user, formData.email);
      }

      // Check if password needs to be updated
      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error('Current password is required to update password');
        }
        if (formData.newPassword !== formData.repeatPassword) {
          throw new Error('New passwords do not match');
        }

        // Reauthenticate user before password change
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          formData.currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, formData.newPassword);
      }
      console.log(localStorage.getItem('firebaseIdToken'));
      // Update profile in your backend
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profile/${user.uid}`, updateData, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('firebaseIdToken') || localStorage.getItem('firebaseIdToken')}`
        }
      });

      // Update Redux store
      dispatch(updateProfile(updateData));

      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
      <div className="">
        <h2 className="text-xl font-semibold">Account Details</h2>
        
        {/* Error/Success messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">First name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Last name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Display name *</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be how your name will be displayed in the account section and in reviews
            </p>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-6 mt-10">
        <h2 className="text-xl font-semibold">Password</h2>
        
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Old password</label>
            <input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10"
              placeholder="Enter current password to change"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-8 text-gray-500"
            >
              {showPassword.current ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">New password</label>
            <input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10"
              placeholder="Leave empty to keep current"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-8 text-gray-500"
            >
              {showPassword.new ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          
          <div className="relative">
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Repeat new password</label>
            <input
              type={showPassword.repeat ? "text" : "password"}
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10"
              placeholder="Leave empty to keep current"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('repeat')}
              className="absolute right-3 top-8 text-gray-500"
            >
              {showPassword.repeat ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        
        <button
          type="submit"
          className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
          disabled={isUpdating}
        >
          {isUpdating ? 'Updating...' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};

export default AccountDetails;