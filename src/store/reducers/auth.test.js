import reducer from './auth'; 
import * as actionTypes from '../actions/actionTypes'; 

describe('auth reducer', () => {
    it('should return initial state for default action case', () => {
        expect(reducer(undefined, {})).toEqual({
            token: null, 
            userId: null, 
            error: null, 
            loading: false, 
            authRedirectPath: '/'
        }); 
    })

    it('should return token and userID upon successful login', () => {
        expect(reducer({
            token: null, 
            userId: null, 
            error: null, 
            loading: false, 
            authRedirectPath: '/'
        }, {
            type: actionTypes.AUTH_SUCCESS, 
            idToken: 'test idToken', 
            userId: 'test userId'
        })).toEqual({
            token: 'test idToken', 
            userId: 'test userId', 
            error: null, 
            loading: false, 
            authRedirectPath: '/'
        });
    })
}); 