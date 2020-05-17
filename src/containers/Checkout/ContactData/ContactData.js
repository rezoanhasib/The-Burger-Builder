import React, { Component } from 'react'; 
import { connect } from 'react-redux'; 

import Button from '../../../components/UI/Button/Button'; 
import classes from './ContactData.css'; 
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner'; 
import Input from '../../../components/UI/Input/Input'; 


class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                }, 
                value: '', 
                validation: {
                    required: true,
                }, 
                valid: false,
                touched: false,
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street',
                }, 
                value: '', 
                validation: {
                    required: true,
                }, 
                valid: false,
                touched: false,
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code',
                }, 
                value: '', 
                validation: {
                    required: true,
                    minLength: 5, 
                    maxLength: 5
                }, 
                valid: false,
                touched: false,
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country',
                }, 
                value: '', 
                validation: {
                    required: true,
                }, 
                valid: false,
                touched: false,
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail',
                }, 
                value: '', 
                validation: {
                    required: true,
                }, 
                valid: false,
                touched: false,
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                }, 
                value: '',
                validation: {},
                //adding the valid property here otherwise formIsValidTracker becomes undefined when it loops thru all the form elements
                valid: true
            }
        },
        formIsValid: false,
        loading: false,
    }

    orderHandler = (event) => {
        //to stop the page from reloading on the 'order' button click, preventDefault is used 
        event.preventDefault();
        this.setState({ loading: true }); 
        const formData = {}; 
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
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

    checkValidity(value, rules) {
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

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = { ...this.state.orderForm };
        const updatedFormElement = {...updatedOrderForm[inputIdentifier]}; 
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement;

        //checking if all the form items are valid
        let formIsValidTracker = true;
        for(let formElement in updatedOrderForm){
            formIsValidTracker = updatedOrderForm[formElement].valid && formIsValidTracker; 
        } 
        console.log(formIsValidTracker);
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValidTracker}); 
    }

    render () {
        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key],
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value} 
                        invalid={!formElement.config.valid}
                        changed={event => this.inputChangedHandler(event,formElement.id)}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        valueType={formElement.id}/>
                ))}
                <Button btnType={"Success"} disabled={!this.state.formIsValid}>ORDER</Button>
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

const mapStateToProps = state => {
    return {
        ings: state.ingredients, 
        price: state.totalPrice,
    }
}; 

export default connect(mapStateToProps)(ContactData);