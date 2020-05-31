import React, { Component } from 'react';
import { connect } from 'react-redux'; 

import Aux from '../../hoc/Aux/Aux'; 
import Burger from '../../components/Burger/Burger'; 
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Modal from '../../components/UI/Modal/Modal'; 
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'; 
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'; 
import * as actions from '../../store/actions/index';
import axios from '../../axios-orders';

class BurgerBuilder extends Component{

    state = {
        //purchasing is added to show the modal if user clicks 'Order now'
        purchasing: false, 
    }

    componentDidMount () {
        this.props.onInitIngredients(); 
    }

    updatePurchaseState ( ingredients ) {
        const sum = Object.keys( ingredients )
            .map( igKey => {
                return ingredients[igKey]
            } )
            .reduce( ( sum, el ) => {
                return sum + el;
            }, 0 );
        return sum > 0; 
    }

    purchaseHandler = () => {
        if (this.props.isAuthenticated) {
            this.setState( { purchasing: true } ); 
        } else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth'); 
        }
    }

    purchaseCancelHandler = () => {
        this.setState( { purchasing: false } ); 
    }

    purchaseContinueHandler = () => { 
        this.props.onInitPurchase(); 
        this.props.history.push('/checkout');      
    }

    render(){
        const disabledInfo = { ...this.props.ings }; 
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }
        //if loading is false then render the ordersummary else render spinner
        let orderSummary = null;

        //setting up burger 
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
        if( this.props.ings ) {
            //setting up burger if ingredients now has updated values from backend
            burger = (
                <Aux>
                    <Burger ingredients={this.props.ings}/>
                    <BuildControls 
                        ingredientAdded={this.props.onIngredientAdded}
                        ingredientRemoved={this.props.onIngredientRemoved}
                        disabled={disabledInfo}
                        price={this.props.price}
                        purchasable={this.updatePurchaseState(this.props.ings)}
                        ordered={this.purchaseHandler}
                        isAuth={this.props.isAuthenticated}/>
                </Aux>
            );
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                purchaseCancelled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
                price={this.props.price}/>; 
        }
        //setting up burger 

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

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients, 
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }; 
}; 

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()), 
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }; 
}

export default connect(mapStateToProps, mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios)); 