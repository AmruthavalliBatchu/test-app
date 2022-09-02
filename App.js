import logo from './logo.svg';
import { v4 as uuid } from 'uuid';
import './App.css';
import React from 'react';
import { Buffer } from 'buffer'
import stringToStream from "string-to-stream"
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { Amplify, API } from 'aws-amplify';
import awsconfig from './aws-exports';

const AWS = require('aws-sdk');
const s3_bucket = "sample-user1-bucket"

const s3 = new AWS.S3({
  accessKeyId: '',
  secretAccessKey: '',
  region:"eu-west-1" 
 });


Amplify.configure(awsconfig);

class CodeSnippet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  upload(file_format) {
    const readable = this.state.value;
    const datastream = stringToStream(readable)
    const s3_key = uuid() + file_format
    console.log("s3_key:", s3_key)
    const params = {Bucket: s3_bucket, Key: s3_key, Body: readable};
    const results = s3.upload(params).promise();
    console.log('upload complete', results);
    return s3_key;
  }

  async handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
    var value = this.state.value
    console.log("input : ", value)
    const encodedString = Buffer.from(value).toString('base64');
    console.log("encoded string : ", encodedString)

    //var key = this.upload(".txt");

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        "user" : "helloworld",
        "code" : encodedString
      })
  };
  const response = await fetch('https://dte27bzkr2.execute-api.eu-west-1.amazonaws.com/dev/stats', requestOptions);
  const data = await response.json();
  console.log("recieved: ", data);
      //.then(data => this.setState({ postId: data.id }));
  }

  

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <button type="submit" value="Submit">Verify Snippet</button>
      </form>
    );
  }
}

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

export default withAuthenticator(CodeSnippet);
