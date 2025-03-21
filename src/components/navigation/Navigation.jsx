import Glemora from '../../assets/img/glemora-logo.png';


const Navigation = () => {
    return (<>
            {/* Top bar */}
            <div className="bg-gray-100 py-1 text-xs border-b border-gray-300">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="text-gray-600">Welcome to Glemora Boulevard</div>
                    <div className="text-gray-600">
                        <span><i className="fas fa-phone"></i> Order Online or Call: (+94) 0xx xxx xxxx | (+94) xx xxx xxxx</span>
                    </div>
                </div>
            </div>

            {/* Header with logo and navigation */}
            <header className="bg-white py-4 border-b border-gray-300">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <a href="/" className="text-gray-700 hover:text-gray-900"><i className="far fa-heart"></i></a>
                        <span className="text-gray-300 mx-2">•</span>
                        <a href="/account" className="text-gray-700 hover:text-gray-900">MY ACCOUNT</a>
                        <span className="text-gray-300 mx-2">•</span>
                        <a href="/sale" className="text-red-600 font-bold hover:text-red-700">SALE</a>
                    </div>

                    <div className="text-center">
                        <a href="/">
                            <img src={Glemora} alt="Molly" className="h-16"/>
                        </a>
                    </div>

                    <div className="flex items-center">
                        <div className="flex mr-4">
                            <input type="text" placeholder="Search..."
                                   className="px-2 py-1 border border-gray-300 rounded-l"/>
                            <button className="bg-gray-800 text-white px-3 rounded-r"><i className="fas fa-search"></i>
                            </button>
                        </div>
                        <a href="/wishlist" className="text-gray-700 hover:text-gray-900 mr-4"><i
                            className="far fa-heart"></i></a>
                        <a href="/cart" className="bg-brown-800 text-white px-3 py-1 rounded flex items-center">
                            <i className="fas fa-shopping-cart"></i>
                            <span className="mx-2">MY CART</span>
                            <span
                                className="bg-white text-brown-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">0</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main navigation */}
            <nav className="bg-brown-800 py-2">
                <div className="container mx-auto px-4">
                    <ul className="flex justify-around items-center">
                        <li><a href="/dresses" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-female mr-1"></i> Dresses</a></li>
                        <li><a href="/tops" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-tshirt mr-1"></i> Tops</a></li>
                        <li><a href="/pants" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-socks mr-1"></i> Pants</a></li>
                        <li><a href="/skirts" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-female mr-1"></i> Skirts</a></li>
                        <li><a href="/jumpsuits" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-female mr-1"></i> Jumpsuits</a></li>
                        <li><a href="/loungewear" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-home mr-1"></i> Lounge-Suits</a></li>
                        <li><a href="/virtual-try-on" className="text-white text-sm flex items-center hover:opacity-80"><i
                            className="fas fa-gem mr-1"></i> Virtual Try-On</a></li>
                    </ul>
                </div>
            </nav>
        </>);
};

export default Navigation;