/**
 * Created by administrator on 16/4/27.
 */

/**
 * Created by administrator on 16/4/26.
 */


var Messenger = {

    callBackList : [],

    errorCallbackList : [],

    currentClient : null,

    setCurrentClient : function (data) {
        this.currentClient = data;
        for(var i=0;i<this.data.peopleData.length;i++){
            if(this.data.peopleData[i].id == data.id){
                if(this.data.peopleData[i].unread){
                    this.data.peopleData[i].unread = null;
                    return;
                }
            }
        }
    },

    unSetCurrentClient : function () {
      this.currentClient = null;
    },

    registMsgListener : function (callback) {
        if(callback){
            var index = this.callBackList.length + 1;
            this.callBackList.push({
                index : index,
                callback : callback
            });
            return index;
        }
    },

    removeMsgListener : function (index) {
        for(var i=0;i<this.callBackList.length;i++){
            var obj = this.callBackList[i];
            if(obj.index == index){
                this.callBackList.splice(i,1);
                return;
            }
        }
    },

    registErrorListener : function (callback) {
        if(callback){
            var index = this.errorCallbackList.length + 1;
            this.errorCallbackList.push({
                index : index,
                callback : callback
            });
            return index;
        }
    },

    removeErrorListener : function (index) {
        for(var i=0;i<this.errorCallbackList.length;i++){
            var obj = this.errorCallbackList[i];
            if(obj.index == index){
                this.errorCallbackList.splice(i,1);
                return;
            }
        }
    },

    data : {
        chatData : [],
        peopleData : []
    },

    socket : null,

    initSocket : function (url, callback) {

        this.socket = new WebSocket(url);

        this.socket.onopen = function () {
            this.initListener();
            if(callback){
                callback(this.socket);
            }
        }.bind(this);

        this.socket.onerror = function (env) {
            for(var i=0;i<this.errorCallbackList.length;i++){
                var obj = this.errorCallbackList[i];
                if(obj.callback){
                    obj.callback(env);
                }
            }
        }.bind(this)

    },

    initListener : function () {
        this.socket.onmessage = function (e) {
            var msg = JSON.parse(e.data);
            this.handleReceiveMsg(msg);
            for(var i=0;i<this.callBackList.length;i++){
                var obj = this.callBackList[i];
                if(obj.callback){
                    obj.callback();
                }
            }
        }.bind(this);
    },

    sendMsg : function (data, callback) {
        if (this.socket) {
            this.socket.send(data);
            //more work to do with the callback;
        }else{
            if(callback){
                callback("please init messager first");
            }
        }
    },

    sendChatMsg : function(content,user,client){
        var msg = this.generateMsg("msg",user,user,client,content);
        this.handleReceiveMsg(JSON.parse(msg));
        if(this.socket){
            this.socket.send(msg);
        }
    },

    generateUUID : function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },

    generateMsg : function(type,user,from,to,msg) {
        var data = {
            id : this.generateUUID(),
            type : type,
            user : user,
            from: from,
            to : to,
            content : msg,
            date : new Date()
        };
        return JSON.stringify(data);
    },

    handleReceiveMsg : function (msg) {
        if (msg.type == 'list') {
            this.data.peopleData = msg.peoples;
        }
        if (msg.type == 'msg') {
            var stateMsg = this.data.chatData;
            for (var i = 0; i < stateMsg.length; i++) {
                if (stateMsg[i].id == msg.id) {
                    return;
                }
            }
            stateMsg.push(msg);
            this.caculateUnread(msg);
            this.data.chatData = stateMsg;
        }
    },

    caculateUnread : function (msg) {
        for(var i=0;i<this.data.peopleData.length;i++){
            if(msg.from.id == this.data.peopleData[i].id){
                if(this.currentClient && msg.from.id == this.currentClient.id){
                    return;
                }else{
                    if(this.data.peopleData[i].unread){
                        this.data.peopleData[i].unread ++;
                    }else{
                        this.data.peopleData[i].unread = 1;
                    }
                    return;
                }
            }
        }
    }

};

module.exports = Messenger;