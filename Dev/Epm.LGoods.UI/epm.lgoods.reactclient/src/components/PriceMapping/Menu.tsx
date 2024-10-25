import React from 'react';
import "../../styles/menu.css";
import { Link } from 'react-router-dom';


const Menu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <div className={`menu ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <ul className="menu-list">
        <li>
          <a href="/product-list" className="menu-link">
            <em className="fa-solid fa-pen-to-square sidebar-icon"></em>
            <span>Product Info</span>
          </a>
        </li>
        <li>
          <Link to={"/price-mapping"} className="menu-link">
            <em className="fa-solid fa-indian-rupee-sign sidebar-icon">
            </em>
            <span>Price</span>
          </Link>
        </li>
        <li>
          <a href="/product-list" className="menu-link">
            <em className="fa-solid fa-image sidebar-icon"></em>
            <span>Pictures</span>
          </a>
        </li>
        <li>
          <a href="/product-list" className="menu-link">
            <em className="fa-solid fa-code-branch sidebar-icon"></em>
            <span>Category mappings</span>
          </a>
        </li>
        <li>
          <a href="/product-list" className="menu-link">
            <em className="fa-solid fa-warehouse sidebar-icon"></em>
            <span>Manufacturer mappings</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Menu;

