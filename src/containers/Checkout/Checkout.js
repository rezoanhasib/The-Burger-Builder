import React, { Component } from 'react'; 
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'; 
import { Route } from 'react-router-dom'; 
import ContactData from './ContactData/ContactData'; 

class Checkout extends Component {

    state = {
        ingredients: null,
        totalPrice: 0,
    }

    //since the Checkout component will always get mounted once clicked on checkout, and never get updated, componentDidMount is used
    componentWillMount () {
        //extracting the search portion from the url that starts from '?'
        const query = new URLSearchParams(this.props.location.search);
        const ingredients = {};
        let price = 0;

        //lets populate the empty ingredients object with values like salad: 1 
        for (let param of query.entries()) {
            //if the entry is price, then 
            if(param[0] === 'price'){
                price = param[1];
            } else {
                //each param is like: ['salad', '1']
                ingredients[param[0]] = +param[1]; 
            }           
        }
        this.setState({ingredients: ingredients, totalPrice: price}); 
    }

    //cancel button click handler on the checkout summary page
    checkoutCancelledHandler = () => {
        this.props.history.goBack();
    }

    //continue button click handler on the checkout summary page
    checkoutContinuedHandler = () => {
        this.props.history.replace('/checkout/contact-data');
    }

    render () {
        return (
            <div>
                <CheckoutSummary 
                    ingredients={this.state.ingredients}
                    checkoutCancelled={this.checkoutCancelledHandler}
                    checkoutContinued={this.checkoutContinuedHandler}
                />
                <Route 
                    path={this.props.match.path + '/contact-data'} 
                    render={(props) => ( <ContactData ingredients={this.state.ingredients} price={this.state.totalPrice} {...props} />)}
                />
            </div>
        );
    }
}

export default Checkout; 