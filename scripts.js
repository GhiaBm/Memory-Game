const formLabel = document.querySelector('.form_content label');
const formInput = document.querySelector('#name');
const btnStart = document.querySelector('#btn_start');
const inputInfos = document.querySelector('#input_infos');
const highscore = document. querySelector('#highscore');
let timerRef = document.querySelector('#timerRef');
const allCard = document.querySelectorAll('.main_container_card');

//VARIABLES 
let nameChecked = false;
let selectedCard = false;
let cardNumber = 0;
let [minutes, seconds] = [0,0];
let lockCard = false;

let currentPlayer = {
    name : '',
    time : ''
};

// CONNECTION
formInput.addEventListener('input', checkName);
btnStart.addEventListener('click', startGame);

// function to check if name is checked or not with the input to give, later in function startGame we will use nameChecked so if its not the button will be disabled
function checkName(e){   
    currentPlayer.name = e.target.value;

    formLabel.classList.add('anim');
    
    if (currentPlayer.name == "") {
        nameChecked = false;
    } else {
        nameChecked = true;
    }

    nameChecked ? inputInfos.innerHTML = '' : inputInfos.innerHTML = 'Enter a valid number';

};
  
function startGame(e){

    e.preventDefault();

    if(!nameChecked){
        formInput.classList.add('error');
        setTimeout(() => {
            formInput.classList.remove('error');
        }, 1000);
        return
    } 
    
    document.querySelector('.main_start').classList.add('hiddenOverlay');

    displayTime();
    
};

// CARDS 
allCard.forEach(card => {
    card.addEventListener('click', selectCard);
});

function selectCard(){

    if(lockCard) return;
    
    this.childNodes[1].classList.toggle('return');

    if(!selectedCard){
        firstCard = this;
        this.removeEventListener('click', selectCard);
        selectedCard = true;
        return
    };

    secondCard = this;
    selectedCard = false;

    compareData();
};

function compareData(){

    lockCard = true;

    if(firstCard.getAttribute('data') === secondCard.getAttribute('data')){

        cardNumber += 2;

        firstCard.removeEventListener('click', selectCard);
        secondCard.removeEventListener('click', selectCard);

        lockCard = false;

    } else{
        
        setTimeout(() => {

            firstCard.addEventListener('click', selectCard);
            firstCard.childNodes[1].classList.remove('return');
            secondCard.childNodes[1].classList.remove('return');

            lockCard = false;
            
        }, 500);

    }   
}
  
// TIMER 
function displayTime(){

    const timer = setInterval(() => { // plays this until we close the tab or we call clearInterval()

        if(seconds == 0){
            seconds = 90;
        } 
        seconds--;

        if(seconds <= 8){
            timerRef.style.color = 'crimson';
        };
        
        let m = "0";
        let s = seconds < 10 ? "0" + seconds : seconds;

        timerRef.innerHTML = `${m} : ${s}`;

        GameOver(timer);

    }, 1000);      
};

// GAME OVER  
function GameOver(timer){
    if(seconds <= 0 || cardNumber === allCard.length){

        currentPlayer.time = timerRef.innerHTML;

        storageManagement();

        clearInterval(timer); // clearInterval clears the time back to the original
        alert("Your score is: " + currentPlayer.time + "  " +  currentPlayer.name) // current score
        setTimeout(() => {
            document.querySelector('.main_end').classList.add('showOverlay');
        }, 200);

};
// MANAGEMENT STORAGE  
function storageManagement(){
    let storage = JSON.parse(localStorage.getItem('player'));

    if(!storage){
        storage = [];
        storage.push(currentPlayer);
        localStorage.setItem('player', JSON.stringify(storage));
    } else  {
        
        let playerFind = storage.find(player => player.name === currentPlayer.name);

        if(!playerFind){
            storage.push(currentPlayer);
            localStorage.setItem('player', JSON.stringify(storage));
        } else {
            let currentTime = Number(currentPlayer.time.slice(4,7));
            let registeredTime = Number(playerFind.time.slice(4,7));

            if(registeredTime < currentTime){
                playerFind.time = currentPlayer.time;
                localStorage.setItem('player', JSON.stringify(storage));
            }
        }           
    }}
};

// DISPLAY AND SORT HIGHSCORE  
let storage = JSON.parse(localStorage.getItem('player'));

if(storage){
    storage.sort((playerA, playerB) => {       
        let playerATime = Number(playerA.time.slice(4,7));
        let playerBTime = Number(playerB.time.slice(4,7));
        
        if(playerATime < playerBTime){
            return -1;
        } else if (playerATime > playerBTime){
            return 1;
        } else {
            return 0;
        }
    });
    storage.forEach(player => {
        highscore.innerHTML = ` ${player.name} <i style='color: gold' class="fa-solid fa-trophy"></i> ${player.time}`;
    });
}

// REFRESH  
document.querySelector('#btn_restart').addEventListener('click', () => {
    location.reload();
});

// RANDOM CARD  
function randomCard(){
    allCard.forEach(card => {
        let random = Math.floor(Math.random() * allCard.length);
        card.style.order = random;     
    });
};

randomCard();