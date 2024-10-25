import { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import CategoriesTable from "./CategoriesTable";
import { Categories } from "../../../types/type";
import axios from "axios";
import Modal from 'react-modal';
import CategoryCreationModal from "./CategoryCreationModal";
import styles from "./CategoryList.module.css";

Modal.setAppElement('#root');

const CategoriesList = () => {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const openCategoryModal = () => setIsCategoryModalOpen(true);
  const closeCategoryModal = () => setIsCategoryModalOpen(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get("http://localhost:5292/api/products/Category");
      const categoryList = response.data;

      setCategories(categoryList.$values);
    };
    fetchCategories();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.categoriesListContainer}>
        <div className={styles.topBarCategories}>
          <div className={styles.categoriesHeader}>
            <div>
              <button className="create-btn" onClick={openCategoryModal}>
                Add Category
              </button>
            </div>
            <div>
              <h2>categories</h2>
            </div>
            <div></div>
          </div>
        </div>

        {categories.length === 0 ? (
          <div className="no-categories">No Categories found</div>
        ) : (
          <CategoriesTable categories={categories} />
        )}

        <Modal
          isOpen={isCategoryModalOpen}
          onRequestClose={closeCategoryModal}
          contentLabel="Add Category Modal"
          className={styles.modal}
          overlayClassName={styles.overlay}
        >
          <CategoryCreationModal closeModal={closeCategoryModal} />
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default CategoriesList;
