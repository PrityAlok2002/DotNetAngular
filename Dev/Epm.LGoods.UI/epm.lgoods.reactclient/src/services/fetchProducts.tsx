import { Filters, Products } from "../types/type";
import { data } from "../data";

export const fetchProducts = async (filters: Filters): Promise<Products[]> => {

    let filteredProducts = data;
    

    if (filters.productType) {
        filteredProducts = filteredProducts.filter(product => 
            product.productType.toLowerCase().includes(filters.productType.toLowerCase()));
    }

    if (filters.categories) {
        filteredProducts = filteredProducts.filter(product => 
            product.categories.toLowerCase().includes(filters.categories.toLowerCase()));
    }

    if (filters.manufacturer) {
        filteredProducts = filteredProducts.filter(product => 
            product.manufacturer.toLowerCase().includes(filters.manufacturer.toLowerCase()));
    }

    if (filters.countryOfOrigin) {
        filteredProducts = filteredProducts.filter(product => 
            product.countryOfOrigin.toLowerCase().includes(filters.countryOfOrigin.toLowerCase()));
    }

    if (filters.price) {
        const price = parseFloat(filters.price);
        filteredProducts = filteredProducts.filter(product => {
          const productPrice = parseFloat(product.price.replace(/[^\d.-]/g, ''));
          return productPrice === price;
    });
}

    return filteredProducts;
};




