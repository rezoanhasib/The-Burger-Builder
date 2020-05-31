export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject, 
        ...updatedProperties
    }; 
}; 

export const checkValidity = (value, rules) => {
    let isValid = true;
    // if the field is required, checking if the value is not empty
    if (rules.required) {
        isValid = value.trim() !== '' && isValid; 
    }
    //checking for the minLength rule of the zipcode 
    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid;
    }
    //checking for the maxLength rule of the zipcode 
    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid;
    }       
    return isValid; 
}