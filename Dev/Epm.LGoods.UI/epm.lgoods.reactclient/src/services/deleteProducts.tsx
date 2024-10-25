export const deleteProduct = async (productId: string) => {
    // Replace with actual API call
    await fetch(`http://localhost:5000/products`, {
        method: 'DELETE'
    });
};