# Enzyme and Jest

## NPM packages

Must:

- babel-core
- babel-preset-env
- babel-preset-react
- babel-jest
- jest
- enzyme
- enzyme-adapter-react-16
- jsdom

Option:

- enzyme-to-json

## Setup

```javascript
// App.test.js
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import toJson from 'enzyme-to-json';

configure({ adapter: new Adapter() });
```

## Shallow rendering

render only the first layer

```javascript
const wrapper = shallow(<App />);
```

## Enzyme selectors

1. CSS selector

    ```javascript
    wrapper.find('.App-intro');
    ```

2. Prop selector: Enzyme supports using a React prop like an Attribute Selector as if it were an HTML attribute.

    ```javascript
    const wrapper = mount((
      <div>
        <span foo={3} bar={false} title="baz" />
      </div>
    ));
    wrapper.find('[foo=3]');
    wrapper.find('[bar=false]');
    wrapper.find('[title="baz"]');
    ```

3. React Component Constructor

    ```javascript
    const MyComponent = () => <div />;
    const myComponents = wrapper.find(MyComponent);
    ```

4. React Component’s displayName

    :sweat: This will only work if the selector (and thus the component’s displayName) is a string starting with a capital letter. Strings starting with lower case letters will assume it is a CSS selector using the tag syntax.

    ```javascript
    function MyComponent() {
      return <div />;
    }
    MyComponent.displayName = 'My Component';
    const myComponents = wrapper.find('My Component');
    ```

5. Object Property Selector: Enzyme allows you to find components and nodes based on a subset of their properties

    ```javascript
    const wrapper = mount((
      <div>
        <span foo={3} bar={false} title="baz" />
      </div>
    ));

    wrapper.find({ foo: 3 });
    wrapper.find({ bar: false });
    wrapper.find({ title: 'baz' });
    ```

    :sweat: Undefined Properties

    Undefined properties are not allowed in the object property selector and will cause an error:

    ```javascript
      wrapper.find({ foo: 3, bar: undefined });
    // => TypeError: Enzyme::Props can't have 'undefined' values. Try using 'findWhere()' instead.
    ```

## Jest snapshots

The first time to run the test will pass and save the snapshot into __snapshots__ folder. Press u to update the stored snapshot.

```javascript
it('matches the snapshot', () => {
  const tree = shallow(<App />);
  expect(toJson(tree)).toMatchSnapshot();
});
```

## Test React component props

The first test is testing the props, named address, of the instance, which is `<Link />`. On the other hand, the second test is testing the href prop in `<a />` node. Both of them are testing the same prop but through different ways.

The third test is for testing the component of conditional rendering.

```javascript
// App.test.js
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

// App.js
export default class Link extends Component {
  render() {
    return this.props.hide ? null : <a href={this.props.address}>Click</a>;
  }
}
```

## Mount rendering

Fully rendering React component is ideal for use cases where you may have component interacted with DOM APIs or may required the full React lifecycles, ex: componentDinMount()...

```javascript
const wrapper = mount(<App />, { context: {}, attachTo: DOMElement });
// expect...
wrapper.unmount(); // need to unmount
```

## Test simulated event handlers

```javascript
// App.test.js
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
  // simulate method takes an optional event object that we can mock up for our method
  input.simulate('change', {currentTarget: {value: 'Hello World'}});
  expect(wrapper.find('.inputText').text()).toBe('Hello World');
});

  // App.js
class App extends Component {
  state = {
    on: false,
    textInput: ''
  }

  render() {
    <p className='button-state'>{this.state.on ? 'Yes' : 'No'}</p>
    <button onClick={() => this.setState({ on: !this.state.on })}>Click</button>

    <p className='inputText'>{this.state.inputText}</p>
    <input onChange={evt => this.setState({ inputText: evt.currentTarget.value})}/>
  }
}
```

## Test new component state with setState

```javascript
it('updates className with new State', () => {
  const wrapper = shallow(<App />);
  expect(wrapper.find('.blue').length).toBe(1);
  expect(wrapper.find('.red').length).toBe(0);
  // setState method on wrapper
  wrapper.setState({ mainColor: 'red' });
  expect(wrapper.find('.blue').length).toBe(0);
  expect(wrapper.find('.red').length).toBe(1);
});
```

## Test React component Lifecycle methods

```javascript
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
```

## Test React component methods

```javascript
// App.js
class App extends Component {
  handleStrings(str) { return !!str; }
  render() {
    // ...
  }
}

// App.test.js
it('handleStrings function returns correctly', () => {
  const wrapper = shallow(<App />);
  const trueReturn = wrapper.instance().handleStrings('Hello World');
  const falseReturn = wrapper.instance().handleStrings('');
  expect(trueReturn).toBe(true);
  expect(falseReturn).toBe(false);
});
```

## Test React forms

```javascript
describe('<Form />', () => {
  // default value
  it('receive checkbox default is true', () => {
    const wrapper = shallow(<Form />);
    const checkBox = wrapper.find('[data-testid="checked"]');
    expect(checkBox.props().checked).toBe(true);
  })
  // actually input information
  it('allows user to fill out form', () => {
    const wrapper = shallow(<Form />);
    const nameInput = wrapper.find('[data-testid="name"]');
    nameInput.simulate('change', {currentTarget: {value: 'Kevin'}});
    const checkBox = wrapper.find('[data-testid="checked"]');
    checkBox.simulate('click');
    expect(nameInput.props().value).toBe('Kevin');
    expect(checkBox.props().checked).toBe(false);
  });
  // submits the form, calls api
  it('submits the form', () => {
    jest.spyOn(api, 'addUser').mockImplementation(() => Promise.resolve({data: 'New User Added'}));
    const wrapper = shallow(<App />);
    const nameInput = wrapper.find('[data-testid="name"]');
    nameInput.simulate('change', {currentTarget: {value: 'Kevin'}});
    wrapper.find('[data-testid="addUserForm"]').simulate('submit', {preventDefault: () => {}});
    expect(api.addUser).toHaveBeenCalledWith('Kevin');
  });
  // matches snapshots
  it('matches saved snapshots', () => {
    const wrapper = shallow(<Form />);
    expect(toJson(wrapper)).toMatchSnapshot();
  })
});
```

## Test Redux connect components

```javascript
describe('<TodoList />', () => {
  // addTodo with button click
  it('calls addTodo redux action creator with button click', () => {
    const props = {
      addTodo: jest.fn(),
      todos: [],
    };
    const wrapper = shallow(<TodoList {...props} />);
    wrapper.find('input').simulate('change', {currentTarget: {value: 'Buy Groceries'}});
    wrapper.find('.todo-button').simulate('click');
    expect(props.addTodo).tohaveBeenCalledWith({text: 'Buy Groceries'});
  });
  // removeTodo with li click
  it('calls removeTodo Redux action create on li click', () => {
    const props = {
      removeTodo: jest.fn(),
      todos: [ {text: 'Buy Groceries'}, {text: 'Change Oil'}],
    };
    const wrapper = shallow(<TodoList {...props} />);
    wrapper.find('li').at(0).simulate('click');
    expect(props.removeTodo).toHaveBeenCalledWith(0);
  });
  // matches snapshots
  it('matches saved snapshots', () => {
    const props = { todos: [] };
    const wrapper = shallow(<TodoList {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  })
})
```
