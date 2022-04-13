const socket = io('/chat');
const getElementById = (id) => document.getElementById(id) || null;

const helloUserElement = getElementById('hello_user');
const chattingBoxElement = getElementById('chatting_box');
const formElement = getElementById('chat_form');

socket.on('user_connected', (nickname) => {
  drawNewChat(`${nickname} connected`);
});

socket.on('new_chat', (data) => {
  const { chat, nickname } = data;
  drawNewChat(`${nickname}:${chat}`);
});

socket.on('disconnect_user', (nickname) => drawNewChat(`${nickname}:bye..`));

const handlesSubmit = (event) => {
  event.preventDefault();
  const inputValue = event.target.elements[0].value;
  if (inputValue !== '') {
    socket.emit('submit_chat', inputValue);
    drawNewChat(`me: ${inputValue}`, true);
    event.target.elements[0].value = '';
  }
};

const drawHelloStranger = (nickname) => {
  helloUserElement.innerText = `Hello ${nickname} :)`;
};

const drawNewChat = (message, isMe = false) => {
  const wrapperChatBox = document.createElement('div');
  let chatBox;
  if (!isMe)
    chatBox = `
    <div class='bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  else
    chatBox = `
    <div class='bg-white w-3/4 ml-auto mr-4 my-2 p-2 rounded-lg clearfix break-all'>
      ${message}
    </div>
    `;
  wrapperChatBox.innerHTML = chatBox;
  chattingBoxElement.append(wrapperChatBox);
};

function helloUser() {
  const phoneNumber = prompt(`What is your nickname`);
  socket.emit('find_user', nickname, (data) => {
    drawHelloStranger(data);
  });
}

function init() {
  helloUser();
  formElement.addEventListener('submit', handlesSubmit);
}

init();
