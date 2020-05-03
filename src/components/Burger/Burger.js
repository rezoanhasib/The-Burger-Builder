import React from 'react'; 
import classes from './Burger.css'; 
import BurgerIngredient from './BurgerIngredient/BurgerIngredient'; 

const burger = (props) => {
    //Here BurgerIngredient component is getting called for each entry on props.ingredient with the relevant key and type
    //for each entry in the ingredient object, the BurgerIngredient is getting called with the key and type
    let transformedIngredients = Object.keys(props.ingredients)
        .map(igkey => {
            return[...Array(props.ingredients[igkey])].map((_,i) => {
                return <BurgerIngredient key={igkey+i} type={igkey}/>
            });
            //in order to combine all the empty array spaces from above together in one value, reduce() is used to flatten the array
        }).reduce((arr,el)=>{
            return arr.concat(el);
        }, []);
        //transformedIngredients now has one array element with all the empty spaces added together 
        //transformedIngredients is flattend to one value is to check if they array is empty or not. If empty, 
        //the below message is displayed
    console.log(transformedIngredients);
    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start adding ingredients!</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    ); 
}; 

export default burger; 