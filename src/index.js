import './styles/style.css';
import { OpenAI } from './OpenAI.js';
import { roles } from './Role';
import { storageAvailable } from './storage.js';
import gitlogo from './img/gitlogo.jpg';
import background from './img/background.svg'

const githubLogo = document.querySelector('.github-mark');
const mainContainer = document.querySelector('.container');
const mainContainerLogo = document.querySelector('.role-header')
const outputWindow = document.querySelector('.output');
const inputPromt = document.querySelector('.input');
const inputModel = document.querySelector('.model');
const inputTokens = document.querySelector('.tokens');
const inputTemp = document.querySelector('.temperature');
const cleanBtn = document.querySelector('.clean');
const sendBtn = document.querySelector('.submit');
const langSelect = document.querySelector('.lang');
const inputFrequency = document.querySelector('.frequency');
const inputPresence = document.querySelector('.presence');
const showOptions = document.querySelector('.input-label');
const inputContainer = document.querySelector('.input-container');
const inputYourName = document.querySelector('.your-name');
const inputAiName = document.querySelector('.ai-name');
const roleSelect = document.querySelector('.role');
const key = document.querySelector('.key');

let dialogue = [];
githubLogo.src = gitlogo;
generateRolesSelectOptions(inputYourName.value, inputAiName.value);
keyStorageInit();
let openAI = new OpenAI(key.value);

function keyStorageInit() {
    if (storageAvailable('localStorage')) {
        if (!localStorage.getItem('openAiKey')) {
            localStorage.setItem('openAiKey', key.value);
            //console.log(localStorage.getItem('openAiKey') + ' saved to local');
        }
        else {
            key.value = localStorage.getItem('openAiKey');
            //console.log(localStorage.getItem('openAiKey') + ' loaded from local');
        }
    }
    
    else {
        warningMsg(mainContainer, 'Local storage is not available!')
    }
}

function keySaveToLocalStorage() {
    if (storageAvailable('localStorage')) {
        localStorage.setItem('openAiKey', key.value);
        //console.log(localStorage.getItem('openAiKey') + ' saved to local');
    }
    
    else {
        warningMsg(mainContainer, 'Local storage is not available!')
    }
}

showOptions.addEventListener('click', () => {
    if (inputContainer.classList.contains('hide-options')) {
        inputContainer.classList.remove('hide-options');
        outputWindow.classList.remove('hide-output');
    }
    else {
        inputContainer.classList.add('hide-options');
        outputWindow.classList.add('hide-output');
    }
});

inputPromt.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        if (inputPromt.value === '') {
            warningMsg(mainContainer, 'Ask me some thing!')
        }
        else if (key.value === '') {
            warningMsg(mainContainer, 'Enter your OPEN AI key!');
        }
        else if (inputTokens.value === '' || inputTemp.value === '' || inputFrequency.value === '' || inputPresence.value === '') {
            warningMsg(mainContainer, 'Input ERROR!');
        }
        else if (inputTokens.value <= 0 || inputTokens.value > 1000) {
            warningMsg(mainContainer, 'Tokens range: 1 - 1000!');
        }
        else if (inputTemp.value < 0 || inputTemp.value > 2) {
            warningMsg(mainContainer, 'Temp range: 0 - 2!');
        }
        else if (inputFrequency.value < -2 || inputFrequency.value > 2) {
            warningMsg(mainContainer, 'Frequency range: -2 - 2!');
        }
        else if (inputFrequency.value < -2 || inputFrequency.value > 2) {
            warningMsg(mainContainer, 'Presence range: -2 - 2!');
        }
        else {
            keySaveToLocalStorage();
            openAI = new OpenAI(key.value);
            initialDialogue(inputYourName.value, inputAiName.value, roleSelect.value, langSelect.value);
            sendRequest(inputYourName.value, inputAiName.value);
            if (inputYourName.value !== '') {
                addMsg(`${inputYourName.value}: ${inputPromt.value}`);
            }
            else {
                addMsg(`You: ${inputPromt.value}`);
            }
            scrollDown();
            inputPromt.value = '';
        }
    }
});

sendBtn.addEventListener('click', (e) => { 
    e.preventDefault();
    if (inputPromt.value === '') {
        warningMsg(mainContainer, 'Ask me some thing!');
    }
    else if (key.value === '') {
        warningMsg(mainContainer, 'Enter your OPEN AI key!');
    }
    else if (inputTokens.value === '' || inputTemp.value === '' || inputFrequency.value === '' || inputPresence.value === '') {
        warningMsg(mainContainer, 'Input ERROR!');
    }
    else if (inputTokens.value <= 0 || inputTokens.value > 1000) {
        warningMsg(mainContainer, 'Tokens range: 1 - 1000!');
    }
    else if (inputTemp.value < 0 || inputTemp.value > 2) {
        warningMsg(mainContainer, 'Temp range: 0 - 2!');
    }
    else if (inputFrequency.value < -2 || inputFrequency.value > 2) {
        warningMsg(mainContainer, 'Frequency range: -2 - 2!');
    }
    else if (inputFrequency.value < -2 || inputFrequency.value > 2) {
        warningMsg(mainContainer, 'Presence range: -2 - 2!');
    }
    else {
        keySaveToLocalStorage();
        openAI = new OpenAI(key.value)
        initialDialogue(inputYourName.value, inputAiName.value, roleSelect.value, langSelect.value);
        sendRequest(inputYourName.value, inputAiName.value);
        if (inputYourName.value !== '') {
            addMsg(`${inputYourName.value}: ${inputPromt.value}`);
        }
        else {
            addMsg(`You: ${inputPromt.value}`);
        }
        scrollDown();
        inputPromt.value = '';
    }
});

langSelect.addEventListener('change', () => {
    setTimeout(cleanDialogue, 2000);
    warningMsg(mainContainer, `Language:${langSelect.value}`);
});

roleSelect.addEventListener('change', () => {
    mainContainerLogo.textContent = roleSelect.value.toUpperCase();
    setTimeout(cleanDialogue, 1000);
    warningMsg(mainContainer, `AI-Role:${roleSelect.value}`);
});

inputModel.addEventListener('change', () => {
    setTimeout(cleanDialogue, 1000);
    warningMsg(mainContainer, `Model:${inputModel.value}`);
});

cleanBtn.addEventListener('click', () => { 
    cleanDialogue();
});


function generateRolesSelectOptions(yourName, assistantName) {
    for (let i = 0; i < roles(yourName, assistantName).getRolesNames().length; i++) {
        const role = document.createElement('option');
        role.textContent = roles(yourName, assistantName).getRolesNames()[i];
        role.value = roles(yourName, assistantName).getRolesNames()[i].toLowerCase();
        roleSelect.appendChild(role);
    }
}

async function sendRequest(yourName, assistantName) {
    if (yourName === ''){
        yourName = 'You';
    }
    if (assistantName === ''){
        assistantName = 'AI';
    }
    await openAI
    .generateText(dialogue  + `\n${yourName}: `+ inputPromt.value, inputModel.value, parseFloat(inputTokens.value), parseFloat(inputTemp.value), parseFloat(inputFrequency.value), parseFloat(inputPresence.value), yourName)
    .then(text => {
        if(text.startsWith(`\n${assistantName}:`)) {
            addMsg(text);
            scrollDown();
        }
        else {
            if(text.indexOf(assistantName) == -1) 
            {
                dialogue[dialogue.length - 1] += text;
                outputWindow.lastChild.remove();
                addMsg(dialogue[dialogue.length - 1]);
                dialogue.pop();
                scrollDown();
            }
            else {
                const part1 = text.slice(0, text.indexOf(assistantName));
                dialogue[dialogue.length - 1] += part1;
                outputWindow.lastChild.remove();
                addMsg(dialogue[dialogue.length - 1]);
                dialogue.pop();
                scrollDown();
                const part2 = text.slice(text.indexOf(assistantName) + assistantName.length + 1, text.length - 1);
                addMsg(`${assistantName}: ` + part2);
                scrollDown();
            }
        }
    })
    .catch(error => {
        console.error(error);
        warningMsg(mainContainer, error);
        setTimeout(cleanDialogue, 2000);
    });
}

function initialDialogue(yourName, assistantName, role, language) {
    if (yourName === ''){
        yourName = 'You';
    }
    if (assistantName === ''){
        assistantName = 'AI';
    }
    
    if (dialogue.length == 0) {
        dialogue.push(roles(yourName, assistantName).getRoleInitByName(role, language));
    }
}

function cleanDialogue() {
    dialogue.length = 0;
    const allMessages = document.querySelectorAll('.message');
    allMessages.forEach(message => message.remove());
    warningMsg(mainContainer, 'Message history deleted!')
}

function scrollDown() {
    const bottommsg = document.querySelectorAll('.message');
    bottommsg.forEach(msg => msg.scrollIntoView());
}

function addMsg(msg) {
    const message = document.createElement('p');
    message.className = 'message';
    message.textContent = `${msg}`;
    outputWindow.append(message);
    dialogue.push(msg);
    // console.log(dialogue)
}

function warningMsg(input, msg) {
    const warningBox = document.createElement('div');
    warningBox.className = 'warning';
    warningBox.textContent = msg;
    let warningTimeout = setTimeout(() => {
        warningBox.parentNode.removeChild(warningBox);
        warningTimeout = -1;
    }, 2000);
    
    if (document.body.contains(warningBox)) {
        clearTimeout(warningTimeout);
    }
    else {
        input.parentNode.insertBefore(warningBox, input.previousSibling);
    }
}

