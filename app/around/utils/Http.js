/**
 * Created by administrator on 16/4/29.
 */


var Http = {

    baseUrl : null,

    initHttp : function (baseUrl) {
      this.baseUrl = baseUrl;
    },

    getFriendList : function (id, cb) {
        if(!id){
            cb();
            return;
        }
        fetch(this.baseUrl+'/listfriend/'+id)
            .then((response) => response.text())
            .then((responseText) => {
                cb(JSON.parse(responseText).friends);
            })
            .catch((error) => {
                console.warn(error);
            });
    }
};

module.exports = Http;