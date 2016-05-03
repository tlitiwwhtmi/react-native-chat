/**
 * Created by administrator on 16/4/26.
 */

import React, {
    View,
    NavigatorIOS,
    Platform
} from 'react-native';


var MainContent = require("./MainContent");

var ChatContainer = require("./../chat/ChatContainer");

var MainNavigator = React.createClass({


    render : function () {
        // I am fused with the navigationBar,So I make it hidden , and make a custom bar
        return (
            <NavigatorIOS
                ref="mainNavigator"
                style={{flex:1}}
                navigationBarHidden={true}
                initialRoute={
                    {
                        title: "Around",
                        component: MainContent,
                        passProps : {
                            user : this.props.user,
                            pressContact : this.onPressContact,
                            logout : this.props.logout
                        }
                    }
                }
            />
        );
    },

    onPressContact : function (data) {
        if(this.refs.mainNavigator){
            this.refs.mainNavigator.push({
                title:data.userName,
                component:ChatContainer,
                passProps:{
                    user : this.props.user,
                    client : data,
                    onPressBack:this.onPressBack
                }
            })
        }
    },

    onPressBack : function () {
        if(this.refs.mainNavigator){
            this.refs.mainNavigator.pop();
        }
    }


});

module.exports = MainNavigator;