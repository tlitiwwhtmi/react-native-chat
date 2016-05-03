/**
 * Created by administrator on 16/4/29.
 */

import React, {
    ListView,
    NavigationExperimental,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    View,
    Platform,
    Dimensions
} from 'react-native';

var MyBar = require("./../bar/MyBar");

import Button from 'react-native-button';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

var windowSize = Dimensions.get('window');

var AboutView = React.createClass({
    render : function () {
        return (
            <View>
                <MyBar
                    title="About"
                />
                <View style={styles.listContainer}>
                    <View style={{height:100}}></View>
                    <View>
                        <Button
                            containerStyle={{padding:10, height:45, overflow:'hidden', borderRadius:4, backgroundColor: '#F43F40'}}
                            style={styles.whiteFont}
                            onPress={this.props.logout}
                        >
                            Log out
                        </Button>
                    </View>
                </View>
            </View>
        );
    }
});


var styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginTop: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    },

    submitBtn : {
        backgroundColor: '#FF3366',
        alignItems: 'center',
        height:50,
        width: windowSize.width,
    },
    whiteFont: {
        color: '#FFF'
    }
});

module.exports = AboutView;