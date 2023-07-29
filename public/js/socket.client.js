/**
 * Class làm client socket. chuẩn hóa chung để các trang phía client có thể sử dụng
 * ! Trước khi dùng cần import link js của Socket.io: 
 * !     link trên chính website local này: /socket.io/socket.io.js
 * !     link trên cdn https://cdn.socket.io/4.5.4/socket.io.min.js
 * !     Truy cập vào https://socket.io/ để lấy phiên bản mới nhất
 */
class SocketClient
{
    socket = null;
    config = {
        //cấu hình path cho socket client này VD: /client hoặc /dosomthing tương ứng với url trong socketer trên server (actionTest.scoketter.js)
        url: '/',
        allowLog: true,
        //Cho phép tự động bật loading khi Send, và tắt loading khi receive (show loading trên web)
        allowLoading: false,
        autoConnect: true,

        //Cấu hình các hàm nhận từ server trả về, định nghĩa sẵn các hàm thường có: connect, disconnect...
        receives: {
            //Kết nối thành công
            connect: (data) => { },
            //Ngắt kết nối thành công
            disconnect: (data) => { },
            //Kết nối đến server bị lỗi.
            connect_error: (err) => { },
            //Nếu trên server tạo new Error (custom lỗi - tạo lỗi bằng tay) --> thì không được --> nên cần tạo 1 sự kiện để lăng nghe nếu có lỗi gì đó từ server
            error: (data) => { },

        },
        callback: {
            showLoading: (data) =>
            {
                loading.show();
            },
            hideLoading: (data) =>
            {
                loading.hide();
            }
        }
    }
    constructor(config)
    {
        this.config = $.extend(true, this.config, config);

        let rootThis = this;
        if (rootThis.config.autoConnect)
        {
            rootThis.socket = io(rootThis.config.url, { autoConnect: rootThis.config.autoConnect });
            rootThis.addReceive();
        }
    }

    addReceive()
    {
        let rootThis = this;

        //Hàm này luôn có để biết khi nào server chạy xong command
        rootThis.socket.on('done', function (data)
        {
            if (rootThis.config.allowLoading)
                rootThis.config.callback.hideLoading(data);
        });

        let commands = Object.keys(rootThis.config.receives);
        commands.forEach((command) =>
        {
            rootThis.socket.on(command, function (data)
            {
                if (rootThis.config.allowLog)
                {
                    console.log(`${rootThis.config.url}-${rootThis.socket.id}: ${command} - data:`, data);
                }
                rootThis.config.receives[command](data);
            });
        });
    }

    connect(url)
    {
        let rootThis = this;

        if (rootThis.isConnected())
        {
            rootThis.disconnect();
        }
        if (url)
        {
            rootThis.socket = io(url, {});
            //rootThis.socket = io(url, { autoConnect: true, forceNew: true });
        }
        else
        {
            rootThis.socket = io(rootThis.config.url, {});
        }
        rootThis.addReceive();
    }
    disconnect()
    {
        let rootThis = this;

        if (rootThis.config.allowLog)
        {
            console.log(`${rootThis.config.url}-${rootThis.socket.id}: disconnect`);
        }

        rootThis.socket.disconnect();
    }

    isConnected()
    {
        return this.socket && this.socket.connected;
    }

    info()
    {
        let rootThis = this;
        return `${rootThis.config.url} - ${rootThis.socket.id} |->`;
    }
    /**
     * Gửi data đến server theo command 
     * @param {Lệnh gửi đến server} command 
     * @param {Dữ liệu gửi đến server} data 
     */
    send(command, data, timeout)
    {
        let rootThis = this;
        if(!rootThis.isConnected())
        {
            console.log('Socket chua ket noi');
            return;
        }

        if (rootThis.config.allowLog)
        {
            console.log(`${rootThis.config.url}-${rootThis.socket.id}: ${command} - data:`, data);
        }
        if (rootThis.config.allowLoading)
            rootThis.config.callback.showLoading(data);

        if (timeout && timeout > 0)
            rootThis.socket.timeout(timeout).emit(command, data);
        else
            rootThis.socket.emit(command, data);
    }

}