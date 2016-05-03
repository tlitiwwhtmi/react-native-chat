/**
 * Created by administrator on 16/4/24.
 */
/**
 * Created by duanhao on 16/4/24.
 */

import React, {
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    Image,
    Component
} from 'react-native';


class Buddle extends React.Component {
    render(){
        const flexStyle = {};
        if (this.props.text) {
            if (this.props.text.length > 40) {
                flexStyle.flex = 1;
            }
        }
        return (
            <View
                style={[styles.bubble,this.props.from.id != this.props.client.id ? styles.bubbleRight : styles.bubbleLeft,flexStyle]}
            >
                {this.renderText(this.props.content,this.props.from)}
            </View>
        );
    }

    renderText(text,src){
        return (
            <Text style={[styles.text, src.id != this.props.client.id ? styles.textRight : styles.textLeft]}>
                {text}
            </Text>
        );
    }

}

var styles = StyleSheet.create({
    bubble: {
        borderRadius: 15,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 10,
        paddingTop: 8,
    },
    text: {
        color: '#000',
    },
    textLeft: {
    },
    textRight: {
        color: '#000',
    },
    textCenter: {
        textAlign: 'center',
    },
    bubbleLeft: {
        marginRight: 70,
        //backgroundColor: '#e6e6eb',
        backgroundColor: '#007aff',
        alignSelf: 'flex-start',
    },
    bubbleRight: {
        marginLeft: 70,
        backgroundColor: '#007aff',
        alignSelf: 'flex-end',
    },
    bubbleCenter: {
        backgroundColor: '#007aff',
        alignSelf: 'center',
    },
    bubbleError: {
        backgroundColor: '#e01717',
    },
});

module.exports = Buddle;