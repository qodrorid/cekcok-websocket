var socket = io.connect('http://localhost:8000', {'forceNew':true})
// `forceNew` berguna agar setiap ada pengunjung baru akan membuat koneksi baru

// tangkap message dari main.js - server
socket.on('messages', function(data) {
    console.log(data);
    var messages = data.map(function(data) {
        return (`
            <a 
                href="${data.content.link}" 
                target="_blank"
                class="list-group-item">
                <strong>${data.userName}</strong> : "${data.content.text}"
            </a>
        `);
    }).join(' '); // defaultnya menggunakan `, (koma)`, ubah menjadi `spasi`

    // tampilkan message ke #messages di index.html
    document.getElementById("messages").innerHTML = messages;
});

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