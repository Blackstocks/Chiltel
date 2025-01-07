// utils/validation.js

export const productEnums = [
    "Air Conditioner",
    "Water Heater",
    "Microwave",
    "Geyser",
    "Refrigerator",
    "Washing Machine",
    "Air Cooler",
    "Air Purifier",
    "Water Purifier",
    "Deep Freezer",
    "Visi Cooler",
    "Cassette AC",
    "Water Cooler cum Purifier",
    "Water Dispenser",
    "Display Counter",
    "Back Bar Chiller",
    "Upright Chiller",
    "Food Prep Chiller",
    "Ice Maker",
  ];
  
  export const validateProduct = (productData) => {
    const errors = {};
  
    // Required fields
    const requiredFields = ['name', 'brand', 'model', 'category', 'price', 'thumbnail'];
    requiredFields.forEach(field => {
      if (!productData[field]) {
        errors[field] = `${field} is required`;
      }
    });
  
    // Category validation against productEnums
    if (productData.category && !productEnums.includes(productData.category)) {
      errors.category = `Category must be one of: ${productEnums.join(', ')}`;
    }
  
    // Price validation
    if (productData.price && productData.price <= 0) {
      errors.price = 'Price must be greater than 0';
    }
  
    // Discount validation
    if (productData.discount) {
      if (productData.discount < 0 || productData.discount > 1) {
        errors.discount = 'Discount must be between 0 and 1';
      }
    }
  
    // Stock validation
    if (productData.inStock && productData.inStock < 0) {
      errors.inStock = 'Stock cannot be negative';
    }
  
    // Category validation
    const validMainCategories = ['Retail', 'Domestic Appliance', 'Kitchen'];
    if (productData.mainCategory && !validMainCategories.includes(productData.mainCategory)) {
      errors.mainCategory = 'Invalid main category';
    }
  
    // Type validation
    const validTypes = ['water', 'cooling', 'heating', 'cooking', 'cleaning', 'display'];
    if (productData.type && !validTypes.includes(productData.type)) {
      errors.type = 'Invalid type';
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  };