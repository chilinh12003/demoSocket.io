const BaseSocketer = require('../base.socketer');
/**
 * Tất cả các hàm là dùng để receive
 * ham send là hàm callback để gửi data đến client
 */
module.exports = class Action_2 extends BaseSocketer
{
    constructor(socket)
    {
        super(socket);
    }

    //! Receive Method
    //#region Receive Method
    receiveContent = async (data) =>
    {
        console.log(`Socket id (${this.socket.id}) receiveContent:`, data);
        this.send('updateStatus', { mess: 'Server: Receive Conent is: ' + data.content });
    };

    //#endregion
};


