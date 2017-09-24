import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
var apiBaseUrl = "http://localhost:8000/api/";
import axios from 'axios';
import UploadScreen from './UploadScreen';
import UploadPage from './UploadPage';
class Login extends Component {
  constructor(props){
    super(props);
    var localloginComponent=[];
    localloginComponent.push(
      <MuiThemeProvider>
        <div>
         <TextField
           hintText="Enter your username"
           floatingLabelText="username"
           onChange = {(event,newValue) => this.setState({username:newValue})}
           />
         <br/>
           <TextField
             type="password"
             hintText="Enter your Password"
             floatingLabelText="Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
       </div>
       </MuiThemeProvider>
    )
    this.state={
      username:'',
      password:'',
      loginComponent:localloginComponent
    }
  }
  componentWillMount(){
  // console.log("willmount prop values",this.props);
	  console.log("in student componentWillMount");
      var localloginComponent=[];
      localloginComponent.push(
        <MuiThemeProvider>
          <div>
           <TextField
             hintText="Enter your College Rollno"
             floatingLabelText="username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
         </div>
         </MuiThemeProvider>
      )
      this.setState({loginComponent:localloginComponent})
  }
  handleClick(event){
    var self = this;
		if(this.state.username.length>0 && this.state.password.length>0) {
		var payload={
		  "userid":this.state.username,
			"password":this.state.password,
		}
		axios.post(apiBaseUrl+'users/check', payload)
	   .then(function (response) {
		 console.log(response);
		 if(response.data.code == 200){
		   console.log("Login successfull");
		   var uploadScreen=[];
		   uploadScreen.push(<UploadPage appContext={self.props.appContext} role={self.state.loginRole}/>)
		   self.props.appContext.setState({loginPage:[],uploadScreen:uploadScreen})
		 }
		 else if(response.data.code == 204){
		   console.log("Username password do not match");
		   alert(response.data.success)
		 }
		 else{
		   console.log("Username does not exists");
		   alert("Username does not exist");
		 }
	   })
	   .catch(function (error) {
		 console.log(error);
	   });
	   } else{
		   alert("username or password is null");
	   } 
  }
  handleMenuChange(){
    //console.log("menuvalue",value);
    var loginRole;
     var localloginComponent=[];
      loginRole='student';
      localloginComponent.push(
        <MuiThemeProvider>
          <div>
           <TextField
             hintText="Enter your College Rollno"
             floatingLabelText="Student Id"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               hintText="Enter your Password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
         </div>
         </MuiThemeProvider>
      )
    this.setState({
                   loginComponent:localloginComponent,
                   })
  }
  render() {
    return (
      <div>
        <MuiThemeProvider>
        <AppBar
             title="Login"
           />
        </MuiThemeProvider>
        {this.state.loginComponent}
      </div>
    );
  }
}

const style = {
  margin: 15,
};

export default Login;