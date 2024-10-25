import { Products } from "../../../types/type";
import "../../../styles/productTable.css";

interface ProductTableProps {
    products: Products[];
    handleUpdate: (productId: string) => void;
    handleDelete: (productId: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, handleUpdate, handleDelete }) => {
    return (
        <table className="product-table">
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product: Products) => (
                    <tr key={product.id}>
                        <td>
                            <img src={product.imageUrl} alt="product-image" />
                        </td>
                        <td>{product.name}</td>
                        <td>{product.price} ₹</td>
                        <td>
                            <button className="update-btn" onClick={() => handleUpdate(product.id)}>Update</button>
                            <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


export default ProductTable;