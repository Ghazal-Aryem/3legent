'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/lib/firebase';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '@/store/profileSlice';

const Address = () => {
   const currentUser = useSelector(selectCurrentUser);
  const [uid, setUid] = useState(null);
  useEffect(() => {
  const user = auth.currentUser;
  if (user) {
    console.log('Current User:', user);
    setUid(user.uid);
  } else {
    console.error('No authenticated user found');
    // Optionally redirect or show a message
  }
}, []);
  const [billingAddress, setBillingAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch address data on component mount
  useEffect(() => {
    if (!uid) return;

  const fetchAddressData = async () => {
    try {
      setIsLoading(true);
      const token =
        localStorage.getItem('firebaseIdToken') ||
        sessionStorage.getItem('firebaseIdToken');

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/address/${uid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'success') {
        setBillingAddress(response.data.data.billing);
        setShippingAddress(response.data.data.shipping);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to fetch address data'
      );
      console.error('Error fetching address:', err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchAddressData();
}, [uid]);


  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({ ...prev, [name]: value }));
  };

  const saveBillingAddress = async () => {
    try {
      setIsLoading(true);
      await updateAddress({ billing: billingAddress, shipping: shippingAddress });
      setIsEditingBilling(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update billing address');
      console.error('Error updating billing address:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveShippingAddress = async () => {
    try {
      setIsLoading(true);
      await updateAddress({ billing: billingAddress, shipping: shippingAddress });
      setIsEditingShipping(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update shipping address');
      console.error('Error updating shipping address:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (addressData) => {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/address/${uid}`, addressData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('firebaseIdToken') || sessionStorage.getItem('firebaseIdToken')}`
      }
    });
    return response.data;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Address</h1>
        <div className="flex justify-center items-center h-40">
          <p>Loading address information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Address</h1>
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-6">Address</h1>

      {/* Billing Address */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Billing Address</h2>
          {!isEditingBilling ? (
            <button 
              onClick={() => setIsEditingBilling(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={isLoading}
            >
              Edit
            </button>
          ) : (
            <button 
              onClick={saveBillingAddress}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        {!isEditingBilling ? (
          <div className="space-y-2">
            <p className="text-gray-800">{billingAddress.name || 'Not provided'}</p>
            <p className="text-gray-600">{billingAddress.phone || 'Not provided'}</p>
            <p className="text-gray-600">{billingAddress.address || 'Not provided'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={billingAddress.name}
              onChange={handleBillingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Full Name"
              disabled={isLoading}
            />
            <input
              type="text"
              name="phone"
              value={billingAddress.phone}
              onChange={handleBillingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Phone Number"
              disabled={isLoading}
            />
            <textarea
              name="address"
              value={billingAddress.address}
              onChange={handleBillingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              placeholder="Full Address"
              disabled={isLoading}
            />
          </div>
        )}
      </div>

      {/* Shipping Address */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Shipping Address</h2>
          {!isEditingShipping ? (
            <button 
              onClick={() => setIsEditingShipping(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              disabled={isLoading}
            >
              Edit
            </button>
          ) : (
            <button 
              onClick={saveShippingAddress}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          )}
        </div>

        {!isEditingShipping ? (
          <div className="space-y-2">
            <p className="text-gray-800">{shippingAddress.name || 'Not provided'}</p>
            <p className="text-gray-600">{shippingAddress.phone || 'Not provided'}</p>
            <p className="text-gray-600">{shippingAddress.address || 'Not provided'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={shippingAddress.name}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Full Name"
              disabled={isLoading}
            />
            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Phone Number"
              disabled={isLoading}
            />
            <textarea
              name="address"
              value={shippingAddress.address}
              onChange={handleShippingChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="3"
              placeholder="Full Address"
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;