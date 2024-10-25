import { useEffect, useState } from "react";
import "../../../styles/product-list.css";
import { fetchProducts } from "../../../services/fetchProducts";
import { Products, Filters } from "../../../types/type";
import Sidebar from "./Sidebar";
import ProductTable from "./ProductTable";
import Menu from "../../PriceMapping/Menu";

import Modal from "react-modal"
import ProductCreationModal from '../product-creation-modal/ProductCreationModal';
import styles from "./ProductList.module.css";
import Header from "../../Header";
import Footer from "../../Footer";

Modal.setAppElement('#root');

const ProductList = () => {
    
    const [products, setProducts] = useState<Products[]>([]);
    const [filters, setFilters] = useState<Filters>({
        productType: "",
        categories: "",
        manufacturer: "",
        countryOfOrigin: "",
        price: ""
    });

    const [showSidebar, setShowSidebar] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    
    useEffect(() => {
        const loadProducts = async () => {
            const productList = await fetchProducts(filters);
            setProducts(productList);
        };

        loadProducts();
    }, [filters]);

    const openModal = () => {
        setIsModalOpen(true);
    };
    
    const closeModal = () => setIsModalOpen(false);

    const loadProducts = async () => {
        const productList = await fetchProducts(filters);
        setProducts(productList);
    };

    const handleDelete = async (productId: string) => {
        const confirmDelete = window.confirm("Are you sure you want to permanently delete this product?");
        if (confirmDelete) {
            window.alert("Product deleted successfully");
            loadProducts();
        }
    };

    const handleUpdate = (productId: string) => {
       
    };

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const closeMenu = () => {
        setShowMenu(false);
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const closeSidebar = () => {
        setShowSidebar(false);
    };

    const applyFilters = (newFilters: Filters) => {
        setFilters(newFilters);
        closeSidebar();
    };
  
    return (
        <div className="page-container">
            <Header />
            <Menu isOpen={showMenu} onClose={closeMenu} />   
         <div className={`product-list-container ${showMenu ? 'shifted' : ''}`}>
            <div className="top-bar">
                <button className="menu-toggle-btn" onClick={toggleMenu}>
                &#9776;
                </button>
                <button className="filter-toggle-btn" onClick={toggleSidebar}>
                    <i className="fas fa-filter"></i>
                </button>
                <button className="create-btn" onClick={openModal}>Create New Product</button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Add Product Modal"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <ProductCreationModal closeModal={closeModal} />
            </Modal>  

            {showSidebar && <Sidebar onApplyFilters={applyFilters}  closeSidebar={closeSidebar}/>}
            {showMenu && <Menu isOpen={showMenu} onClose={closeMenu} />}
            {products.length === 0 ? (
                <div className="no-products">No products found</div>
            ): (
                <ProductTable products={products} handleUpdate={handleUpdate} handleDelete={handleDelete} />
            )}
            </div>
            <Footer />
        </div>
    );
};

export default ProductList;


