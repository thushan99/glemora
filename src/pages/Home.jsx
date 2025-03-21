import React from 'react';
import Navigation from "../components/navigation/Navigation";
import Footer from "../components/navigation/Footer";

const Home = () => {
    return (
            <div className="flex flex-col min-h-screen">
            {/* Hero Banner */}
            <section className="bg-cover bg-center h-96 flex items-center px-12" style={{ backgroundImage: "url('../assets/img/hero-banner.jpg')" }}>
                <div className="text-white max-w-md">
                    <h3 className="text-2xl font-light mb-2">we are expanding</h3>
                    <h2 className="text-4xl mb-2">Visit our Premium outlet</h2>
                    <h1 className="text-5xl font-bold mb-4">in Liberty Plaza</h1>
                    <a href="/shop" className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700">SHOP NOW</a>
                </div>
            </section>

            {/* Category Grid */}
            <section className="container mx-auto px-4 py-12">
                <div className="flex gap-5 mb-5">
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/dress.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">DRESSES</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/dresses" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">TOPS</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/tops" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">SKIRTS</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/skirts" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="flex gap-5 mb-5">
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">JUMPSUIT</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/jumpsuit" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">PANTS</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/pants" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                    <div className="flex-1 h-48 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">ACCESSORIES</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/accessories" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
                <div className="flex gap-5">
                    <div className="w-full h-32 bg-cover bg-center rounded-lg relative overflow-hidden" style={{ backgroundImage: "url('../assets/img/top-re.png')" }}>
                        <div className="absolute top-5 left-5">
                            <h3 className="text-2xl text-gray-800">LUVESENSE</h3>
                            <p className="text-sm text-gray-600 mb-3">COLLECTION</p>
                            <a href="/luvesense" className="text-brown-800 text-sm font-bold hover:text-brown-700">Shop Now <i className="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Arrivals Section */}
            <section className="container mx-auto px-4 py-12">
                <h2 className="text-3xl text-center mb-8 relative">NEW ARRIVALS</h2>
                <div className="grid grid-cols-4 gap-5">
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="relative h-64 overflow-hidden">
                            <img src="/images/product-1.jpg" alt="V Neck Dress" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 pb-3 transition-transform duration-300 transform translate-y-10 group-hover:translate-y-0">
                                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brown-800 hover:text-white"><i className="fas fa-search"></i></button>
                                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brown-800 hover:text-white"><i className="fas fa-shopping-cart"></i></button>
                                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-brown-800 hover:text-white"><i className="far fa-heart"></i></button>
                            </div>
                            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded">SALE</div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg mb-2">V Neck Dress</h3>
                            <div className="text-brown-800 font-bold">LKR 3,590</div>
                        </div>
                    </div>
                    {/* Repeat for other product cards */}
                </div>
                <div className="flex justify-center mt-8 space-x-2">
                    <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-brown-800 hover:text-white"><i className="fas fa-chevron-left"></i></button>
                    <button className="w-10 h-10 border border-gray-300 rounded-full flex items-center justify-center hover:bg-brown-800 hover:text-white"><i className="fas fa-chevron-right"></i></button>
                </div>
            </section>

            {/* Shopping Banner */}
            <section className="bg-yellow-400 py-12">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="max-w-md">
                        <h3 className="text-2xl mb-2">Stay Home and Start</h3>
                        <h2 className="text-5xl font-bold mb-4">Shopping Online!</h2>
                        <p className="text-lg mb-4">Molly Now Ships Worldwide</p>
                        <a href="/shop" className="bg-brown-800 text-white px-6 py-2 rounded font-bold hover:bg-brown-700">SHOP NOW</a>
                    </div>
                    <div className="max-w-sm">
                        {/* Shopping woman image here */}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="bg-gray-100 py-8">
                <div className="container mx-auto px-4 flex items-center">
                    <div className="text-4xl text-brown-800 mr-5"><i className="far fa-envelope"></i></div>
                    <div className="flex-1">
                        <h3 className="text-lg mb-1">Subscribe to our Newsletter</h3>
                        <p className="text-sm text-gray-600">Deliver our latest arrivals right into your inbox</p>
                    </div>
                    <div className="flex min-w-96">
                        <input type="email" placeholder="Enter your Email address" className="flex-1 px-3 py-2 border border-gray-300 rounded-l" />
                        <button className="bg-brown-800 text-white px-6 py-2 rounded-r hover:bg-brown-700">SUBSCRIBE</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;