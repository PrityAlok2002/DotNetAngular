import { useState } from "react";
import { Filters } from "../../../types/type";


interface SidebarProps {
    onApplyFilters: (filters: Filters) => void;
    closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onApplyFilters, closeSidebar }) => {
    const [filterValues, setFilterValues] = useState<Filters>({
        productType: "",
        categories: "",
        manufacturer: "",
        countryOfOrigin: "",
        price: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilterValues({
            ...filterValues,
            [name]: value
        });
    };

    const handleSubmit = () => {
        onApplyFilters(filterValues);
    };

    return (
        
        <div className="sidebar">
            <button className="close-btn" onClick={closeSidebar}>&times;
            </button>
            <h4>Apply Filters</h4>
            <input name="productType" placeholder="Product Type" onChange={handleChange} maxLength={30} />
            <input name="categories" placeholder="Categories" onChange={handleChange} maxLength={30}/>
            <input name="manufacturer" placeholder="Manufacturer" onChange={handleChange} maxLength={30}/>
            <select name="countryOfOrigin" onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="USA">USA</option>
                <option value="China">China</option>
                <option value="India">India</option>
            </select>
            <input name="priceRange" placeholder="Price" onChange={handleChange}  max={10000} min={0} type="number" />
            <button className="apply-btn"  onClick={handleSubmit}>Apply</button>
        </div>
    );
};

export default Sidebar;