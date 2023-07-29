/**
 * Khởi tạo các socket server và quản lý chúng.
 * 1. Để tạo 1 socket server thì chỉ cần tạo thêm socketer (giống như controller, class này sẽ tự động thêm vào url tương ứng.)
 * 
 * Việc khởi tạo socketServer được thực hiện trong file /bin/www khi bắt đầu start server
 */

var jwt = require('jsonwebtoken');
const { Server: SocketServer } = require('socket.io');
var cookie = require('cookie');
const allSocketer = require('./index');
const Ulti = require('../uti');


const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

module.exports = class Server
{
    io;
    constructor(httpServer, sessionMiddleware)
    {
        try
        {
            this.io = new SocketServer(httpServer);

            //Tạo namespage(url) và các method receiver trên namespage đó, dựa trên định nghĩ của socketer(Controller)
            this.createRoute(allSocketer, null, sessionMiddleware);

            //Loại bỏ kết nối đến namespage mặc định (/)
            this.io.on('connection', (socket) =>
            {
                console.log(`Socket id (${socket.id}) kết nối không cho phép`);
                socket.emit('error', { mess: 'Kết nối không cho phép, thử lại với đường dẫn chính xác' });
                socket.disconnect();

            });

            //Loại bỏ kết nối đến namespage không cho phép
            this.io.of(/.*/).on('connection', (socket) =>
            {
                console.log(`Socket id (${socket.id}) kết nối không cho phép`);
                socket.emit('error', { mess: 'Kết nối không cho phép, thử lại với đường dẫn chính xác' });
                socket.disconnect();
            });
        }
        catch (err)
        {
            console.log(err);
        }

    }

    checkLoginMiddleware = (socket, next) =>
    {
        let session = socket.request.session;

        //nếu đã đăng nhập
        if (session && session.user)
        {
            console.log(`Socket id (${socket.id}) kết nối và xác thực thành công.`);
            next();
        }
        else if (this.validToken(socket))
        {
            console.log(`Socket id (${socket.id}) kết nối và xác thực thành công.`);
            next();
        }
        else
        {
            console.log(`Socket id (${socket.id}) xác thực thất bại.`);
            const err = new Error('not authorized');
            err.data = { mess: 'Xác thực không thành công, xin vui lòng Refresh lại trang.' };
            next(err);
        }
    };
    /**
     * Tạo route cho từng socketer. mỗi method của socketer sẽ là 1 command (event, hàm) receive trên server khi client gửi(emit) command đến
     * @param {*} socketer 
     */
    createRoute(socketer, url, sessionMiddleware)
    {
        //Không phải là class, nghĩa là  thuộc tính, hoặc namespacce (vd: fb.)
        if (!Ulti.isClass(socketer))
        {
            //Lấy tất cả tên thuộc tính
            Object.keys(socketer).forEach((key) =>
            {
                return this.createRoute(socketer[key], url ? url + '/' + key : '/' + key, sessionMiddleware);
            });
        }

        if (socketer.isSocketer && socketer.isSocketer === true)
        {
            url = url.toLowerCase();
            //console.log('create socketer url: ' + url);

            //Vìa SocketIO không cho phép add middleware cho all namespage
            //Vìa vậy phải add middleware trên từng namespage (url)

            //Chuyển middleware expressjs thành middleware của SocketIo. để lấy được session của expressJs. để kiểm tra đăng nhập
            this.io.of(url).use(wrap(sessionMiddleware));

            //!Kiểm tra và xác thực đăng nhập
            //this.io.of(url).use(this.checkLoginMiddleware);

            //Lắng nghe kết nối từ client đển url của socketer này
            this.io.of(url).on('connection', (socket) =>
            {
                //Khởi tạo 1 đối tượng socketer
                let obj = new socketer(socket);
                obj.url = url;

                let methods = Object.getOwnPropertyNames(obj).filter((method) =>
                {
                    return typeof obj[method] === 'function';
                });

                try
                {
                    //Thêm các sự kiện receive cho socketer này
                    methods.forEach((method) =>
                    {
                        socket.on(method, async (data) =>
                        {
                            try
                            {
                                if (!obj[method])
                                {
                                    obj.done({ mess: `Phương thực ${method} không tồn tại.` });
                                    return;
                                }
                                //truyền thêm socket vào để method của socketer có thể lấy thêm để xử lý VD lấy socketId
                                obj[method](data, socket).then(() =>
                                {
                                    //Luôn được gọi để báo cho client biết là đã thực thi command xong
                                    obj.done(data);
                                });
                            }
                            catch (err)
                            {
                                console.log(err);
                            }


                        });
                    });
                }
                catch (err)
                {
                    obj.error(err.mess);
                    console.log(err);
                }
            });
        }
    }


    /**
     * Kiểm tra đăng nhập của người dùng. Vì dùng trên CMS nên sẽ kiểm tra cookie đăng nhập có hợp lệ không
     * @param {*} socket 
     * @returns 
     */
    async validToken(socket)
    {
        try
        {
            if (!socket.handshake.headers.cookie)
                return false;

            let cookies = cookie.parse(socket.handshake.headers.cookie);
            const token = cookies[process.env.RM_COOKIE_NAME];
            if (!token)
                return false;

            let result = jwt.verify(token, process.env.RM_JWT_KEY);
            let userDb = await per.member.loginById(result.id);
            if (!userDb)
            {
                return false;
            }

            return true;
        }
        catch (err)
        {
            console.log(err);
            return false;
        }
    }


};