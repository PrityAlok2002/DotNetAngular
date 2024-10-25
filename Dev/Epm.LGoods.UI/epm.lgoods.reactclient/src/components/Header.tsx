// import React from "react";
// import "../styles/header.css";
// import img from "../assets/localgoodslogo.webp";
// import { Link } from "react-router-dom";

// const Header = () => {
//     return (
//         <header>
//             <nav>
//                 <div className="left-section">
//                     <img src={img} alt="Local Goods Logo" className="logo" />
//                     <Link  to={"/product-list"}  className="manage-product">
//                         <em className="fa-solid fa-box"></em>
//                         <span>Manage Product</span>
                        
//                     </Link>
//                 </div>
//                 <div className="right-icons">
//                     <em className="fa-solid fa-user"></em>
//                     <a href="./" className="shake">
//                         <em className="fa-solid fa-bell"></em>
//                     </a>
//                 </div>
//             </nav>
//         </header>
//     );
// };

// export default Header;


import { useState } from 'react';
import '../styles/header.css';
import img from '../assets/localgoodslogo.webp';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isCatalogHovered, setIsCatalogHovered] = useState(false);

    return (
        <header>
            <nav>
                <div className="left-section">
                    <img src={img} alt="Local Goods Logo" className="logo" />
                    <div className="catalog"
                         onMouseEnter={() => setIsCatalogHovered(true)}
                         onMouseLeave={() => setIsCatalogHovered(false)}>
                        <ul className="catalog-main-ul">
                            <li className="catalog-main">
                                    <em className="fa-solid fa-box"></em>
                                    <span>Catalog</span>
                            </li>
                        </ul>
                        {isCatalogHovered && (
                            <ul className="dropdown">
                                <li><Link to="/manage-products" className="dropdown-item">Manage Products</Link></li>
                                <li><Link to="/categories" className="dropdown-item">Categories</Link></li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="right-icons">
                    <em className="fa-solid fa-user"></em>
                    <a href="./" className="shake">
                        <em className="fa-solid fa-bell"></em>
                    </a>
                </div>
            </nav>
        </header>
    );
};

export default Header;