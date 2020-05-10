import React, { Component } from 'react'; 
import Button from '../../../components/UI/Button/Button'; 
import classes from './ContactData.css'; 
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'; 

class ContactData extends Component {
    state = {
        name: '', 
        email: '', 
        address: {
            street: '', 
            postalCode: '', 
        }, 
        loading: false,
    }

    orderHandler = (event) => {
        //to stop the page from reloading on the 'order' button click, preventDefault is used 
        event.preventDefault();
        this.setState({ loading: true }); 
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
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
            this.setState({loading: false});
            this.props.history.push('/');
        })
        .catch(error => {
            this.setState({loading: false});
        });
        //backend call with the order. Whether call successful or not, loading is set to false to stop the spinner    }
    }

    render () {
        let form = (
            <form>
                    <input className={classes.Input} type="text" name="name" placeholder="Your Name"/>
                    <input className={classes.Input} type="email" name="email" placeholder="Your Email"/>
                    <input className={classes.Input} type="text" name="street" placeholder="Street"/>
                    <input className={classes.Input} type="text" name="postal" placeholder="Postal Code"/>
                    <Button btnType={"Success"} clicked={this.orderHandler}>ORDER</Button>
            </form>
        ); 
        if(this.state.loading){
            form = <Spinner />; 
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        ); 
    }
}

export default ContactData;