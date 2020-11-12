const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//get username and room from the room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

var socket = io();

//join the server 
socket.emit('joinRoom', { username, room })

//getroom users
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)
})

socket.on("message", (message) => {
    console.log(message);
    outputMessage(message)

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //emitting a message to server
    socket.emit('chatMessage', msg)
    e.target.elements.msg.value = ''
    e.target.elements.msg.focus()
})

//outputs message to DOM
function outputMessage(message) {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <div class="message">
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>
    </div>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//add rooom name to DOM
function outputRoomName(room) {
    roomName.innerHTML = room;
}

//add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}