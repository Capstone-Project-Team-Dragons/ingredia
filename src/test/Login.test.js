import React from "react";
import Login from '../screens/LoginScreen';

 

describe('<Login />', () => {
    it('renders', () => {
      const wrapper = shallow(<Login />);
      expect(wrapper.exists()).toBe(true);
    });

  

});