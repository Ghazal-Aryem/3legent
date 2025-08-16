'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiMapPin, 
  FiShoppingBag, 
  FiHeart, 
  FiLogOut,
  FiChevronLeft,
  FiEdit2,
  FiChevronDown,
  FiChevronUp
} from 'react-icons/fi';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import NavBar from '@/components/Navbar';
import NewsLatter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import AccountDetails from '@/components/AccountDetails';
import Address from '@/components/Address';
import Orders from '@/components/OderHistory';
import Wishlist from '@/components/WishList';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, clearProfile } from '@/store/profileSlice';
import { useRouter } from 'next/navigation';

export default function MyAccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('account');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    repeat: false
  });
  const [isClient, setIsClient] = useState(false);

  // Form state initialized with empty values to avoid hydration mismatch
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    displayName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    repeatPassword: ''
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear Redux profile state
      dispatch(clearProfile());
      
      // Clear all authentication data from storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('profile');
        localStorage.removeItem('firebaseIdToken');
        localStorage.removeItem('firebaseUid');
        sessionStorage.removeItem('firebaseIdToken');
        sessionStorage.removeItem('firebaseUid');
      }
      
      // Redirect to login page
      router.push('/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Update form data only on client side after mount
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        currentPassword: '',
        newPassword: '',
        repeatPassword: ''
      });
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const navItems = [
    { id: 'account', icon: FiUser, label: 'Account' },
    { id: 'address', icon: FiMapPin, label: 'Address' },
    { id: 'orders', icon: FiShoppingBag, label: 'Orders' },
    { id: 'wishlist', icon: FiHeart, label: 'Wishlist' },
    { 
      id: 'logout', 
      icon: FiLogOut, 
      label: 'Log Out',
      action: handleLogout
    },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'address':
        return <AddressTab />;
      case 'orders':
        return <OrdersTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'logout':
        // The actual logout happens when clicking the menu item
        return null;
      default:
        return (
          <AccountDetails 
            formData={formData}
            handleInputChange={handleInputChange}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        );
    }
  };

  if (!isClient) {
    // Return a simple loading state during SSR
    return (
      <div className="MyAccount">
        <NavBar />
        <div className="bg-white min-h-screen mt-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="MyAccount">
      <NavBar />
      
      <div className="bg-white min-h-screen mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button 
            onClick={() => router.back()} 
            className="flex items-center text-gray-600 hover:text-black mb-6"
          >
            <FiChevronLeft className="mr-1" /> Back
          </button>
          
          <h1 className="text-3xl font-medium mb-6">My Account</h1>
          
          {/* Mobile Dropdown Menu */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-lg"
            >
              <div className="flex items-center">
                {(() => {
                  const activeItem = navItems.find(item => item.id === activeTab);
                  return (
                    <>
                      {activeItem?.icon && <activeItem.icon className="mr-3" />}
                      <span>{activeItem?.label || 'Menu'}</span>
                    </>
                  );
                })()}
              </div>
              {mobileMenuOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action(); // Execute logout action if exists
                      } else {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }
                    }}
                    className={`w-full flex items-center py-3 px-4 text-left transition ${
                      activeTab === item.id
                        ? 'bg-gray-100 text-black'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Hidden on mobile */}
            <div className="hidden lg:block w-full lg:w-1/4 bg-gray-50 rounded-lg p-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden">
                    <img 
                      src="https://placehold.co/80x80" 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full">
                    <FiEdit2 size={14} />
                  </button>
                </div>
                <h2 className="text-xl font-semibold">
                  {currentUser?.displayName || 'Guest'}
                </h2>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) {
                        item.action(); // Execute logout action if exists
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`w-full flex items-center py-3 px-4 rounded-md text-left transition ${
                      activeTab === item.id
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="w-full lg:w-3/4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      <NewsLatter />
      <Footer />
    </div>
  );
}

// Placeholder components for other tabs
const AddressTab = () => (
  <div className="bg-white p-6 rounded-lg">
   <Address/>
  </div>
);

const OrdersTab = () => (
  <div className="bg-white p-6 rounded-lg">
   <Orders/>
  </div>
);

const WishlistTab = () => (
  <div className="bg-white p-6 rounded-lg">
    <Wishlist/>
  </div>
);