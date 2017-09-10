import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import ReactGSAPTransitionGroup from 'react-addons-gsap-transition-group';
import { TweenMax, TimelineMax, Power1 } from "gsap";

class Modal extends React.Component {

  constructor() {
    super();
    this.transitionEnter = this.transitionEnter.bind(this);
    this.transitionLeave = this.transitionLeave.bind(this);
  }

  transitionEnter() {

    let innerTargets = this.modalWrapper.querySelectorAll('.anim');

    return new TimelineMax()
      .from(this.modalWrapper, 1, {autoAlpha: 0, ease: Power1.easeOut}, 0)
      .staggerFrom(innerTargets, 1, {autoAlpha: 0, y: -10}, 0.25, 0);

  }

  transitionLeave() {

    let innerTargets = Array.from(this.modalWrapper.querySelectorAll('.anim')).reverse();

    return new TimelineMax({onComplete: this.props.unMount})
      .to(this.modalWrapper, 1, {autoAlpha: 0, ease: Power1.easeOut}, 0)
      .staggerTo(innerTargets, 1, {autoAlpha: 0, y: +10}, 0.2, 0);

  }

  render() {
    console.log('modal render');
    let { name, birth_year, height } = this.props.data

    return (

      <ReactGSAPTransitionGroup
      tweenAppear={this.transitionEnter}
      transitionAppear={true}
      transitionEnter={false}
      transitionLeave={false}
      >
        <div ref={r => this.modalWrapper = r} key='name' className='modal-wrapper'>
          <div className='modal-inner'>
            <button onClick={this.transitionLeave.bind(this)}>X</button>
            <h1 className='anim'>{name}</h1>
            <h2 className='anim'>{birth_year}</h2>
            <h2 className='anim'>{height}</h2>
          </div>
        </div>
      </ReactGSAPTransitionGroup>

    )

  }

}

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      items: [],
    }
  }

  componentWillMount() {

    fetch( 'https://swapi.co/api/people/?format=json' )
      .then( response => response.json() )
      .then( ({ results: items }) => this.setState({ items }))

  }

  mount(item) { // pass to any component
    ReactDOM.render(<Modal data={item} unMount={this.unMount.bind(this)} />, document.getElementById('modal-root'))
  }

  unMount() {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-root'))
  }

  render() {
    console.log('home render');
    let items = this.state.items

    return (
      <div>
        <button onClick={this.mount.bind(this)}>mount</button>
        <button onClick={this.unMount.bind(this)}>un mount</button>

        { items.map(item => <Person key={item.name} mount={this.mount.bind(this, item)} name={item.name} />) }

        <div id="modal-root"></div>
      </div>
    )
  }

}

class Person extends React.Component {

  render() {

    return (
      <div>
        <h2
          onClick={ this.props.mount } // only given to modal buttons
          >{this.props.name}</h2>
        <hr/>
      </div>
    )
  }

}

export default App