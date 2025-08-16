import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductForm = ({ productId, onCancel }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: 'Sneaker',
    brandName: 'Addidas',
    sku: '',
    stockQuantity: 0,
    regularPrice: 0,
    salePrice: 0,
    tag: '',
    images: []
  });

  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${productId}`);
      setProduct({
        ...response.data,
        tag: response.data.tags?.join(', ') || ''
      });
      setPreviewImages(response.data.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs
    const newPreviewImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file,
      name: file.name
    }));

    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const handleImageDelete = (id) => {
    setPreviewImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Prepare form data for file uploads
      const formData = new FormData();
      previewImages.forEach((img, index) => {
        if (img.file) {
          formData.append(`images`, img.file);
        }
      });

      // Add product data
      const productData = {
        ...product,
        tags: product.tag.split(',').map(t => t.trim()).filter(t => t),
        images: previewImages.filter(img => !img.file).map(img => img.url) // Keep existing images
      };

      formData.append('product', JSON.stringify(productData));

      // Configure progress tracking
      const config = {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(prev => ({
            ...prev,
            overall: percentCompleted
          }));
        }
      };

      if (productId) {
        // Update existing product
        await axios.put(`/api/products/${productId}`, formData, config);
      } else {
        // Create new product
        await axios.post('/api/products', formData, config);
      }

      // On success, you might want to redirect or show a success message
      alert(`Product ${productId ? 'updated' : 'created'} successfully!`);
      onCancel(); // Close the form
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`/api/products/${productId}`);
        alert('Product deleted successfully!');
        onCancel(); // Close the form
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl inline-flex flex-col justify-center items-center gap-10 w-full max-w-6xl mx-auto">
      <div className="inline-flex justify-center items-center gap-12 w-full flex-col md:flex-row">
        {/* Left Column - Product Details */}
        <div className="bg-white rounded-2xl inline-flex flex-col justify-center items-center gap-6 w-full md:w-auto">
          {/* Product Name */}
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <div className="justify-center text-neutral-800 text-xl font-semibold">Product Name</div>
            <div className="self-stretch flex flex-col justify-center items-center gap-2">
              <div className="self-stretch flex flex-col justify-center items-center gap-1">
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <div className="justify-center text-neutral-800 text-xl font-semibold">Description</div>
            <div className="self-stretch h-44 flex flex-col justify-center items-center gap-2">
              <div className="self-stretch flex-1 flex flex-col justify-center items-center gap-1">
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="self-stretch flex-1 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                  placeholder="Enter product description"
                  required
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="self-stretch flex flex-col justify-center items-center gap-4">
            <div className="justify-center text-neutral-800 text-xl font-semibold">Category</div>
            <div className="self-stretch flex flex-col justify-center items-center gap-2">
              <div className="self-stretch flex flex-col justify-center items-center gap-1">
                <select
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                >
                  <option value="Sneaker">Sneaker</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Electronics">Electronics</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="justify-start text-neutral-800 text-xl font-semibold">Brand Name</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <input
                  type="text"
                  name="brandName"
                  value={product.brandName}
                  onChange={handleInputChange}
                  className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                  placeholder="Enter brand name"
                  required
                />
              </div>
            </div>
          </div>

          {/* SKU and Stock Quantity */}
          <div className="self-stretch inline-flex justify-start items-start gap-6 flex-col md:flex-row">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold">SKU</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <input
                    type="text"
                    name="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                    className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                    placeholder="Enter SKU"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold">Stock Quantity</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    onChange={handleNumberInput}
                    className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                    placeholder="Enter quantity"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Prices */}
          <div className="w-full inline-flex justify-start items-start gap-6 flex-col md:flex-row">
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold">Regular Price</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <input
                    type="number"
                    name="regularPrice"
                    value={product.regularPrice}
                    onChange={handleNumberInput}
                    className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                    placeholder="Enter regular price"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
              <div className="justify-start text-neutral-800 text-xl font-semibold">Sale Price</div>
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <input
                    type="number"
                    name="salePrice"
                    value={product.salePrice}
                    onChange={handleNumberInput}
                    className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                    placeholder="Enter sale price"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tag */}
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="justify-start text-neutral-800 text-xl font-semibold">Tag</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <input
                  type="text"
                  name="tag"
                  value={product.tag}
                  onChange={handleInputChange}
                  className="self-stretch h-12 px-4 py-2.5 rounded-lg shadow-[0px_4px_20px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-neutral-800"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Product Images */}
        <div className="bg-white rounded-2xl inline-flex flex-col justify-start items-end gap-6 w-full md:w-auto">
          {/* Main Image Preview */}
          <div className="w-full h-96 p-2 bg-neutral-50 rounded-2xl inline-flex justify-center items-center">
            {previewImages.length > 0 ? (
              <img
                src={previewImages[0].url}
                alt="Main product preview"
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center text-neutral-500">
                No image selected
              </div>
            )}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col justify-start items-center gap-4 w-full">
            <div className="self-stretch justify-start text-neutral-800 text-xl font-semibold">Product Gallery</div>
            <label className="w-full p-4 rounded-lg outline outline-1 outline-neutral-800 flex flex-col justify-start items-center gap-4 cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="w-16 h-16 relative overflow-hidden">
                <div className="w-12 h-11 left-[6.50px] top-[10.50px] absolute bg-sky-900 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col justify-start items-start gap-2">
                <div className="text-center justify-start text-neutral-500 text-base font-semibold">Drop your images here, or browse</div>
                <div className="self-stretch text-center justify-start text-neutral-500 text-base font-semibold">Jpeg, png are allowed</div>
              </div>
            </label>
          </div>

          {/* Image Thumbnails */}
          <div className="self-stretch flex flex-col justify-start items-end gap-6">
            {previewImages.map((image, index) => (
              <div key={image.id} className="self-stretch p-4 bg-neutral-50 rounded-lg inline-flex justify-center items-start gap-4">
                <div className="w-16 h-16 bg-black/20 rounded-lg overflow-hidden">
                  <img src={image.url} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                </div>
                <div className="self-stretch pt-2 inline-flex flex-col justify-start items-center gap-4 flex-1">
                  <div className="self-stretch justify-start text-neutral-800 text-base font-semibold truncate">
                    {image.name}
                  </div>
                  {uploadProgress[image.name] && (
                    <div className="w-full h-1 relative">
                      <div className="w-full h-1 left-0 top-0 absolute bg-indigo-500 rounded-lg" />
                      <div
                        className="h-1 left-0 top-0 absolute bg-sky-900 rounded-lg"
                        style={{ width: `${uploadProgress[image.name]}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="self-stretch py-2.5 flex justify-center items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleImageDelete(image.id)}
                    className="w-8 h-8 flex items-center justify-center text-sky-900 hover:text-sky-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="w-full inline-flex justify-end items-start gap-7">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 md:flex-none h-12 px-6 bg-neutral-800 text-white rounded-lg uppercase font-medium tracking-tight disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Update'}
        </button>
        {productId && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 md:flex-none h-12 px-6 bg-sky-900 text-white rounded-lg uppercase font-medium tracking-tight disabled:opacity-50"
          >
            Delete
          </button>
        )}
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 md:flex-none h-12 px-4 bg-white text-neutral-800 rounded-lg outline outline-1 outline-neutral-800 uppercase font-medium tracking-tight disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ProductForm;