
/**
 * Giống như base controller. nhưng cho socket
 * !Note: các thuộc tính là function (VD: connect=()=>{}) sẽ được add tạo thành command receiver khi khởi tạo route cho socketer
 */
module.exports = class BaseSocketer
{
    /**
     * Cho biết đây là class Socketer
     */
    static isSocketer = true;
    url;
    /**
     * sẽ được truyền vào khi tạo 1 socket Server
     */
    socket;

    constructor(socket)
    {
        this.socket = socket;
    }

    /**
     * Gửi data xuống client theo một command đã được định nghĩa ở phía client
     * @param {*} command 
     * @param {*} data 
     */
    send(command, data)
    {
        this.socket.emit(command, data);
    }
    /**
     * Hàm này sẽ luôn được gọi để báo cho client là command được thực hiện xong
     * Hàm sẽ được gọi khi khởi tạo route ở server.socketer.js
     */
    done(data)
    {
        this.socket.emit('done', data);
    }

    error(data)
    {
        this.socket.emit('error', data);
    }

    connect = async (data) =>
    {
        console.log('Kết nội thành công', data);
    };
    disconnect = async (data) =>
    {
        console.log('Ngắt kết nối', data);
    };
};