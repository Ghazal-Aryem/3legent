'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setProfile } from '@/store/profileSlice';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function SigninPage() {
  const dispatch = useDispatch();
  const router = useRouter();
   
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const successMsg = searchParams.get('successMessage');
    if (successMsg) {
      setSuccessMessage(successMsg);
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    
    const firebaseResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
      {
        email: formData.email,
        password: formData.password,
        returnSecureToken: true
      }
    );
    
    const { idToken, localId: uid } = firebaseResponse.data;
    console.log('Firebase auth successful. UID:', uid , 'idToken:', idToken);

  
    try {
      const backendResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${uid}`,
        {
          headers: { 
            'Authorization': `Bearer ${idToken}` 
          }
          
        }
      );
      console.log('Backend response:', backendResponse.data);
      if (backendResponse.data.status === 'error') {
        if (backendResponse.data.code === 'USER_NOT_FOUND') {
          // Handle case where user exists in Firebase but not in your DB
          throw new Error('User account not properly set up');
        }
        throw new Error(backendResponse.data.message);
      }

      const userData = backendResponse.data.data;
      
      dispatch(setProfile({
        id: uid,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        displayName: `${userData.first_name} ${userData.last_name}`,
        userName: userData.username,
      }));

      // Store tokens
      if (formData.rememberMe) {
        localStorage.setItem('firebaseIdToken', idToken);
        localStorage.setItem('firebaseUid', uid);
      } else {
        sessionStorage.setItem('firebaseIdToken', idToken);
        sessionStorage.setItem('firebaseUid', uid);
      }
      console.log("session id",sessionStorage.getItem('firebaseIdToken'), sessionStorage.getItem('firebaseUid'));
      router.push('/');

    } catch (backendError) {
      console.error('Backend error:', backendError.response?.data || backendError.message);
      
      let errorMessage = 'Failed to load user data';
      if (backendError.response?.data?.message) {
        errorMessage = backendError.response.data.message;
      }
      
      throw new Error(errorMessage);
    }

  } catch (firebaseError) {
    console.error('Authentication error:', firebaseError);
    
    let errorMessage = 'Login failed. Please try again.';
    if (firebaseError.response?.data?.error) {
      switch (firebaseError.response.data.error.message) {
        case 'EMAIL_NOT_FOUND':
        case 'INVALID_PASSWORD':
          errorMessage = 'Invalid email or password';
          break;
        case 'USER_DISABLED':
          errorMessage = 'This account has been disabled';
          break;
        default:
          errorMessage = firebaseError.response.data.error.message;
      }
    } else if (firebaseError.message) {
      errorMessage = firebaseError.message;
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleGoogleSignIn = async () => {
  try {
    setGoogleLoading(true);
    setError('');
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    console.log('Google User:', user, 'ID Token:', idToken);
    // First try to get user data
    try {
      const backendResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${user.uid}`,
        {
          headers: { 
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
            
          }
         
        }
      );

      const userData = backendResponse.data.data;
      console.log("user profile" ,userData )
      dispatch(setProfile({
        id: user.uid,
        firstName: userData.first_name,
        lastName: userData.last_name,
        email: userData.email,
        displayName: `${userData.first_name} ${userData.last_name}`,
        userName: userData.username,
      }));
      
    } catch (error) {
      // If user doesn't exist, create them
      if (error.response?.status === 401 || error.response?.status === 404) {
        router.push(`/signup`)
      } else {
        throw error;
      }
    }

    sessionStorage.setItem('firebaseIdToken', idToken);
    sessionStorage.setItem('firebaseUid', user.uid);
    // console.log("session id",sessionStorage.getItem('firebaseIdToken'), sessionStorage.getItem('firebaseUid'));
  
    router.push('/');

  } catch (error) {
    console.error('Google sign-in error:', error);
    setError(error.response?.data?.message || 'Google sign-in failed');
    if (error.code === 'auth/popup-closed-by-user') {
      setError('Sign-in was canceled');
    }
  } finally {
    setGoogleLoading(false);
  }
};

  if (!isMounted) {
    return null;
  }
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row py-16 px-4 md:px-0">
      <div className="w-full h-full md:w-1/2 px-5 relative" style={{ minHeight: '500px' }}>
        <Image 
          src="/assets/signin_pic.jpg"
          alt="Decorative background" 
          fill
          className="object-contain"
          priority
          // sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-medium font-poppins text-neutral-900">Sign In</h1>
            <p className="mt-2 text-base font-inter text-zinc-500">
              Don't have an account yet?{' '}
              <a href="/signup" className="text-emerald-400 font-semibold hover:underline">Sign Up</a>
            </p>
          </div>
          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500"
                />
              </div>
              <div className="border-b border-gray-200 pb-2 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500 pr-8"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-2 text-zinc-500 hover:text-neutral-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5C5 5 1 12 1 12C1 12 5 19 12 19C19 19 23 12 23 12C23 12 19 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5C5 5 1 12 1 12C1 12 5 19 12 19C19 19 23 12 23 12C23 12 19 5 12 5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 2L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-zinc-500 text-emerald-400 focus:ring-emerald-400"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-base font-inter text-zinc-500">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-base font-inter font-semibold text-neutral-900 hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neutral-900 rounded-lg text-white text-base font-inter font-medium hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

