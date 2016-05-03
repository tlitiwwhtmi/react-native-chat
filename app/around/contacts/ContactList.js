/**
 * Created by administrator on 16/4/29.
 */
/**
 * Created by duanhao on 16/4/24.
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

var Http = require("./../utils/Http");

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

var windowSize = Dimensions.get('window');

const ds = new ListView.DataSource({
    rowHasChanged : (row1 , row2) => row1 != row2,
});

var ContactList = React.createClass({

    getInitialState : function () {
        return {
            peoples:[]
        };
    },

    componentWillMount: function () {

        this.getContacts();
    },

    componentDidUnMount : function () {
    },



    render : function () {
        return (
            <View>
                <MyBar
                    title="Contacts"
                />
                <View style={styles.listContainer}>
                    <View style={styles.searchRow}>
                        <TextInput
                            autoCapitalize="none"
                            autoCorrect={false}
                            clearButtonMode="always"
                            placeholder="Search from contact..."
                            style={[styles.searchTextInput, this.props.searchTextInputStyle]}
                            testID="explorer_search"
                            value={this.props.filter}
                        />
                    </View>
                    {this.renderContactList()}
                </View>
            </View>
        );
    },

    renderContactList : function () {
        var contactData = [];
        if(this.state.peoples && this.state.peoples){
            for(var i=0;i<this.state.peoples.length;i++) {
                if (this.state.peoples[i].userName != this.props.user.userName) {
                    contactData.push(this.state.peoples[i]);
                }
            }
        }
        var dataSource = ds.cloneWithRows(contactData);
        return (
            <ListView
                style={styles.list}
                dataSource={dataSource}
                renderRow={this.renderContactRow}
                keyboardShouldPersistTaps={true}
                automaticallyAdjustContentInsets={false}
                keyboardDismissMode="on-drag"
                enableEmptySections={true}
            />
        );
    },

    renderContactRow : function (data) {
        return this.renderRow(data,()=>this.handlePressOnContact(data));
    },

    renderRow : function (data,handler) {
        return (
            <View key={data.id}>
                <TouchableHighlight onPress={handler}>
                    <View style={styles.row}>
                        <View style={{justifyContent:'flex-start'}}>
                            <Text style={styles.rowTitleText}>
                                {data.userName}
                            </Text>
                            <Text style={styles.rowDetailText}>
                                more info will show here in next version
                            </Text>
                        </View>

                    </View>
                </TouchableHighlight>
                <View style={styles.separator} />
            </View>
        );
    },

    renderUnreadNum : function (data) {
        if(data.unread){
            var width = 20;
            var text = data.unread;
            if(data.unread >= 10){
                width = 30;
            }if(data.unread >= 100){
                text = "99+"
            }
            return (
                <View>
                    <View style={{height:20,width:width,borderRadius:10,paddingHorizontal:7,paddingVertical:2,backgroundColor: '#F43F40'}}>
                        <Text style={{color:'white'}}>{text}</Text>
                    </View>
                </View>
            );
        }
        return null;
    },

    handlePressOnContact : function (data) {
        //this.props.pressContact(data);
    },

    getContacts : function () {
        Http.getFriendList(this.props.user.id, function (friendList) {
            this.setState({peoples : friendList});
        }.bind(this));
    }
});


var styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        marginTop:APPBAR_HEIGHT+STATUSBAR_HEIGHT,
    },
    list: {
        backgroundColor: '#eeeeee',
        height:windowSize.height-APPBAR_HEIGHT-STATUSBAR_HEIGHT-30-20-50
    },
    sectionHeader: {
        padding: 5,
        fontWeight: '500',
        fontSize: 11,
    },
    group: {
        backgroundColor: 'white',
    },
    row: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 8,
        flexDirection : 'row'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#bbbbbb',
        marginLeft: 15,
    },
    rowTitleText: {
        fontSize: 17,
        fontWeight: '500',
    },
    rowDetailText: {
        fontSize: 15,
        color: '#888888',
        lineHeight: 20,
    },
    searchRow: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
    searchTextInput: {
        backgroundColor: 'white',
        borderColor: '#cccccc',
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 8,
        height: 30,
    },
});

module.exports = ContactList;