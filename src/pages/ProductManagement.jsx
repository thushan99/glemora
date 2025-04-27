import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProductManagement = () => {
  const { api } = useAuth(); // Get the authenticated axios instance
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: 0,
    image: null,
    pngTryOnImage: null,
    sale: false,
    featured: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [tryOnImagePreview, setTryOnImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const tryOnFileInputRef = useRef(null);

  // Create API wrappers that use the authenticated api instance
  const productApiWithAuth = {
    getAllProducts: () => api.get('/products', {
      headers: { 'X-Api-Version': 'v1' }
    }),
    getProductById: (id) => api.get(`/products/${id}`, {
      headers: { 'X-Api-Version': 'v1' }
    }),
    createProduct: (productData) => {
      const formData = new FormData();
      // Add all product data to FormData as specified in backend API
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);

      // Handle optional fields
      if (productData.sale !== undefined) {
        formData.append('sale', productData.sale);
      }
      if (productData.featured !== undefined) {
        formData.append('featured', productData.featured);
      }
      if (productData.stockQuantity !== undefined) {
        formData.append('stockQuantity', productData.stockQuantity);
      }
      if (productData.image) {
        formData.append('image', productData.image);
      }
      if (productData.pngTryOnImage) {
        formData.append('pngTryOnImage', productData.pngTryOnImage);
      }

      return api.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Version': 'v1'
        }
      });
    },
    updateProduct: (id, productData) => {
      const formData = new FormData();
      // Add all product data to FormData as specified in backend API
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);

      // Handle optional fields
      if (productData.sale !== undefined) {
        formData.append('sale', productData.sale);
      }
      if (productData.featured !== undefined) {
        formData.append('featured', productData.featured);
      }
      if (productData.stockQuantity !== undefined) {
        formData.append('stockQuantity', productData.stockQuantity);
      }
      if (productData.image) {
        formData.append('image', productData.image);
      }
      if (productData.pngTryOnImage) {
        formData.append('pngTryOnImage', productData.pngTryOnImage);
      }

      return api.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Version': 'v1'
        }
      });
    },
    deleteProduct: (id) => api.delete(`/products/${id}`, {
      headers: { 'X-Api-Version': 'v1' }
    })
  };

  const categoryApiWithAuth = {
    getAllCategories: () => api.get('/categories', {
      headers: { 'X-Api-Version': 'v1' }
    }),
    createCategory: (categoryData) => {
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      return api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Version': 'v1'
        }
      });
    },
    updateCategory: (id, categoryData) => {
      const formData = new FormData();
      Object.keys(categoryData).forEach(key => {
        if (categoryData[key] !== null && categoryData[key] !== undefined) {
          formData.append(key, categoryData[key]);
        }
      });
      return api.put(`/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Version': 'v1'
        }
      });
    },
    deleteCategory: (id) => api.delete(`/categories/${id}`, {
      headers: { 'X-Api-Version': 'v1' }
    })
  };

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productApiWithAuth.getAllProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApiWithAuth.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Failed to fetch categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setImagePreview(imageUrl);

    setFormData({
      ...formData,
      image: file
    });
  };

  const handleTryOnImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate that it's a PNG file
    if (file.type !== 'image/png') {
      alert('Please upload a PNG image for try-on');
      e.target.value = '';
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setTryOnImagePreview(imageUrl);

    setFormData({
      ...formData,
      pngTryOnImage: file
    });
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      image: null
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveTryOnImage = () => {
    setTryOnImagePreview(null);
    setFormData({
      ...formData,
      pngTryOnImage: null
    });
    if (tryOnFileInputRef.current) {
      tryOnFileInputRef.current.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      stockQuantity: 0,
      image: null,
      pngTryOnImage: null,
      sale: false,
      featured: false
    });
    setImagePreview(null);
    setTryOnImagePreview(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (tryOnFileInputRef.current) {
      tryOnFileInputRef.current.value = '';
    }
  };

  const handleEdit = (item) => {
    // Fix to ensure category is a string (ID value) instead of object
    const categoryId = item.category && typeof item.category === 'object' ?
        item.category.id.toString() :
        (item.categoryId || item.category || '');

    setFormData({
      ...item,
      category: categoryId,
      stockQuantity: item.stockQuantity || 0,
      image: null, // Reset image to avoid sending base64 to server
      pngTryOnImage: null
    });
    setImagePreview(item.image);
    setTryOnImagePreview(item.pngTryOnImage);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      if (activeTab === 'products') {
        await productApiWithAuth.deleteProduct(id);
        setProducts(products.filter(product => product.id !== id));
      } else {
        await categoryApiWithAuth.deleteCategory(id);
        setCategories(categories.filter(category => category.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure price is a number and stockQuantity is an integer
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10)
      };

      if (isEditing) {
        const response = await productApiWithAuth.updateProduct(productData.id, productData);
        setProducts(products.map(product =>
            product.id === productData.id ? response.data : product
        ));
      } else {
        const response = await productApiWithAuth.createProduct(productData);
        setProducts([...products, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await categoryApiWithAuth.updateCategory(formData.id, formData);
        setCategories(categories.map(category =>
            category.id === formData.id ? response.data : category
        ));
      } else {
        const response = await categoryApiWithAuth.createCategory(formData);
        setCategories([...categories, response.data]);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Failed to save category');
    }
  };

  return (
      <div className="flex flex-col min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Product Management</h1>

          <div className="mb-6 flex">
            <button
                className={`px-4 py-2 mr-2 ${activeTab === 'products' ? 'bg-brown-800 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button
                className={`px-4 py-2 ${activeTab === 'categories' ? 'bg-brown-800 text-white' : 'bg-gray-200'}`}
                onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
          </div>

          {activeTab === 'products' ? (
              <div>
                <form onSubmit={handleProductSubmit} className="bg-white p-6 rounded shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1">Product Name</label>
                      <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Price (LKR)</label>
                      <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Stock Quantity</label>
                      <input
                          type="number"
                          name="stockQuantity"
                          value={formData.stockQuantity}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          min="0"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Category</label>
                      <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.displayName}
                            </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block mb-1">Product Image</label>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full"
                          />
                          {imagePreview && (
                              <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                              >
                                Remove
                              </button>
                          )}
                        </div>
                        {imagePreview && (
                            <div className="mt-2">
                              <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover border rounded"
                              />
                            </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Try-On PNG Image</label>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <input
                              type="file"
                              ref={tryOnFileInputRef}
                              accept="image/png"
                              onChange={handleTryOnImageUpload}
                              className="w-full"
                          />
                          {tryOnImagePreview && (
                              <button
                                  type="button"
                                  onClick={handleRemoveTryOnImage}
                                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                              >
                                Remove
                              </button>
                          )}
                        </div>
                        {tryOnImagePreview && (
                            <div className="mt-2">
                              <img
                                  src={tryOnImagePreview}
                                  alt="Try-On Preview"
                                  className="w-32 h-32 object-cover border rounded"
                              />
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded"
                        rows="3"
                        required
                    ></textarea>
                  </div>

                  <div className="flex mb-4">
                    <div className="mr-4">
                      <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="sale"
                            checked={formData.sale}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        On Sale
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Featured
                      </label>
                    </div>
                  </div>

                  <div className="flex">
                    <button
                        type="submit"
                        className="bg-brown-800 text-white px-4 py-2 rounded hover:bg-brown-700"
                    >
                      {isEditing ? 'Update Product' : 'Add Product'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                    )}
                  </div>
                </form>

                <div className="bg-white p-6 rounded shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Product List</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Image</th>
                        <th className="p-2 text-left">Try-On Image</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Category</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-left">Stock</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {products.map(product => (
                          <tr key={product.id} className="border-b">
                            <td className="p-2">
                              <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                            </td>
                            <td className="p-2">
                              {product.pngTryOnImage ? (
                                  <img src={product.pngTryOnImage} alt={`${product.name} Try-On`} className="w-16 h-16 object-cover" />
                              ) : (
                                  <span className="text-gray-400">No try-on image</span>
                              )}
                            </td>
                            <td className="p-2">{product.name}</td>
                            <td className="p-2 capitalize">
                              {typeof product.category === 'object'
                                  ? product.category.displayName
                                  : product.category}
                            </td>
                            <td className="p-2">LKR {product.price}</td>
                            <td className="p-2">{product.stockQuantity || 0}</td>
                            <td className="p-2">
                              {product.sale && <span className="bg-red-600 text-white px-2 py-1 text-xs rounded mr-1">SALE</span>}
                              {product.featured && <span className="bg-green-600 text-white px-2 py-1 text-xs rounded">FEATURED</span>}
                            </td>
                            <td className="p-2">
                              <button
                                  onClick={() => handleEdit(product)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-1"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          ) : (
              <div>
                <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded shadow-md mb-6">
                  <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1">Category Name</label>
                      <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Display Name</label>
                      <input
                          type="text"
                          name="displayName"
                          value={formData.displayName || ''}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border rounded"
                          required
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Category Image</label>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="w-full"
                          />
                          {imagePreview && (
                              <button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                              >
                                Remove
                              </button>
                          )}
                        </div>
                        {imagePreview && (
                            <div className="mt-2">
                              <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="w-32 h-32 object-cover border rounded"
                              />
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex">
                    <button
                        type="submit"
                        className="bg-brown-800 text-white px-4 py-2 rounded hover:bg-brown-700"
                    >
                      {isEditing ? 'Update Category' : 'Add Category'}
                    </button>
                    {isEditing && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="ml-2 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                    )}
                  </div>
                </form>

                <div className="bg-white p-6 rounded shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Category List</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 text-left">Image</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Display Name</th>
                        <th className="p-2 text-left">Actions</th>
                      </tr>
                      </thead>
                      <tbody>
                      {categories.map(category => (
                          <tr key={category.id} className="border-b">
                            <td className="p-2">
                              <img src={category.image} alt={category.name} className="w-16 h-16 object-cover" />
                            </td>
                            <td className="p-2">{category.name}</td>
                            <td className="p-2">{category.displayName}</td>
                            <td className="p-2">
                              <button
                                  onClick={() => handleEdit(category)}
                                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm mr-1"
                              >
                                Edit
                              </button>
                              <button
                                  onClick={() => handleDelete(category.id)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  );
};

export default ProductManagement;