import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Heart, EyeIcon, ChevronDown } from 'lucide-react';

// Cart Utility Function
const CartUtils = {
    addToCart: (product, size = '', quantity = 1) => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(item =>
            item.productId === product.id && item.size === size
        );

        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                productId: product.id,
                name: product.name,
                price: product.sale ? product.salePrice : product.price,
                image: product.image,
                size: size,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        return cart;
    }
};

// Sample Product Data (replace with your actual data)
const initialProducts = [
    {
        id: 1,
        name: 'V Neck Dress',
        category: 'Dresses',
        price: 3590,
        salePrice: 2990,
        sale: true,
        image: '/path/to/v.jpg',
        description: 'Elegant V-neck dress perfect for any occasion.',
        colors: ['Black', 'White', 'Red'],
        sizes: ['XS', 'S', 'M', 'L']
    },
    {
        id: 2,
        name: 'Classic Shirt',
        category: 'Shirts',
        price: 2590,
        salePrice: 1990,
        sale: false,
        image: '/path/to/shirt.jpg',
        description: 'Comfortable classic shirt for everyday wear.',
        colors: ['White', 'Blue'],
        sizes: ['S', 'M', 'L', 'XL']
    },
    // More products can be added here
];

const ProductsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [sortBy, setSortBy] = useState('default');

    // Categories and filter logic
    const categories = [...new Set(initialProducts.map(p => p.category))];

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];

            return matchesSearch && matchesCategory && matchesPrice;
        }).sort((a, b) => {
            switch(sortBy) {
                case 'priceAsc': return a.price - b.price;
                case 'priceDesc': return b.price - a.price;
                case 'nameAsc': return a.name.localeCompare(b.name);
                case 'nameDesc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });
    }, [searchTerm, selectedCategories, priceRange, sortBy]);

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    // Add to cart handler for product cards
    const handleQuickAddToCart = (product) => {
        // Assuming default size and quantity for quick add
        const defaultSize = product.sizes[0];
        CartUtils.addToCart(product, defaultSize, 1);
        alert('Product added to cart!');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Search and Sort Section */}
                <div className="flex mb-8 space-x-4">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-brown-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-4 text-gray-400" size={20} />
                    </div>

                    {/* Sorting Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none w-full px-4 py-3 border-2 border-gray-300 rounded-lg pr-8 focus:outline-none focus:ring-2 focus:ring-brown-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="default">Sort By</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                            <option value="nameAsc">Name: A to Z</option>
                            <option value="nameDesc">Name: Z to A</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-4 text-gray-400" size={20} />
                    </div>
                </div>

                {/* Products and Filters Container */}
                <div className="flex">
                    {/* Filters Sidebar */}
                    <div className="w-64 pr-8 bg-white p-6 rounded-lg shadow-md">
                        {/* Category Filter */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Categories</h4>
                            {categories.map(category => (
                                <div key={category} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                        className="mr-2 text-brown-800 focus:ring-brown-500"
                                    />
                                    <label htmlFor={category} className="text-gray-700">
                                        {category}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Price Range Filter */}
                        <div>
                            <h4 className="font-semibold mb-3">Price Range</h4>
                            <div className="flex items-center space-x-2 mb-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={priceRange[0]}
                                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                    className="w-1/2 px-2 py-1 border rounded"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                    className="w-1/2 px-2 py-1 border rounded"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-grow">
                        <div className="grid grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg overflow-hidden shadow-lg relative group"
                                >
                                    {/* Product Image */}
                                    <div className="relative h-80 overflow-hidden">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {product.sale && (
                                            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">
                                                SALE
                                            </div>
                                        )}

                                        {/* Hover Actions */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center space-x-4">
                                            {/* View Product Details Link */}
                                            <Link
                                                to={`/product/${product.id}`}
                                                className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-100"
                                            >
                                                <EyeIcon size={20} />
                                            </Link>

                                            {/* Quick Add to Cart */}
                                            <button
                                                onClick={() => handleQuickAddToCart(product)}
                                                className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300 hover:bg-gray-100"
                                            >
                                                <ShoppingCart size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Product Details */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                                        <div className="text-brown-800 font-bold">
                                            {product.sale ? (
                                                <>
                                                    <span className="mr-2 text-brown-800">LKR {product.salePrice}</span>
                                                    <span className="line-through text-gray-500 text-sm">LKR {product.price}</span>
                                                </>
                                            ) : (
                                                `LKR ${product.price}`
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;