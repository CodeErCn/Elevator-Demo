'use strict';

var currentFloor = 1;               // Set current floor to 1
var clicks = 0;
var floorId = ['#frOne', '#frTwo', '#frThree', '#frFour'];
var button = ['#one', '#two', '#three', '#four'];
var message = ['Going UP', 'Going Down', 'You have arrived at floor', 'You are at floor '];
var queue = [];

// FUNCTION goingUp and goingDown =============================================
function goingUp (goTo, complete) {  // Function for going up
    var i = goTo.frFlr -1;
    function loop() {
        setTimeout(function(){
            $(floorId[i]).hide();
            $(floorId[i+1]).slideToggle();
            
            i++;
            if(i<(goTo.goFlr -1)) {
                loop();
            } else {
                $('#mesg').html(message[2]+ " " +goTo.goFlr);
                setTimeout(function() {
                    complete(); 
                }, 800);
            }
        }, 1000);
    }

    loop();
}

function goingDown (goTo, complete) {  // Function for going down
    var i = goTo.frFlr-1;
    function loop() {
        setTimeout(function(){
            $(floorId[i]).hide();
            $(floorId[i-1]).slideToggle();
            
            i--;
            if(i>(goTo.goFlr-1)) {
                loop();
            } else {
                $('#mesg').html(message[2]+ " " +goTo.goFlr);
                setTimeout(function() {
                    complete();   
                }, 800);
            }
        }, 1000);
    }

    loop();
}

// FUNCTION runQueue ==========================================================
var run = (function() {
    var idx = 0;
    
    return function() {
        function runQueue(queueItem) {
            clicks--;
            
            if (queueItem.goFlr > queueItem.frFlr){
                $('div.green').css('background-color', '#7FFF00');
                $('#mesg').html(message[0]);
                goingUp(queueItem, function() {
                    $('div.green').css('background-color', '#006400');
                    $(button[queueItem.goFlr-1]).removeClass('pressed');
                    $('#mesg').html('');

                });     
            }else if(queueItem.goFlr < queueItem.frFlr) {
                $('div.red').css('background-color', '#FF0000');
                $('#mesg').html(message[1]);
                goingDown(queueItem, function() {
                    $('div.red').css('background-color', '#8B0000');
                    $(button[queueItem.goFlr-1]).removeClass('pressed');
                    $('#mesg').html('');
                });        
            }else {
                setTimeout(function(){ 
                    $(button[queueItem.goFlr-1]).removeClass('pressed');
                    $('#mesg').html(message[3]+ " " +queueItem.goFlr);
                }, 1000);
            }

            setTimeout(function() {    
                idx++;
                if(idx<queue.length) {
                    runQueue(queue[idx]);
                }else {
                    queue=[];
                    idx = 0;
                }
            }, 3000);
        }

        runQueue(queue[idx]);
    }   
})();

/* SET CURRENT FLOOR MESSAGE *******************************************/
$('#mesg').html(message[3]+ " " +currentFloor);

/* EACH BUTTON CLICKED *************************************************/
$('p.round').click(function() {
    var pressed = parseInt($(this).attr('button'));
    $(this).addClass('pressed');
    
    var frQu = {};
    frQu.goFlr = pressed;
    frQu.frFlr = currentFloor;
    queue.push(frQu);
    
    currentFloor = pressed;
    
    clicks++;
    if(clicks === queue.length) {
        run();
    }
})



