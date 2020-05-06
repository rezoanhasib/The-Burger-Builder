import React, { Component } from 'react' ;
import Modal from '../../components/UI/Modal/Modal'; 
import Aux from '../Aux/Aux'; 

const withErrorHandler = ( WrappedComponent, axios) => {
    //annonymous inner class, only withErrorHandler component initiates this class
    return class extends Component {

        //error to be used inside componentDidMount
        state = {
            error: null,
        }
        //componentDidMount is used for error handling
        constructor () {
            super();
            //if error: error is set any point, clearing it here for a new request
            //assigning the return in a state object on the fly
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null}); 
                //interceptors needs to return the req
                return req;
            });
            
            //since interceptors need to return the response, res => res
            //asssigning the return in a state object on the fly
            this.resInterceptor = axios.interceptors.response.use(res => res, error => {
                this.setState({error: error})
            });
        }

        //ejecting the interceptors when the component is unmounted from the DOM to prevent memory leaks
        componentWillUnmount () {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor); 
        }

        //this will be called once the backdrop is clicked on the error modal
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }

        render () {
            return (
                <Aux>
                    <Modal 
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </Aux>
            );
        }
    }
}; 

export default withErrorHandler;