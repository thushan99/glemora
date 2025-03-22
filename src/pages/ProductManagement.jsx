import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    sale: false,
    featured: false
  });
  const [isEditing, setIsEditing] = useState(false);
  
  // Dummy data for demonstration - replace with your API calls
  useEffect(() => {
    // Fetch products and categories
    setProducts([
      { id: 1, name: 'V Neck Dress', description: 'Beautiful V neck dress for summer', price: 3590, category: 'dresses', image: '/images/product-1.jpg', sale: true, featured: true },
      { id: 2, name: 'Casual Top', description: 'Casual top for everyday wear', price: 2490, category: 'tops', image: '/images/product-2.jpg', sale: false, featured: true },
    ]);
    
    setCategories([
      { id: 1, name: 'dresses', displayName: 'DRESSES', image: '../assets/img/dress.png' },
      { id: 2, name: 'tops', displayName: 'TOPS', image: '../assets/img/top-re.png' },
      { id: 3, name: 'skirts', displayName: 'SKIRTS', image: '../assets/img/top-re.png' },
      { id: 4, name: 'jumpsuit', displayName: 'JUMPSUIT', image: '../assets/img/top-re.png' },
      { id: 5, name: 'pants', displayName: 'PANTS', image: '../assets/img/top-re.png' },
      { id: 6, name: 'accessories', displayName: 'ACCESSORIES', image: '../assets/img/top-re.png' },
      { id: 7, name: 'luvesense', displayName: 'LUVESENSE', image: '../assets/img/top-re.png' },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      sale: false,
      featured: false
    });
    setIsEditing(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (activeTab === 'products') {
      setProducts(products.filter(product => product.id !== id));
    } else {
      setCategories(categories.filter(category => category.id !== id));
    }
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setProducts(products.map(product => 
        product.id === formData.id ? formData : product
      ));
    } else {
      const newProduct = {
        ...formData,
        id: Date.now() // Generate a unique ID
      };
      setProducts([...products, newProduct]);
    }
    resetForm();
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setCategories(categories.map(category => 
        category.id === formData.id ? formData : category
      ));
    } else {
      const newCategory = {
        ...formData,
        id: Date.now() // Generate a unique ID
      };
      setCategories([...categories, newCategory]);
    }
    resetForm();
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
                      <option key={category.id} value={category.name}>
                        {category.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block mb-1">Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
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
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Category</th>
                      <th className="p-2 text-left">Price</th>
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
                        <td className="p-2">{product.name}</td>
                        <td className="p-2 capitalize">{product.category}</td>
                        <td className="p-2">LKR {product.price}</td>
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
                    value={formData.displayName} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>
                
                <div>
                  <label className="block mb-1">Image URL</label>
                  <input 
                    type="text" 
                    name="image" 
                    value={formData.image} 
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
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