/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
    Image,
    Dimensions,
    AsyncStorage,
    AlertIOS
} from 'react-native';

var windowSize = Dimensions.get('window');

var Messenger = require("./app/around/utils/Messenger");

var ErrorListenrId = null;

var Http = require("./app/around/utils/Http");

var Urls = require("./app/around/utils/Urls");

var LoginView = require("./app/around/login/LoginView");

var MainNavigator = require("./app/around/main/MainNavigator");

var backImg = require("./images/loginback.jpg");

var around2 = React.createClass({

  getInitialState : function () {
    return {
      user : {},
      loading : true
    }
  },

  componentWillMount : function () {

    this.doOnTheFirst();
  },

  render : function () {

    var content = null;

    if(this.state.loading){
      content = (
          <Image style={styles.bg} source={backImg} />
      );
    }else{
      if (this.state.user.id) {

        content = this.renderMainContent();

      }else{

        content = this.renderLogin();

      }
    }

    return (
        <View style={styles.container}>
          {content}
        </View>
    );
  },
  
  renderMainContent : function () {
    return (
        <MainNavigator
            user={this.state.user}
            logout={this.logout}
        />
    );
  },

  renderLogin : function () {
    return (
        <LoginView
            onSubmit={this.onSubmitUser}
        />
    );
  },

  doOnTheFirst : function () {
      this.initHttp();
      //this.initMessenger();

      this.checkLoginToken();
  },

    checkNetWork : function (obj) {
        AlertIOS.alert("提示","无法连接到服务器");
        if(ErrorListenrId){
            Messenger.removeErrorListener(ErrorListenrId);
            ErrorListenrId = null;
        }
    },
  
  onSubmitUser : function (user) {
    if(user){
        ErrorListenrId = Messenger.registErrorListener(this.checkNetWork);
        this.initMessenger(function () {
            if(ErrorListenrId){
                Messenger.removeErrorListener(ErrorListenrId);
                ErrorListenrId = null;
            }
            this.setState({user : user});
            AsyncStorage.setItem("aroundUser",JSON.stringify(user));
            Messenger.sendMsg(Messenger.generateMsg("enter",this.state.user,this.state.user,"server",""));
        }.bind(this));
    }
  },

  logout : function () {
    AsyncStorage.removeItem("aroundUser");
    this.setState({user:{}});
  },

  checkLoginToken : function () {
    var _self = this;
    AsyncStorage.getItem("aroundUser",(err,result) => {
      if(result){
        _self.loginWithToken(JSON.parse(result));
      }else{
        this.setState({loading:false});
      }
    });
  },

  loginWithToken : function (user) {
    var _self = this;

    fetch(Urls.webUrl+"/loginwithtoken",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id : user.id,
        token: user.token,
      })
    })
        .then((response) => response.text())
        .then((responseText) => {
          var responseJson = JSON.parse(responseText);
          if(responseJson.status == "error"){

          }else{
            _self.onSubmitUser(responseJson.user);
          }
          this.setState({loading:false});
        });

  },

  initMessenger : function (callback) {
    Messenger.initSocket(Urls.socketUrl,callback);
  },

  initHttp : function () {
    Http.initHttp(Urls.webUrl);
  }

});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  bg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: windowSize.width,
    height: windowSize.height
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('around2', () => around2);
