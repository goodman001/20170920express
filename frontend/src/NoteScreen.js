import React, { Component } from 'react';
import './App.css';
/*
Screen:LoginScreen
Loginscreen is the main screen which the user is shown on first visit to page and after
hitting logout
*/
import LoginScreen from './Loginscreen';
import UploadScreen from './UploadScreen';
import UserPage from './UserPage';
/*
Module:Material-UI
Material-UI is used for designing ui of the app
*/
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

var apiBaseUrl = "http://192.168.44.130:8000/api/";
/*
Module:Dropzone
Dropzone is used for local file selection
*/
import Dropzone from 'react-dropzone';
/*
Module:superagent
superagent is used to handle post/get requests to server
*/
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
var request = require('superagent');

class NoteScreen extends Component {
  constructor(props){
    super(props);
	  console.log(props);
    var noteItems = this.props.user.noteItems;
    var notetitle;
    
    var notePreview=[];
    var newnotePreview=[];
        for(var i in noteItems){
          newnotePreview.push(<MuiThemeProvider><tr>
            <td>
            {noteItems[i].id}
             
            </td>
            <td>
           {noteItems[i].title}
            </td>
            <td>
            {noteItems[i].content}
            </td>
            <td>
          
            <RaisedButton label="Edit" primary={true} style={style} onClick={(event) => this.handleNoteEditClick(i+1)}/>
            
            </td>
            </tr>
            </MuiThemeProvider>
          )
        }
    notePreview.push(
      
      <MuiThemeProvider>
      <div>
        <div className="noteheader">
         <center><h3>Note list</h3></center>
        <RaisedButton  label="NewNote" primary={true} style={style1} onClick={(event) => this.handleNoteCreateClick(event)}/>
        </div>
        <div className="notecontainer">
                 <table className="notetable">

                  <tbody>
                  <tr>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>CONTENT</th>
                    <th></th>
                  </tr>
        {newnotePreview} 
                   </tbody>
                </table>
         </div>
       </div>
      </MuiThemeProvider>
                
                      )
    this.state={
      role:'student',
      filesPreview:[],
      filesToBeSent:[],
      draweropen:false,
      printcount:10,
      printingmessage:'',
      printButtonDisabled:false,
      notePreview:notePreview,
      newtitle:'',
      newcontent:'',
    }
  }
  componentWillMount(){
    // console.log("prop values",this.props.role);
    var printcount;
    //set upload limit based on user role
    if(this.props.role){
      if(this.props.role == 'student'){
        printcount = 5;
      }
      else if(this.props.role == 'teacher'){
        printcount =10;
      }
    }
    
    this.setState({printcount,role:this.props.role,user:this.props.user});
  }
  /*
  Function:handleCloseClick
  Parameters: event,index
  Usage:This fxn is used to remove file from filesPreview div
  if user clicks close icon adjacent to selected file
  */ 
  handleCloseClick(event,index){
    // console.log("filename",index);
    var filesToBeSent=this.state.filesToBeSent;
    filesToBeSent.splice(index,1);
    // console.log("files",filesToBeSent);
    var filesPreview=[];
    for(var i in filesToBeSent){
      filesPreview.push(<div>
        {filesToBeSent[i][0].name}
        <MuiThemeProvider>
        <a href="#" onClick={(event) => this.handleDivClick(event)}><FontIcon
          className="material-icons customstyle"
          color={blue500}
          
        >edit</FontIcon></a>
        </MuiThemeProvider>
        </div>
      )
    }
    this.setState({filesToBeSent,filesPreview});
  }
  /*
  Function:onDrop
  Parameters: acceptedFiles, rejectedFiles
  Usage:This fxn is default event handler of react drop-Dropzone
  which is modified to update filesPreview div
  */
  /*generateRows(noteItems) {
        console.log(noteItems);
        //threadshow=[<TableCell>ID<TableCell>,<TableCell>Title<TableCell>,<TableCell>Content<TableCell>];
        //this.setState({notethreadPreview,threadshow});
        var notePreview=[];
        for(var i in noteItems){
          notePreview.push(<TableRow>
            <TableCell>
            {noteItems[i].id}
            </TableCell>
            <TableCell>
            {noteItems[i].title}
            </TableCell>
            <TableCell>
            {noteItems[i].content}
            </TableCell>
            </TableRow>
          )
        }
        this.setState({notePreview});
        
    }*/
  onDrop(acceptedFiles, rejectedFiles) {
      // console.log('Accepted files: ', acceptedFiles[0].name);
      var filesToBeSent=this.state.filesToBeSent;
      if(filesToBeSent.length < this.state.printcount){
        filesToBeSent.push(acceptedFiles);
        var filesPreview=[];
        for(var i in filesToBeSent){
          filesPreview.push(<div>
            {filesToBeSent[i][0].name}
            <MuiThemeProvider>
            <a href="#"><FontIcon
              className="material-icons customstyle"
              color={blue500}
              styles={{ top:10,}}
              onClick={(event) => this.handleCloseClick(event,i)}
            >clear</FontIcon></a>
            </MuiThemeProvider>
            </div>
          )
        }
        this.setState({filesToBeSent,filesPreview});
      }
      else{
        alert("You have reached the limit of printing files at a time")
      }

      // console.log('Rejected files: ', rejectedFiles);
}
/*
  Function:handleClick
  Parameters: event
  Usage:This fxn is handler of submit button which is responsibel fo rhandling file uploads
  to backend
*/
handleClick(event){
  // console.log("handleClick",event);
  this.setState({printingmessage:"Please wait until your files are being printed",printButtonDisabled:true})
  var self = this;
  if(this.state.filesToBeSent.length>0){
    var filesArray = this.state.filesToBeSent;
    var req = request.post(apiBaseUrl+'fileprint');
    for(var i in filesArray){
        // console.log("files",filesArray[i][0]);
        req.attach(filesArray[i][0].name,filesArray[i][0])
    }
    req.end(function(err,res){
      if(err){
        console.log("error ocurred");
      }
      console.log("res",res);
      self.setState({printingmessage:'',printButtonDisabled:false,filesToBeSent:[],filesPreview:[]});
      alert("File printing completed")
      // self.props.indexthis.switchPage();
    });
  }
  else{
    alert("Please upload some files first");
  }
}

handleNoteEditClick(i){
    var self = this;
    console.log(i);
    var localloginComponent = [];
    if(1){
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
  }
     this.setState({notePreview:localloginComponent})
    //this.props.appContext.setState({userPage:userPage,uploadScreen:[]})
    
  }
handleNoteCreateClick(event){
   var self = this;
    var localloginComponent = [];
    if(1){
     localloginComponent.push(
          <MuiThemeProvider>
            <div>
             <TextField
               type="text"
               hintText="Enter Note title"
               floatingLabelText="Title"
               onChange = {(event,newValue) => this.setState({newtitle:newValue})}
               />
             <br/>
               <TextField
                 type="text"
                 hintText="Enter your Password"
                 floatingLabelText="Password"
                 onChange = {(event,newValue) => this.setState({newcontent:newValue})}
                 />
               <br/>
               <RaisedButton label="Create" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
           </div>
           </MuiThemeProvider>
        )
  }
     this.setState({notePreview:localloginComponent})
}
/*
  Function:toggleDrawer
  Parameters: event
  Usage:This fxn is used to toggle drawer state
  */
toggleDrawer(event){
  // console.log("drawer click");
  this.setState({draweropen: !this.state.draweropen})
}
/*
  Function:toggleDrawer
  Parameters: event
  Usage:This fxn is used to close the drawer when user clicks anywhere on the 
  main div
  */
handleDivClick(event){
  // console.log("event",event);
  if(this.state.draweropen){
    this.setState({draweropen:false})
  }
}
/*
  Function:handleLogout
  Parameters: event
  Usage:This fxn is used to end user session and redirect the user back to login page
  */
handleLogout(event){
  // console.log("logout event fired",this.props);
  var loginPage =[];
  loginPage.push(<LoginScreen appContext={this.props.appContext}/>);
  this.props.appContext.setState({loginPage:loginPage,uploadScreen:[]})
}
  render() {
    //console.log(this.props.user.noteItems);
    //this.generateRows();
    /*
    let rowComponents = this.generateRows(this.props.user.noteItems);
      let table_rows = []
      let table_headers = [];
      let data = this.props.users.noteItems;
    if (this.props.user.noteItems.length >0){
      let headers = Object.keys(this.props.user.noteItems[0]);
        headers.forEach(header => table_headers.push(<TableCell key={header}>{header}</TableCell>));
    }*/
    return (
      <div className="App">
         
          <div className="container">
               
              {this.state.notePreview}
                
          </div>
          <div onClick={(event) => this.handleDivClick(event)}>
          <center>
          <div>
            You can print upto {this.state.printcount} files at a time since you are {this.state.role}
          </div>

          <Dropzone onDrop={(files) => this.onDrop(files)}>
                <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div>
          Files to be printed are:fgsfg
          {this.state.filesPreview}
          </div>
          </center>
          <div>
          {this.state.printingmessage}
          </div>
          <MuiThemeProvider>	  
               <RaisedButton disabled={this.state.printButtonDisabled} label="Print Files" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
          </MuiThemeProvider>

          </div>
      </div>
    );
  }
}

const style = {
  margin: 15,
};
const style1 = {
  margin: 0,
};
export default NoteScreen;