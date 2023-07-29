
1. server.socketer.js
    Khởi tạo và quản lý các socketer

    1.1. action_1.socketer.js, action_2.socketer.js
        là các socketer (nó như contorller), mỗi socketer tương ứng với 1 url nhất định, theo đường dẫn và tên class của socketer đó
        VD: /fb/action_1.socketer.js --> đường dẫn (route) của nó là /fb/action_1 (quy về là chữ thường hết, mặc dùng tên class là Action_1)

2. base.socketer.js
    Là class để các class socketer kề thừa. nó sẽ chứa các properties và method mặc định cho mỗi socketer.

3. scoket.client.js
    Là file baseclass dành cho client. mỗi 1 client thì cần tạo 1 object (instance) cho từ class này.
    VD: var client = new SocketClient(config); trong file /views/home.ejs