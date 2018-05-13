import React from 'react';
import ReactDOM from 'react-dom';
import App, { Link } from './App';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });

describe('<App />', () => {
  it('should contain a .App-intro element', () => {
    const wrapper = shallow(<App />);
    //console.log(wrapper.debug());
    expect(wrapper.find('.App-intro').exists()).toBe(true);
  });
  it('should render element .App-title as Welcome to React', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('.App-title').text()).toBe('Welcome to React');
  })
  it('should contains 3 li elements under ul element with class name dropdown', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('ul').children().length).toBe(3);
    expect(wrapper.find('ul').hasClass('dropdown')).toBe(true);
  });
  it('should have "New title" for element with props {text="New title"}', () => {
    const wrapper = mount(<App />);
    expect(wrapper.find('[text="New title"]').text()).toBe('New title');
    wrapper.unmount();
  });
  it('matches the snapshot', () => {
    const tree = shallow(<App />);
    expect(toJson(tree)).toMatchSnapshot();
  });
  it('on button click changes p text', () => {
    const wrapper = shallow(<App />);
    const button = wrapper.find('button');
    expect(wrapper.find('.button-state').text()).toBe('No');
    button.simulate('click');
    expect(wrapper.find('.button-state').text()).toBe('Yes');
  });
  it('on input change, title changes text', () => {
    const wrapper = shallow(<App />);
    const input = wrapper.find('input');
    expect(wrapper.find('.inputText').text()).toBe('');
    input.simulate('change', {currentTarget: {value: 'Hello World'}});
    expect(wrapper.find('.inputText').text()).toBe('Hello World');
  });
  it('updates className with new State', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('.blue').length).toBe(1);
    expect(wrapper.find('.red').length).toBe(0);
    wrapper.setState({ mainColor: 'red' });
    expect(wrapper.find('.blue').length).toBe(0);
    expect(wrapper.find('.red').length).toBe(1);
  });
  it('calls componentsDidMount', () => {
    jest.spyOn(App.prototype, 'componentDidMount');
    const wrapper = shallow(<App />);
    expect(App.prototype.componentDidMount.mock.calls.length).toBe(1);
  });
  it('setProps calls componentWillReceiveProps', () => {
    jest.spyOn(App.prototype, 'componentWillReceiveProps');
    const wrapper = shallow(<App />);
    wrapper.setProps({ hide: true });
    expect(App.prototype.componentWillReceiveProps.mock.calls.length).toBe(1);
  });
  it('handleStrings function returns correctly', () => {
    const wrapper = shallow(<App />);
    const trueReturn = wrapper.instance().handleStrings('Hello World');
    const falseReturn = wrapper.instance().handleStrings('');
    expect(trueReturn).toBe(true);
    expect(falseReturn).toBe(false);
  });

  describe('<Link />', () => {
    it('link component accepts address prop', () => {
      const wrapper = shallow(<Link address='www.google.com' />);
      expect(wrapper.instance().props.address).toBe('www.google.com');
    });
    it('a tag node renders href correctly', () => {
      const wrapper = shallow(<Link address='www.google.com' />);
      expect(wrapper.props().href).toBe('www.google.com');
    });
    it('returns null with true hide prop', () => {
      const wrapper = shallow(<Link hide={false} />);
      expect(wrapper.find('a').length).toBe(1);
      wrapper.setProps({ hide: true });
      expect(wrapper.get(0)).toBeNull();
    });
  });
});
