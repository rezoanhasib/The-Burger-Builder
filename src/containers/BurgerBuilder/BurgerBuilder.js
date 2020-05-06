import Aux from '../../hoc/Aux/Aux'; 
import { Component } from 'react';
import React from 'react';
import Burger from '../../components/Burger/Burger'; 
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal'; 
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'; 
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
//lower case because this will not be used in JSX 
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'; 

const INGREDIENT_PRICES = {
    salad: 0.5, 
    cheese: 0.4, 
    meat: 1.3, 
    bacon: 0.7
}

class BurgerBuilder extends Component{

    state = {
        ingredients: null, 
        totalPrice: 4,
        purchasable: false, 
        //purchasing is added to show the modal if user clicks 'Order now'
        purchasing: false, 
        //loading is added for the spinner
        loading: false,
        error: false,
    }

    componentDidMount () {
        axios.get('https://react-my-burger-c0c84.firebaseio.com/ingredients.json')
            .then(response => {
                this.setState({ingredients: response.data});
            })
            .catch(error => {
                this.setState({error: true}); 
            });
    }

    updatePurchaseState (ingredients) {
        const sum = Object.keys(ingredients)
            .map((igKey) => {
                return ingredients[igKey]
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0}); 
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        const updatedCount = oldCount + 1; 
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients); 
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]; 
        //Below condition is to not through error if tried removing when there's no ingredient
        if(oldCount <= 0) return; 
        const updatedCount = oldCount - 1; 
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeletion = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeletion;
        this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
        this.updatePurchaseState(updatedIngredients); 
    }

    purchaseHandler = () => {
        this.setState({purchasing: true}); 
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false}); 
    }

    purchaseContinueHandler = () => {
        this.setState({ loading: true }); 
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Rezoan Hasib',
                address: {
                    street: 'Walton Ave',
                    zip: '10452',
                    country: 'USA'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        };
        //backend call with the order. Whether call successful or not, loading is set to false to stop the spinner
        //purchasing is set to false so the modal goes away
        axios.post('/orders.json', order)
        .then(response => {
            this.setState({loading: false, purchasing: false});
        })
        .catch(error => {
            this.setState({loading: false, purchasing: false});
        });
        //backend call with the order. Whether call successful or not, loading is set to false to stop the spinner
    }

    render(){
        const disabledInfo = {...this.state.ingredients}; 
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        //if loading is false then render the ordersummary else render spinner
        let orderSummary = null;

        //setting up burger 
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.state.ingredients) {
            //setting up burger if ingredients now has updated values from backend
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients}/>
                    <BuildControls 
                        ingredientAdded = {this.addIngredientHandler}
                        ingredientsRemoved = {this.removeIngredientHandler}
                        disabled = {disabledInfo}
                        price = {this.state.totalPrice}
                        purchasable = {this.state.purchasable}
                        ordered = {this.purchaseHandler}
                    />
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.state.ingredients}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.state.totalPrice}/>; 
        }
        //setting up burger 

        //checking for loading after ingredients gets updated from backend
        if(this.state.loading){
            orderSummary = <Spinner />
        }

        //if loading is false then render the ordersummary else render spinner
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        ); 
    }
}

export default withErrorHandler(BurgerBuilder, axios); 