import React from 'react';
import { shallow, configure } from 'enzyme'; 
import Adaptor from 'enzyme-adapter-react-16'; 

import { BurgerBuilder } from '../BurgerBuilder/BurgerBuilder'; 
import BuildControls from '../../components/Burger/BuildControls/BuildControls'; 
import Burger from '../../components/Burger/Burger'; 

configure({ adapter: new Adaptor()}); 

describe('<BurgerBuilder/>', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<BurgerBuilder onInitIngredients={() => {}}/>);
    });
    
    it('should render one <BuildControls /> upon receiving ingredients', () => {
        wrapper.setProps({ings: { salad: 0 }});
        expect(wrapper.find(BuildControls)).toHaveLength(1);
    });
    
    it('should render one <Burger /> upon receiving ingredients', () => {
        wrapper.setProps({ings: { salad: 0 }});
        expect(wrapper.find(Burger)).toHaveLength(1);
    });
}); 


