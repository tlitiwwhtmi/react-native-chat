/**
 * Created by administrator on 16/4/25.
 */

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TextInput,
    AlertIOS
} from 'react-native';

var Urls = require("./../utils/Urls")

var windowSize = Dimensions.get('window');

import Button from 'react-native-button';

var Messenger = require("./../utils/Messenger");

var backImg = require("./../../../images/loginback.jpg");

var userImg =require("./../../../images/user.png");

var headerImg = require("./../../../images/A-104.png");

var passwdImg = require("./../../../images/passwd.png");

var LoginView = React.createClass({

    getInitialState : function () {
        return {
            userName : "",
            passWord : ""
        }
    },

    render : function () {

        return (
            <View style={styles.container}>
                <Image style={styles.bg} source={backImg} />
                <View style={styles.header}>
                    <Image style={styles.mark} source={headerImg} />
                </View>
                <View style={styles.inputs}>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputUsername} source={userImg}/>
                        <TextInput
                            style={[styles.input, styles.whiteFont]}
                            placeholder="Username"
                            placeholderTextColor="#FFF"
                            value={this.state.userName}
                            onChangeText={this.changeUserName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputPassword} source={passwdImg}/>
                        <TextInput
                            password={true}
                            style={[styles.input, styles.whiteFont]}
                            placeholder="Pasword"
                            placeholderTextColor="#FFF"
                            value={this.state.passWord}
                            onChangeText={this.changePassWord}
                            returnKeyType={this.onSubmit ? 'send' : 'default'}
                            onSubmitEditing={this.onSubmit}
                            enablesReturnKeyAutomatically={true}
                        />
                    </View>
                    <View style={styles.forgotContainer}>
                        <Text style={styles.greyFont}>Forgot Password</Text>
                    </View>
                </View>
                    <Button
                        containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#FF3366'}}
                        style={styles.whiteFont}
                        onPress={this.onSubmit}
                    >
                        Sign In
                    </Button>
                <View style={styles.signup}>
                    <Text style={styles.greyFont}>Don't have an account?<Text style={styles.whiteFont}>  Sign Up</Text></Text>
                </View>
            </View>
        );
    },

    changeUserName : function (text) {
        this.setState({userName : text});
    },

    changePassWord : function (text) {
        this.setState({passWord:text});
    },

    onSubmit : function () {
        if(this.state.userName){

            var _self = this;

            fetch(Urls.webUrl+"/login",{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: this.state.userName,
                    passWord: this.state.passWord,
                })
            })
                .then((response) => response.text())
                .then((responseText) => {
                    var responseJson = JSON.parse(responseText);
                    if(responseJson.status == "error"){
                        AlertIOS.alert(
                            '提示',
                            '用户名或者密码错误'
                        );
                    }else{
                        _self.onLoginSuccess(responseJson.user);
                    }
                });

        }
    },
    
    onLoginSuccess : function (user) {
        if(user){
            this.props.onSubmit(user);
        }
    }
});

var styles = StyleSheet.create({

    container: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'transparent',
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .5,
        backgroundColor: 'transparent',
        marginTop:60
    },
    mark: {
        width: 150,
        height: 150
    },
    signin: {
        backgroundColor: '#FF3366',
        padding: 20,
        alignItems: 'center'
    },
    submitBtn : {
        backgroundColor: '#FF3366',
        alignItems: 'center',
        height:50,
        width: windowSize.width,
    },
    signup: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: .15
    },
    inputs: {
        marginTop: 10,
        marginBottom: 10,
        flex: .25
    },
    inputPassword: {
        marginLeft: 15,
        width: 20,
        height: 21
    },
    inputUsername: {
        marginLeft: 15,
        width: 20,
        height: 20
    },
    inputContainer: {
        padding: 10,
        borderWidth: 1,
        borderBottomColor: '#CCC',
        borderColor: 'transparent'
    },
    input: {
        position: 'absolute',
        left: 61,
        top: 12,
        right: 0,
        height: 20,
        fontSize: 14
    },
    forgotContainer: {
        alignItems: 'flex-end',
        padding: 15,
    },
    greyFont: {
        color: '#D8D8D8'
    },
    whiteFont: {
        color: '#FFF'
    }
});

module.exports = LoginView;
