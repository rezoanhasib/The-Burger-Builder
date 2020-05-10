import React from 'react'; 
import classes from './Order.css'; 

const order = (props) => {
    //lets convert the ingredients object from props to an array to display
    //similar conversion is done in Burger.js but differently
    const ingredients = [];
    for(let ingredientName in props.ingredients){
        ingredients.push(
            {
                name: ingredientName,
                amount: props.ingredients[ingredientName],
            }
        );
    }

    //at this point ingredients is an array of objects, where each object is like: {name: .. , amount: ..}
    //lets convert each item of ingredients to displayable items
    const ingredientOutput = ingredients.map(ig => {
        return <span 
            //this is the styling for each 'Ingredients:' row in the Orders page 
            style={{
                textTransform: 'capitalize',
                display: 'inline-block',
                margin: '0 8px',
                border: '1px solid #ccc',
                padding: '5px'
            }}
            key={ig.name}>{ig.name} ({ig.amount})</span>;
    });

    return(
        <div className={classes.Order}>
            <p>Ingredients: {ingredientOutput}</p>
            <p>Price: <strong>USD {props.price.toFixed(2)}</strong></p>
        </div>
    );
}; 

export default order; 