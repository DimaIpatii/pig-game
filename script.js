let UIController = (() => {
    //DOM Elements:
    let DOM = new Map();
    //Buttons:
    DOM.set('dices', document.querySelectorAll('.dice'));
    DOM.set('btn_roll', document.querySelector('.btn_roll'));
    DOM.set("btn_hold", document.querySelector('.btn_hold'));
    DOM.set('btn_new', document.querySelector('.btn_new'));
    //Gme range Field:
    DOM.set('gameRange', document.querySelector('#set-score'));
    //Current Scores:
    DOM.set('currScore_0', document.querySelector('#current-0'));
    DOM.set('currScore_1', document.querySelector('#current-1'));
    //Player:
    DOM.set('playerName_0', document.querySelector('#name-0'));
    DOM.set('playerName_1', document.querySelector('#name-1'));
    DOM.set('playerPanel_0', document.querySelector('.player_panel-0'));
    DOM.set('playerPanel_1', document.querySelector('.player_panel-1'));
    DOM.set('globScore_0', document.querySelector('#score-0'));
    DOM.set('globScore_1', document.querySelector('#score-1'));

    class Dice {
        constructor(diceNum,position){
            this.diceNum = diceNum;
            this.dicePosition = position;
        }
    }
    let sideOne = new Dice(1,'translateZ(-100px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)');
    let sideTwo = new Dice(2,'translateZ(-100px) rotateX(180deg) rotateY(90deg) rotateZ(0deg)');
    let sideThree = new Dice(3,'translateZ(-100px) rotateX(180deg) rotateY(360deg) rotateZ(0deg)');
    let sideFour = new Dice(4,'translateZ(-100px) rotateX(89deg) rotateY(360deg) rotateZ(-90deg)');
    let sideFive = new Dice(5,'translateZ(-100px) rotateX(-1deg) rotateY(450deg) rotateZ(-90deg)');
    let sideSix = new Dice(6,'translateZ(-100px) rotateX(-270deg) rotateY(360deg) rotateZ(0deg)');

    let viewport = document.documentElement.clientWidth;
    let activePlayer = 0;
    let score = [0,0];
    var roundScore = 0;
    var rnadomN;
    
    //the sequence of dices in animation:
    const DICE_SIDE = [sideThree,sideTwo,sideOne, sideFour, sideSix,sideFive];  
    
    //Calculate Dice numers to Current Score:
    let calcCurrScore = function (num){
        roundScore += num;
        DOM.get(`currScore_${activePlayer}`).textContent = roundScore; 
    };


    return {
        DOMel(){
            return {
                btn_roll : DOM.get('btn_roll'),
                btn_hold : DOM.get("btn_hold"),
                btn_new : DOM.get('btn_new'),
                game_range : DOM.get('gameRange'),
            }
        },
        initValue(){
            DOM.get('currScore_0').textContent = '0';
            DOM.get('currScore_1').textContent = '0';
            DOM.get('globScore_0').textContent = '0';
            DOM.get('globScore_1').textContent = '0';
            DOM.get('playerPanel_0').classList.remove('active');
            DOM.get('playerPanel_1').classList.remove('active');
            DOM.get('playerPanel_0').classList.remove('winner');
            DOM.get('playerPanel_1').classList.remove('winner');
            DOM.get('playerPanel_0').classList.add('active');
            DOM.get('playerName_0').textContent = 'Player 1';
            DOM.get('playerName_1').textContent = 'Player 2';
            document.querySelector('.players-container').classList.remove('players-container_rotate');
            activePlayer = 0;
            score = [0,0];
            roundScore = 0;
        },
        roll(){
            //Random Numers to be compared with a Side of Dice:
            let n_1 = Math.floor(Math.random() * 6) + 1;
            let n_2 = Math.floor(Math.random() * 6) + 1;
            rnadomN = [n_1, n_2];
            //Node-list of Dice DOM element:
            const DICES = DOM.get('dices');
            
            
            for(let [index,dice] of DICES.entries()){
                //Iteration over every Dice side;
                let i = 0;
                //Add animatio class to the Dice element:
                dice.classList.add('rotate-dice');                                

                //Timeline corisponding to animation duration of Dice:
                let timer = setTimeout(function rollDice () {
                    //prevent multiple clicking:
                    DOM.get('btn_roll').disabled = true;
                    DOM.get("btn_hold").disabled = true;
                        
                    //Stop Dice-Side in position corisponding to the random numer;
                    if(DICE_SIDE[i].diceNum == rnadomN[index]){                     
                        //stop Dice in its coorisponding position:
                        dice.style.transform = DICE_SIDE[i].dicePosition;
                        //remove animation class: 
                        dice.classList.remove('rotate-dice');  
                        //clear timer:
                        clearTimeout(timer);

                        //allow multiple clicking:
                        DOM.get('btn_roll').disabled = false; 
                        DOM.get("btn_hold").disabled = false;
                        //Calculate Current Score function:
                        calcCurrScore(rnadomN[index]);                    
                    }else{
                        timer = setTimeout(rollDice,777);
                    } 
                    i++
                },0); 
            };
        },
        // Calc Current Score with Player's Global Score:
        calcScore(){
            return {
                num : score[activePlayer] += roundScore
            }
        },
        updateCurrScore(score){
            //CURRENT SCORE:
            DOM.get(`currScore_${activePlayer}`).textContent = score; 
        },
        updateGlobScore(score){
            //Resset Curr Score:
            DOM.get(`currScore_${activePlayer}`).textContent = 0; 
            
            //Add to the clobal score:
            DOM.get(`globScore_${activePlayer}`).textContent = score;
        },
        playerState(gamePlaying){
                let player = ['Player 1', 'Player 2']
                DOM.get(`playerName_${activePlayer}`).textContent = `${player[activePlayer]} Winner!`;
                DOM.get(`playerPanel_${activePlayer}`).classList.add('winner');
                DOM.get(`playerPanel_${activePlayer}`).classList.remove('active');
                
                if(viewport >= 640){ 
                    DOM.get(`playerName_${activePlayer}`).textContent = `Winner!`;
                }
                return gamePlaying = false;
        },
        nextPlayer() {

            activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
            roundScore = 0;

            DOM.get(`playerPanel_0`).classList.toggle('active');
            activePlayer === 1 
            ? DOM.get(`playerPanel_1`).classList.add('active')
            : DOM.get(`playerPanel_1`).classList.toggle('active')
 
            document.querySelector('.players-container').classList.toggle('players-container_rotate');

            if(viewport >= 640){    
                document.querySelector('.players-container').classList.remove('players-container_rotate');
            }
        },
        looseDice(nextPlayer){
            if(rnadomN[0] === 6 && rnadomN[1] === 6 || rnadomN[0] === 1 && rnadomN[1] === 1){
                DOM.get(`globScore_${activePlayer}`).textContent = '0';
                DOM.get(`currScore_${activePlayer}`).textContent = '0';
                score[activePlayer] = 0;
                roundScore = 0;
                console.log('Hello World');

                nextPlayer();       
            } 
        },
        //Message generator:
        hintMessage(val,message){
            //Hint Message:
            let hintMessage = document.getElementById('message');
            
            if(val === 'add'){
                hintMessage.textContent = message;
                hintMessage.classList.add('show-message');
            }else if(val === 'remove'){
                hintMessage.textContent = '';
                hintMessage.classList.remove('show-message');
            }
        }
    }
})();

//Initial Settings:
let controller = ((UICntr) => {
    let DOMelem = UICntr.DOMel();
    //State variables:
    /**********************************************/
    //Game Status:
    let gamePlaying = true;

    //Set the game range:
    let gameRange = DOMelem.game_range;
    /**********************************************/

    // EVENTS:
    let eventListenrts = function (){
        const ROLL_BTN = DOMelem.btn_roll;
        const HOLD_BTN = DOMelem.btn_hold;

        ROLL_BTN.disabled = false;

        //Game Range Field:
        gameRange.addEventListener('input', (event) =>{
            gameRange.value = event.target.value;
        });

        //Roll Button
        ROLL_BTN.addEventListener('click', () =>{ 
            
            if(gamePlaying && gameRange.value > 0){
                //Roll Dices and Add Number to the Current Score:  
                UICntr.roll();
                UICntr.looseDice(UICntr.nextPlayer);
                UICntr.hintMessage('remove','');
            }else{
                showMessage();
            }
        });

        //Hold Button
        HOLD_BTN.addEventListener('click', () =>{

            let globSCore = UICntr.calcScore();
            
            if(gamePlaying && gameRange.value > 0){
                //Add score to Player Global Score:
                
                UICntr.updateGlobScore(globSCore.num);
                UICntr.hintMessage('remove','');

                if(globSCore.num >= gameRange.value){
                    //Winner
                    UICntr.playerState();
                    gamePlaying = UICntr.playerState();
                }else{
                    UICntr.nextPlayer();
                } 
            }else{   
                showMessage();
            }

        });
        
        // New Game Button:
        document.querySelector('.btn_new').addEventListener('click', () => {
            UICntr.hintMessage('remove','');
            UICntr.initValue();
            gamePlaying = true;
        });

        //Hide Cover:
        document.querySelector('.btn_start-game').addEventListener('click', function (event){
            event.target.parentNode.parentNode.parentNode.classList.add('cover_hide');
                
        });

        // Show rules:
        document.querySelector('.btn_rule').addEventListener('click', function (event){
            event.target.parentNode.parentNode.classList.toggle('cover__header-position');
            document.querySelector('.rules').classList.toggle('rules_show');
        });
    }
    
    //Difine Message
    let showMessage = () => {
        (gamePlaying === false)
        ? UICntr.hintMessage('add','Please, press "NEW GAME" to play again!')
        : UICntr.hintMessage('add','Please Set the "Game Range" before you start the game!');
    }
    
    
    return {
        init : function () {
            UICntr.initValue();
            eventListenrts();
            //updateScore();
        }
    }
})(UIController);
controller.init();


