import React, { Component } from 'react';
import './App.css';
import uuidv4 from 'uuid'
import axios from 'axios';

const testText = [
  "In the beginning God created the heaven and the earth. And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way — in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only.",
  "I first met Dean not long after my wife and I split up. I had just gotten over a serious illness that I won’t bother to talk about, except that it had something to do with the miserably weary split-up and my feeling that everything was dead. With the coming of Dean Moriarty began the part of my life you could call my life on the road. Before that I’d often dreamed of going West to see the country, always vaguely planning and never taking off. Dean is the perfect guy for the road because he actually was born on the road, when his parents were passing through Salt Lake City in 1926, in a jalopy, on their way to Los Angeles. First reports of him came to me through Chad King, who’d shown me a few letters from him written in a New Mexico reform school. I was tremendously interested in the letters because they so naively and sweetly asked Chad to teach him all about Nietzsche and all the wonderful intellectual things that Chad knew. At one point Carlo and I talked about the letters and wondered if we would ever meet the strange Dean Moriarty. This is all far back, when Dean was not the way he is today, when he was a young jailkid shrouded in mystery. Then news came that Dean was out of reform school and was coming to New York for the first time; also there was talk that he had just married a girl called Marylou.",
  "In this test just write a few paragraphs about anything you want. You could write about yourself, your day, anything really."
]

const testName = [
  "short",
  "medium",
  "long",
  "free"
]
const serverUrl = "https://gugq9wuynd.execute-api.us-west-2.amazonaws.com/default/uploadTypingData"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {

      loggedIn: false,
      testIndex: 0
    }
  
    this.login = this.login.bind(this);
    this.finishTest = this.finishTest.bind(this);
  }

  login(username){
    this.setState({id: uuidv4(), loggedIn: true, username: username});
  }

  finishTest(keyPresses){
    let jsonOut = {
      id: this.state.id,
      username: this.state.username,
      test: testName[this.state.testIndex],
      data: keyPresses
    }
    console.log("jsonOut:", JSON.stringify(jsonOut));
    //Call API
    axios.options(serverUrl, {jsonOut})
    .then(res => {
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
    this.setState((prevState) => {
      let newState = prevState;
      newState.testIndex++;
      return newState;
    });
  }

  render() {
    let toRender = null
    if(!this.state.loggedIn){
      toRender =
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"}}
        >
          <Login
            login={this.login}
          />
        </div>
    } else if(this.state.testIndex < testText.length) {
      toRender = 
        <div>
          <Test
            text={testText[this.state.testIndex]}
            finish={this.finishTest}
          />
        </div>
    } else {
      toRender = 
        <div>
          <p>Thank You!</p>
        </div>
    }
    return (
      <div>
          {toRender}
      </div>);
  }
}


class Login extends Component{
  constructor(props){
    super(props);
    this.state ={
      inputValue: ''
    }
  }

  validate = () => {
    return this.state.inputValue.length;
  }

  login = () => {
    this.props.login(this.state.inputValue);
  }

  handleInputChange = (e) => {
    this.setState({inputValue: e.target.value});
  }

  render(){
    return (
      <div style={{display:'flex', alignContent:'center', flexDirection:'column'}}>
        <div>What's your name?</div>
        <input 
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        >
        </input>
        <button
          disabled={!this.validate()}
          onClick={this.login}
        >Proceed</button>
      </div>
    )
  }
}


class Test extends Component{
  constructor(props){
    super(props);
    this.state = {
      time: 0,
      isOn: false,
      start: 0,
      keyPresses: [],
      keyDownPressed: false,
      textAreaContent: ''
    }
    this.keyPress = this.keyPress.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.keyUp = this.keyUp.bind(this);
    this.finishTest = this.finishTest.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  startTimer() {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time
    })
    this.timer = setInterval(() => this.setState({
      time: Date.now() - this.state.start
    }), 1);
  }

  finishTest(){
    clearInterval(this.timer);
    this.props.finish(this.state.keyPresses);
     //Reset the state
    this.setState({
      time:0,
      isOn: false,
      start:0,
      keyPresses: [],
      keyDownPressed: false,
      textAreaContent: ''
    })
  }

  keyUp(e){
    let key = e.key;
    this.setState(prevState => {
      let newState = prevState;
      newState.keyDownPressed = false;
      console.log("keyupTime", newState.time);
      console.log("keydownstart from keyup", newState.keyDownStart)
      newState.keyPresses.push({keyPressed: key, time: newState.time, keyPressDuration: newState.time-newState.keyDownStart});
      console.log(newState.keyPresses);
      return newState;
    })
  }

  keyDown(e){
    if(!this.state.isOn){
      this.startTimer();
    }
    this.setState(prevState =>{
      let newState = prevState;
      if(!newState.keyDownPressed){
        console.log("keydowntime", newState.time);
        newState.keyDownStart = newState.time;
      }
      newState.keyDownPressed = true;
      return newState;
    });
  }

  keyPress(e){

  }

  handleTextChange(e){
    this.setState({textAreaContent:e.target.value});
  }

  render(){
    return (      
      <div style ={{
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column'
      }}>
        <p style={{marginLeft: '100px', marginRight: '100px'}}>{this.props.text}</p>
        <textarea style={{height: 100, width: 500}} value={this.state.textAreaContent} onChange={this.handleTextChange} onKeyDown={this.keyDown} onKeyUp={this.keyUp}></textarea>
        <button
          onClick={this.finishTest}
        >Finished</button>
      </div>
    );
  }

}

export default App;
