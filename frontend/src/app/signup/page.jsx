'use client';
import React, { useState ,useEffect } from 'react';
import axios from 'axios';
// import signin from '/assets/signin.jpg';
import { useDispatch } from 'react-redux';
import { setProfile } from '@/store/profileSlice';
import { useRouter , useSearchParams  } from 'next/navigation';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function signUpPage() {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
const [isMounted, setIsMounted] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  useEffect(() => {
      setIsMounted(true);
      // Use searchParams instead of window.location
      const successMsg = searchParams.get('successMessage');
      if (successMsg) {
        setSuccessMessage(successMsg);
      }
    }, [searchParams]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleGoogleSignUp = async () => {
  try {
    setGoogleLoading(true);
    setError('');
    
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Extract first and last name from Google display name
    const nameParts = user.displayName?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    try {
      // Send user data to your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/signup`,
        {
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          username: user.email?.split('@')[0] || '',
          password: '' // No password for Google signup
        }
      );

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || 'Signup failed');
      }

      dispatch(setProfile({
        id: user.uid,
        email: user.email,
        firstName,
        lastName,
        displayName: user.displayName || `${firstName} ${lastName}`.trim(),
        userName: user.email?.split('@')[0] || ''
      }));

      // Store tokens
      const idToken = await user.getIdToken();
      sessionStorage.setItem('firebaseIdToken', idToken);
      sessionStorage.setItem('firebaseUid', user.uid);

      router.push('/');
    } catch (backendError) {
      console.error('Backend error:', backendError);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (backendError.response?.data?.message?.includes('already exists')) {
        errorMessage = 'This email is already registered. Please sign in.';
      }
      
      setError(errorMessage);
      // Optional: Sign out from Firebase if backend failed
      await auth.signOut();
    }
  } catch (error) {
    console.error('Google sign-up error:', error);
    let errorMessage = 'Google sign-up failed. Please try again.';
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-up was canceled';
    }
    
    setError(errorMessage);
  } finally {
    setGoogleLoading(false);
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.agreeTerms) {
      setError('You must agree to the Privacy Policy and Terms of Use');
      setLoading(false);
      return;
    }

    try {
      // Send signup request to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/signup`,
        {
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username
        }
      );
      
      console.log('Signup response:', response.data);
      dispatch(setProfile({
        id: response.data.uid,
        email: response.data.email,
        firstName: response.data.first_name,
        lastName: response.data.last_name,
        displayName: `${response.data.first_name} ${response.data.last_name}`,
        userName: response.data.username
      }));
      // If successful, redirect to home or login page
      router.push('/signin', { state: { successMessage: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      console.error('Signup error:', err);
      let errorMessage = 'Signup failed. Please try again.';
      
      if (err.response) {
        // Handle specific Firebase errors
        if (err.response.data.message.includes('email already exists')) {
          errorMessage = 'This email is already registered.';
        } else if (err.response.data.message.includes('weak password')) {
          errorMessage = 'Password should be at least 6 characters.';
        } else {
          errorMessage = err.response.data.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isMounted) {
    return null; // Or return a loading spinner/skeleton
  }
  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left side - Image */}
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

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-medium font-poppins text-neutral-900">Sign Up</h2>
            <p className="mt-2 text-base font-inter text-zinc-500">
              Already have an account?{' '}
              <a href="/signin" className="text-emerald-400 font-semibold hover:underline">Sign in</a>
            </p>
          </div>

          {/* Error message */}
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
          {/* Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="border-b border-gray-200 pb-2">
                <input
                  type="text"
                  name="first_name"
                  placeholder="Your first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500"
                />
              </div>

              <div className="border-b border-gray-200 pb-2">
                <input
                  type="text"
                  name="last_name"
                  placeholder="Your last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500"
                />
              </div>

              {/* Username Field */}
              <div className="border-b border-gray-200 pb-2">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500"
                />
              </div>

              {/* Email Field */}
              <div className="border-b border-gray-200 pb-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full py-2 outline-none text-base font-inter text-neutral-900 placeholder-zinc-500"
                />
              </div>

              {/* Password Field */}
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

              {/* Terms Checkbox */}
              <div className="flex items-start pt-2">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="terms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    className="w-5 h-5 rounded border-zinc-500 text-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-base font-inter text-zinc-500">
                  I agree with{' '}
                  <a href="#" className="text-neutral-900 font-semibold hover:underline">Privacy Policy</a>{' '}
                  and{' '}
                  <a href="#" className="text-neutral-900 font-semibold hover:underline">Terms of Use</a>
                </label>
              </div>
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-neutral-900 rounded-lg text-white text-base font-inter font-medium hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
          <button
            onClick={handleGoogleSignUp}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {googleLoading ? 'Signing up...' : 'Continue with Google'}
          </button>
        </div>
      </div>
    </div>
  );
}

