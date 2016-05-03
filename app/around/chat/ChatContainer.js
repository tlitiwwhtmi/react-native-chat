/**
 * Created by administrator on 16/4/24.
 */
/**
 * Created by duanhao on 16/4/24.
 */

import React, {
    ListView,
    StyleSheet,
    TextInput,
    Animated,
    Dimensions,
    PixelRatio,
    Platform,
    Text,
    View,
    Image,
    DeviceEventEmitter
} from 'react-native';

import Button from 'react-native-button';

var MyBar = require("./../bar/MyBar");

var backIcon = require("./../../../images/back2.png")

const moment = require("moment");

var Messenger = require("./../utils/Messenger");

const MessageView = require("./Message");

var messengerId;

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const ds = new ListView.DataSource({
    rowHasChanged : (row1 , row2) => row1 != row2,
});


var windowSize = Dimensions.get('window');
var backImg = require("./../../../images/loginback.jpg");

class ChatContainer extends React.Component {
    constructor(props) {
      super(props);
      // 初始状态
      this.renderRow = this.renderRow.bind(this);
      this.onKeyboardWillShow = this.onKeyboardWillShow.bind(this);
      this.onKeyboardWillHide = this.onKeyboardWillHide.bind(this);
      this.onKeyboardDidHide = this.onKeyboardDidHide.bind(this);
      this.onKeyboardDidShow = this.onKeyboardDidShow.bind(this);
        this.getChatData = this.getChatData.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onSend = this.onSend.bind(this);
        this.onLeftPress = this.onLeftPress.bind(this);
      this.listViewMaxHeight = Dimensions.get('window').height-44-APPBAR_HEIGHT-STATUSBAR_HEIGHT;
      this.state = {
          height: new Animated.Value(this.listViewMaxHeight),
          dataSource : null,
          chatData : [],
          text : '',
      };


    }

    componentWillMount () {
        DeviceEventEmitter.addListener('keyboardWillShow', this.onKeyboardWillShow.bind(this));
        DeviceEventEmitter.addListener('keyboardWillHide', this.onKeyboardWillHide.bind(this));
        DeviceEventEmitter.addListener('keyboardDidShow',this.onKeyboardDidShow.bind(this));
        DeviceEventEmitter.addListener('keyboardDidHide',this.onKeyboardDidHide.bind(this));
    }

    componentDidMount() {
        if(messengerId != null){
            Messenger.removeMsgListener(messengerId);
        }
        messengerId = Messenger.registMsgListener(this.getChatData);
        this.getChatData();

        if(this.refs.listView){
            this.scrollResponder = this.refs.listView.getScrollResponder();
        }
    }

    componentWillUnMount() {
        console.log(1231312);
    }

    componentDidUnMount() {
        Messenger.removeMsgListener(messengerId);
    }

    render(){
        return (
            <View>
                <MyBar
                    title={this.props.client.userName}
                    leftIcon={backIcon}
                    leftTitle="back"
                    onLeftPress={this.onLeftPress}
                />
                <View style={styles.container}>
                    {this.renderAnimated()}
                    {this.renderTextInput()}
                </View>
            </View>
        );
    }

    onLeftPress(){
        if(messengerId != null){
            Messenger.removeMsgListener(messengerId);
        }
        messengerId == null;
        Messenger.unSetCurrentClient();
        this.props.onPressBack();
    }

    getChatData(){
        var data = [];
        for(var i=0;i<Messenger.data.chatData.length;i++){
            var chatData = Messenger.data.chatData[i];
            if(chatData.from.id == this.props.client.id || chatData.to.id == this.props.client.id){
                data.push(chatData);
            }
        }
        if(this.state.chatData != data){
            this.setState({chatData : data});
        }
    }

    onKeyboardDidHide(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillHide(e);
        }

        // TODO test in android
        if (this.props.keyboardShouldPersistTaps === false) {
            if (this.isLastMessageVisible()) {
                this.scrollToBottom();
            }
        }
    }

    onKeyboardWillHide() {
        Animated.timing(this.state.height, {
            toValue: this.listViewMaxHeight,
            duration: 150,
        }).start();
    }

    onKeyboardDidShow(e) {
        if (Platform.OS === 'android') {
            this.onKeyboardWillShow(e);
        }

        setTimeout(() => {
            this.scrollToBottom();
        }, (Platform.OS === 'android' ? 200 : 100));
    }

    onKeyboardWillShow(e) {
        Animated.timing(this.state.height, {
            toValue: this.listViewMaxHeight - e.endCoordinates.height,
            duration: 200,
        }).start();
    }

    scrollToBottom(){
        //this.scrollResponder.scrollT
    }

    onChangeText(text){
        this.setState({text:text});
    }

    onSend(){
        Messenger.sendChatMsg(this.state.text,this.props.user,this.props.client);
        this.setState({text:""});
        this.getChatData();
    }

    renderTextInput(){
        var buttonText = "Send";
        return (
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    value={this.state.text}
                    onChangeText={this.onChangeText}
                    returnKeyType={this.onSend ? 'send' : 'default'}
                    onSubmitEditing={this.onSend}
                    enablesReturnKeyAutomatically={true}
                />
                <Button
                    style={styles.sendButton}
                    onPress={this.onSend}
                >
                    {buttonText}
                </Button>
            </View>
        );
    }

    renderAnimated(){
        return (
            <Animated.View style={{height:this.state.height}}>
                {this.renderChatList()}
            </Animated.View>
        );
    }

    renderChatList(){
        return (
            <ListView
                ref="listView"
                dataSource={ds.cloneWithRows(this.state.chatData)}
                renderRow={this.renderRow}
                enableEmptySections={true}
            />
        );
    }

    renderRow(rowData){
        return (
            <View>
                {this.renderDate(rowData)}
                <MessageView
                    rowData={rowData}
                    client={this.props.client}
                />
            </View>
        );
    }

    renderDate(rowData){
        lastRow = this.getPreviousMessage(rowData);
        if(rowData.date){
            var thisDate = null;
            var lastDate = null;
            if(rowData.date instanceof Date){
                thisDate = rowData.date
            }else{
                thisDate = new Date(rowData.date)
            }
            if(lastRow){
                if(lastRow.date instanceof Date){
                    lastDate = lastRow.date;
                }else{
                    lastDate = new Date(lastRow.date)
                }
            }

            if (!lastRow){
                return (
                    <Text style={[styles.date]}>
                        {moment(thisDate).calendar()}
                    </Text>
                );
            }else{
                const diff = moment(thisDate).diff(moment(lastDate), 'minutes');
                if(diff > 5){
                    return (
                        <Text style={[styles.date]}>
                            {moment(thisDate).calendar()}
                        </Text>
                    );
                }
            }
        }
        return null;
    }

    getPreviousMessage(message){
        for(let i=0;i<this.state.chatData.length;i++){
            if(this.state.chatData[i].id == message.id && i-1 >= 0){
                return this.state.chatData[i-1]
            }
        }
        return null;
    }
}

const exampleData = [
    {
        id : 1,
        key: '段浩',
        text: '今天过得怎么样?',
        src : 'self',
        date: '2016-4-24 09:32:00',
    },
    {
        id : 2,
        key: '张哲',
        text: '还好吧!你呢?',
        src : 'out',
        date: '2016-4-24 09:32:00',
    },
    {
        id : 3,
        key: '江梓豪',
        text: '今天一直在下雨!!!今天一直在下雨!!!今天一直在下雨!!!今天一直在下雨!!!今天一直在下雨!!!今天一直在下雨!!!',
        src : 'out',
        date: '2016-4-24 09:32:00',
    },
    {
        id : 4,
        key: '金光兴',
        text: '是的,睡了一天.',
        src : 'self',
        date: '2016-4-24 12:32:00',
    },
    {
        id : 5,
        key: '曹凡',
        text: '我也是,打了一天的游戏',
        src : 'out',
        date: '2016-4-24 09:32:00',
    },
    {
        id : 6,
        key: '付旭东',
        text: '晚上一起出去吃饭 ?',
        src : 'self',
        date: '2016-4-24 09:32:00',
    },
    {
        id : 7,
        key: '刘永浪',
        text: '怎么样 ?',
        src : 'self',
        date: '2016-4-24 09:32:00',
    },
]



var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        marginTop:APPBAR_HEIGHT+STATUSBAR_HEIGHT,
    },
    bg: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: windowSize.width,
        height: windowSize.height
    },
    listView: {
        flex: 1,
    },
    textInputContainer: {
        height: 44,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#b2b2b2',
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor:'#F5F5F5',
    },
    textInput: {
        alignSelf: 'center',
        height: 30,
        width: 100,
        backgroundColor: '#FFF',
        flex: 1,
        padding: 0,
        margin: 0,
        fontSize: 15,
    },
    sendButton: {
        marginTop: 11,
        marginLeft: 10,
    },
    date: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 8,
    },
    link: {
        color: '#007aff',
        textDecorationLine: 'underline',
    },
    linkLeft: {
        color: '#000',
    },
    linkRight: {
        color: '#fff',
    },
    loadEarlierMessages: {
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadEarlierMessagesButton: {
        fontSize: 14,
    },
});

module.exports = ChatContainer;