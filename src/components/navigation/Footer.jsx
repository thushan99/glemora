import React from "react";

const Footer = () => {
    return (<>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-4 gap-8 mb-8">
                        <div>
                            <img src="/images/molly-logo-white.png" alt="Molly" className="h-12 mb-4"/>
                            <p className="text-sm text-gray-400 leading-relaxed">Negombo (Head Office)<br/>40/A, Main
                                Street, Negombo<br/><br/>Tel: (+94) 38 222 4459<br/>Tel: (+94) 077 389 8955</p>
                        </div>
                        <div>
                            <h3 className="text-lg mb-4 relative">SHOP</h3>
                            <ul>
                                <li><a href="/dresses" className="text-sm text-gray-400 hover:text-white">Dresses</a>
                                </li>
                                <li><a href="/tops" className="text-sm text-gray-400 hover:text-white">Tops</a></li>
                                <li><a href="/pants" className="text-sm text-gray-400 hover:text-white">Pants</a></li>
                                <li><a href="/jumpsuits"
                                       className="text-sm text-gray-400 hover:text-white">Jumpsuits</a></li>
                                <li><a href="/skirts" className="text-sm text-gray-400 hover:text-white">Skirts</a></li>
                                <li><a href="/accessories"
                                       className="text-sm text-gray-400 hover:text-white">Accessories</a></li>
                                <li><a href="/luvesense"
                                       className="text-sm text-gray-400 hover:text-white">Luvesense</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg mb-4 relative">OUR SERVICES</h3>
                            <ul>
                                <li><a href="/contact" className="text-sm text-gray-400 hover:text-white">Contact us</a>
                                </li>
                                <li><a href="/account" className="text-sm text-gray-400 hover:text-white">My Account</a>
                                </li>
                                <li><a href="/buying-guides" className="text-sm text-gray-400 hover:text-white">Buying
                                    Guides</a></li>
                                <li><a href="/terms" className="text-sm text-gray-400 hover:text-white">Terms and
                                    Conditions</a></li>
                                <li><a href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy &
                                    Security Policy</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg mb-4 relative">Working Days</h3>
                            <p className="text-sm text-gray-400 leading-relaxed"><strong>Negombo Outlet</strong><br/>Open
                                Days: Sat - Sun<br/>9.00 am – 8.00 pm<br/><br/><strong>Colombo Outlet</strong><br/>Open
                                every day: 10.00 am – 7.00 pm</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-8 border-t border-gray-800">
                        <div className="text-sm text-gray-500">Copyright © 2025 Molly Boulevard - Negombo, Sri Lanka.
                            All rights reserved.
                        </div>
                        <div>
                            <img src="/images/payment-methods.png" alt="Payment Methods" className="h-8"/>
                        </div>
                    </div>
                </div>
            </footer>

        </>);
};

export default Footer;