/**
 * Created by administrator on 16/4/28.
 */

import React, {
    ListView,
    StatusBar,
    NavigationExperimental,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    Platform,
    Image,
    Dimensions
} from 'react-native';

var windowSize = Dimensions.get('window');

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

var MyBar = React.createClass({

    componentDidMount : function () {
        this.customizeStatusBar();
    },

    render: function () {

        return (
            <View style={[styles.bar,{backgroundColor:'#333333'}]}>
                {this.renderLeftCompo()}
                {this.renderTitle()}
                {this.renderRightCompo()}
            </View>
        );
    },

    customizeStatusBar : function () {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle("light-content");
        }
    },
    
    renderLeftCompo : function () {
        var leftTitle = null;
        if(this.props.leftTitle){
            leftTitle=(
                <View>
                    <Text  onPress={this.pressLeft} style={{color:'white',fontSize:18}}>{this.props.leftTitle}</Text>
                </View>
            );
        }
        return (
            <View style={styles.leftView}>
                <Image onPress={this.pressLeft} style={styles.leftIcon} source={this.props.leftIcon}/>
                {leftTitle}
            </View>
        );
    },

    pressLeft : function () {
      this.props.onLeftPress();
    },
    
    renderTitle : function () {
        return (
            <View style={styles.itemView}>
                <Text style={styles.titleText}>{this.props.title}</Text>
            </View>
        );
    },
    
    renderRightCompo : function () {
        return (
            <View style={styles.itemView}></View>
        );
    }


});

var styles = StyleSheet.create({
    bar: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: APPBAR_HEIGHT+STATUSBAR_HEIGHT,
        flexDirection:'row'
    },
    leftView : {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop:STATUSBAR_HEIGHT,
        height: APPBAR_HEIGHT,
        flexDirection:"row"
    },
    itemView : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop:STATUSBAR_HEIGHT,
        height: APPBAR_HEIGHT
    },
    titleText : {
        fontWeight:'bold',
        fontSize : 19,
        color:'white'
    },
    leftIcon : {
        marginLeft:5,
        alignItems : 'flex-start'
    }
});

module.exports = MyBar;