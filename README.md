# Sharing CekCokQodr
Dilaksanakan di [QODR Pusat](https://goo.gl/maps/MMfXe12rmdJ2) pada 19.50 WIB - 21.30 WIB

Pemateri [@kodeartisan](https://github.com/kodeartisan) a.k.a **Dika Budi Aji**

## Realtime Apps with Node & Websockets
### Node.js  
> Bahasa pemrograman javascript yang berjalan disisi server.
- Kelebihan:
  - mengurangi learning curve untuk mempelajari bahasa server yg lain.
  - dapat berjalan di semua OS tanpa perlu perubahan
  - mendukung JSON untuk transfer data
  - Non Blocking IO, dapat melakukan proses secara paralel
  - Dibangun diatas bahasa yang paling populer
  - Dukungan package yang melimpah

### Websockets
> Protokol komunikasi dua arah yang digunakan oleh browser.
- berbeda dengan AJAX yg hanya satu arah, tetapi dari mengirim request sekaligus menerima data dari server.
- teknologi HTML5 jadi ada browser supportnya

### Tools yang dibutuhkan
- Express.js
- Socket.io

### Live Coding
- Buat folder baru untuk project ini
- Buka terminal lalu `yarn init` enter sampai selesai
- Tambahkan express dan socket.io lewat Yarn
  ```bash
  $ yarn add express --save --verbose
  $ yarn add socket.io --save --verbose
  ```
  * `--save` berguna untuk menyimpang nama package di file `package.json`
  * `--verbose` berguna untuk melihat log proses
- Buat folder `server`, didalamnya buat file `main.js`, lalu buat server untuk node
  ```javascript
    var express = require('express');
    var app = express();
    var server = require('http').Server(app);

    // insialisasi folder app
    app.use(express.static('app'));

    // buat rooting ke index untuk tes server
    app.get('/', function(req, res) {
        res.send('hello world');
        console.log("Connected to express");
    });

    // set server berjalan di port 8000
    server.listen(8000);
  ```
- Jalankan server lewat terminal `node server/main.js`
- Akses lewat browser `http://localhost:8000`
- Buat server untuk socket.io dengan menambahkan
  ```javascript
    var io = require('socket.io')(server);

    io.on('connection', function(socket) {
        console.log("connected to socket.io");
    });
  ```
- Matikan server lewat terminal lalu jalankan kembali
- Buat folder `app`
- Buat file index.html dan main.js
- Pada index.html tambahkan
  ```html
    <!-- Bootstrap CDN -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">  
    <!-- Socket.io source -->
    <script type="text/javascript" src="/socket.io/socket.io.js"></script>
    <script type="text/javascript" src="main.js"></script>  
  ```
- Koneksikan Backend socket.io dengan Frontend, buka main.js
  ```javascript
    var socket = io.connect('http://localhost:8000', {'forceNew':true})
    // `forceNew` berguna agar setiap ada pengunjung baru akan membuat koneksi baru
  ```  
- Ke main.js server - tambahkan 
   ```javascript
    var messages = [
        {
            userId: 1,
            messageId: 10,
            userName: "Holowaychuck",
            content: {
                text: 'Hello world',
                link: 'http://google.com'
            }
        },
        {
            userId: 2,
            messageId: 11,
            userName: "SindraSornus",
            content: {
                text: 'Awesome Github',
                link: 'http://github.com'
            }
        },    
    ];
   ```
- Ke main.js - app
  ```javascript
    // tangkap message dari main.js - server
    socket.on('messages', function(data) {
        console.log(data);
        var messages = data.map(function(data) {
            return (`
                <div>
                    ${data.userName}
                </div>
                <a href="${data.content.link}">
                    ${data.content.text}
                </a>
            `);
        });

        // tampilkan message ke #message di index.html
        document.getElementById("messages").innerHTML = messages;
    });       
   ```
- Buat form di index.html
  ```html
    <div class="container">
        <h1>Realtime Apps with Node & Websocket</h1>

        <!-- preventDefault agar gk bisa langsung ke submit -->
        <form onsubmit="event.preventDefault(); addMessage(this)">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" name="">
            </div>
            <div class="form-group">
                <label for="linkAddress">Link Address</label>
                <input type="text" class="form-control" id="linkAddress" name="">
            </div>
            <div class="form-group">
                <label for="message">Message</label>
                <input type="text" class="form-control" id="message" name="">        
            </div>                

            <input type="submit" value="Send" class="btn btn-primary">
        </form>
        <!-- TAMPILKAN DATA MESSAGE DARI CLIENT -->
        <div id="messages" class="list-group" style="margin-top: 2em"></div>
    </div>  
  ```
- Ke main.js - app buat function
  ```javascript
    function addMessage(e) {
        userName = getValueFromElement("username");
        message = getValueFromElement("message");
        link = getValueFromElement("linkAddress");

        var data = {
            userName: userName,
            content: {
                text: message,
                link: link
            }
        }

        // ngirim data ke server
        socket.emit('new-message', data);

        // return false agar gk ke submit
        return false;
    }

    // fungsi untuk mengambil value dari inputan
    function getValueFromElement(element) {
        return document.getElementById(element).value;
    }
  ```  
- Ke main.js - server tambahkan
  ```javascript
    // buat koneksi ke socket.io
    io.on('connection', function(socket) {
        console.log("connected to socket.io");
        // kirim message ke main.js - app
        socket.emit('messages', messages);
        // tambahkan data dari array message yg sdh ada
        socket.on('new-message', function(data) {
            messages.push(data);
            // kirim event ke main.js app
            io.sockets.emit("messages", messages)
        });
    });
  ```

### TIPS
- Pakai [nodemon](https://github.com/remy/nodemon) untuk merestart node server secara otomatis
