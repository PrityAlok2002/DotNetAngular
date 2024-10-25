import { Categories, CategoryTableProps } from "../../../types/type";
import styles from "./CategoryList.module.css";

const CategoriesTable : React.FC<CategoryTableProps> = ({categories}) => {

  return (
    <table className={styles.categoryTable}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Category Name</th>
                    <th>Descritpion</th>
                    <th>Image</th>
                    <th>IsActive</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category: Categories) => (
                    <tr key={category.categoryId}>
                        <td>{category.categoryId}</td>
                        <td>{category.categoryName}</td>
                        <td>{category.description}</td>
                        <td>
                            <img src={category.image} alt="category-image" />
                        </td>
                        <td>{category.isActive ? "Active" : "Inactive"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
  );
}

export default CategoriesTable;