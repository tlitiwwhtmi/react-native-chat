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

const Bundle = require("./Buddle");


class MessageView extends React.Component {

    render(){
        var {
            rowData
        } = this.props;
        return (
            <View>
                <View style={[styles.rowContainer,{justifyContent:rowData.from.id != this.props.client.id ? "flex-end" : "flex-start"}]}>
                    {this.renderName(rowData,1)}
                    <Bundle
                        {...rowData}
                        client={this.props.client}
                    />
                    {this.renderName(rowData,2)}
                </View>
            </View>
        );
    }

    renderName(rowData,type){
        if((rowData.from.id == this.props.client.id && type == 1) || (rowData.from.id != this.props.client.id && type == 2)){
            return (
                <View style={[styles.nameView,{justifyContent: "flex-start"}]}>
                    <Text style={{color:'#fff'}}>
                        {rowData.from.id != this.props.client.id ? "我" : rowData.from.userName}
                    </Text>
                </View>
                );
        }
        return null;
    }

}

var styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    name: {
        color: '#aaaaaa',
        fontSize: 12,
        marginLeft: 55,
        marginBottom: 5,
    },
    nameView : {
        backgroundColor:'#333333',
        paddingTop:4,
        borderRadius:5,
        height:25,
        paddingLeft:8,
        paddingRight:8,
        marginLeft:8,
        marginRight:8,
        marginTop : 4,
    },
    nameInsideBubble: {
        color: '#666666',
        marginLeft: 0,
    },
    imagePosition: {
        height: 30,
        width: 30,
        alignSelf: 'flex-end',
        marginLeft: 8,
        marginRight: 8,
    },
    image: {
        alignSelf: 'center',
        borderRadius: 15,
    },
    imageLeft: {
    },
    imageRight: {
    },
    spacer: {
        width: 10,
    },
    status: {
        color: '#aaaaaa',
        fontSize: 12,
        textAlign: 'right',
        marginRight: 15,
        marginBottom: 10,
        marginTop: -5,
    },
});

module.exports = MessageView;