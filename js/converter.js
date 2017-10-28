var ourRequest = new XMLHttpRequest();
var quoteContainer = document.getElementById("quote");
var btn = document.getElementById("btn");
var tweetBtn = document.getElementById("tweet-quote");
var timerStatus = document.getElementById("timer");

let nextQuoteCounter = 1;

ourRequest.open('GET', 'https://raw.githubusercontent.com/backinthedai/RQM/master/json/quotes2.json');

//array to hold quote and name as object
var quoteArr = [];

ourRequest.onload = function () {
    let ourData = "";

    ourData = JSON.stringify(String(ourRequest.responseText).replace(/\r?\n|\r/g, "").replace(/\\/g, '').replace(/"/g, '').replace(/\[/g, '')); //get the data and replace the '\n\ 

    for (var i = 0; i < ourData.length; i++) {
        var objElement = {};  
        var indx = ourData.indexOf("]", i);

        if (indx !== -1) {
            var tempStr = ourData.substring(i, indx);
            var periodIdx = tempStr.lastIndexOf(',');
            if (periodIdx !== -1) {
                objElement['quote'] = tempStr.substring(0, periodIdx);
                objElement['name'] = tempStr.substring(periodIdx + 2, tempStr.length);
                quoteArr.push(objElement);
            }
            i = indx;
        }
    }

    //randomize the objs in the array.
    RandomizeArrayObjs(quoteArr);
    console.log(quoteArr);

    //display the first quote after load
    quoteContainer.innerHTML = "\"" + quoteArr[0].quote + "\"" + "<p>" + " - " + quoteArr[0].name + "</p>";
    quoteContainer.style.color = "#333333";

    //Interval through the next quote by a timer
    var delay = 10000;
    var intervalID = window.setInterval(myCallback, delay);

    function myCallback() {
        if(nextQuoteCounter !== quoteArr.length){
            quoteContainer.innerHTML = "\"" + quoteArr[nextQuoteCounter].quote + "\"" + "<p>" + " - " + quoteArr[nextQuoteCounter].name + "</p>";
            quoteContainer.style.color = "#333333";
            nextQuoteCounter++;
            console.log(nextQuoteCounter);
        }  
        else {
            nextQuoteCounter = 0;
        }     
    }

    //Ability to click to the next quote without waiting
    btn.addEventListener("click", function () {
        if(nextQuoteCounter !== quoteArr.length){
            myCallback();
            window.clearInterval(intervalID);
            intervalID = window.setInterval(myCallback, delay);
        }
        else {
            nextQuoteCounter = 0;
        }
    });
};

ourRequest.send();

tweetBtn.addEventListener("click", function () {
    let url = "https://twitter.com/intent/tweet";
    url = url + "?text=" + quoteContainer.textContent;
    window.open(url);
});

function RandomizeArrayObjs(arr) {
    var i = arr.length;
    if (i === 0) {
        return false;
    }
    else while (--i) {
        var j = Math.floor(Math.random() * (i + 1));
        let tempi = arr[i];
        let tempj = arr[j];
        arr[i] = tempj;
        arr[j] = tempi;
    }
}

