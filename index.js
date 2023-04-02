// fetch data from https://discord.com/api/guilds/787688375838703626/widget.json without discord.js

/* var obj;

window.addEventListener('load', () => {
    fetch('https://discord.com/api/guilds/787688375838703626/widget.json')
        .then(res => res.json())
        .then(data => {
            obj = data;
        })
        .then(() => {
            console.log(obj);
        });
}); */

// async function that returns a number from a fetch request.
// source = https://github.com/CodeNerve/CodeNerve.github.io/blob/master/index.js


//--DISCORD ONLINE USERS COUNT--//
const noBots = 2;
//https://discord.com/api/v9/invites/7cNxWQpVsM?with_counts=true&with_expiration=true
// https://discord.com/api/guilds/787688375838703626/widget.json
var onlineUsers;
var totalUsers;
async function getOnline() {
    const response = await fetch('https://discord.com/api/v9/invites/2W8E222x4J?with_counts=true&with_expiration=true');
    const data = await response.json();
    onlineUsers = (data.approximate_presence_count - noBots);
    totalUsers = (data.approximate_member_count - noBots);
    //return data.presence_count;
}

getOnline();

var accumulatedText = "";
var accumulatedLength = 0;

var storingScript = false;

var savedText;

var Typer = {
    text: '',
    accessCountimer: null,
    index: 0,
    speed: 2,
    file: '',
    accessCount: 0,
    deniedCount: 0,
    init: function () {
        accessCountimer = setInterval(function () {
            Typer.updLstChr();
        }, 1000);
        $.get(Typer.file, function (data) {
            accumulatedText = accumulatedText.concat(data);
            accumulatedLength += data.length;
            Typer.text = accumulatedText;
            Typer.text = Typer.text.slice(0, accumulatedLength - 1);
        });
    },

    content: function () {
        return $('#console').html();
    },

    write: function (str) {
        $('#console').append(str);
        return false;
    },

    addText: function (key) {
        if (key.key == 'Alt') {
            Typer.accessCount++;

            if (Typer.accessCount >= 3) {
                Typer.makeAccess();
            }
        } else if (key.key == 'CapsLock') {
            Typer.deniedCount++;

            if (Typer.deniedCount >= 3) {
                Typer.makeDenied();
            }
        } else if (key.key == 'Escape') {
            Typer.hidepop();
        } else if (Typer.text) {
            var cont = Typer.content();
            if (cont.substring(cont.length - 7, cont.length) == '<script') {
                storingScript = true;
                savedText = Typer.content();
            } else if (cont.substring(cont.length - 9, cont.length) == '</script>') {
                storingScript = false;
            }
            if (cont.substring(cont.length - 1, cont.length) == '|')
                $('#console').html(
                    $('#console')
                        .html()
                        .substring(0, cont.length - 1),
                );
            if (key.key != 'Backspace') {
                Typer.index += Typer.speed;
            } else {
                if (Typer.index > 0) Typer.index -= Typer.speed;
            }

            var text;
            if (storingScript) {
                text = savedText;
            } else {
                text = Typer.text.substring(0, Typer.index);
            }

            //var text = Typer.text.substring(0, Typer.index);
            var rtn = new RegExp('\n', 'g');

            $('#console').html(text.replace(rtn, '<br/>'));
            window.scrollBy(0, 50)
        }

        if (key.preventDefault && key.key != 'F11') {
            key.preventDefault();
        }

        if (key.key != 'F11') {
            // otherway prevent keys default behavior
            key.returnValue = false;
        }
    },

    updLstChr: function () {
        var cont = this.content();
        if (cont.substring(cont.length - 1, cont.length) == '|')
            $('#console').html(
                $('#console')
                    .html()
                    .substring(0, cont.length - 1),
            );
        else this.write('|'); // else write it
    },
};

function replaceUrls(text) {
    var http = text.indexOf('http://');
    var space = text.indexOf('.me ', http);

    if (space != -1) {
        var url = text.slice(http, space - 1);
        return text.replace(url, '<a href="' + url + '">' + url + '</a>');
    } else {
        return text;
    }
}

Typer.speed = 3;
Typer.file = 'untold.txt';
Typer.init();

var timer = setInterval('t();', 30);

function createText(name, speed) {
    Typer.file = name + '.txt';
    if (!speed) {
        speed = 3;
    }
    Typer.speed = speed;
    Typer.init();
    setTimeout(() => {
        timer = setInterval('t();', 30);
      }, 500);
}

function setSpeed(speed) {
    Typer.speed = speed;
}

function elementExists(element) {
    for (var i = 0; i < triggeredElements.length; i++) {
        if (triggeredElements[i] == element) {
            return true;
        }
    }
    return false;
}

function t() {
    Typer.addText({keyCode: 123748});
    var kThing = document.getElementById('k');
    var k1Thing = document.getElementById('k1');

    if (kThing) {
        kThing.innerHTML = onlineUsers;
    }

    if (k1Thing) {
        k1Thing.innerHTML = totalUsers;
    }

    if (Typer.index > (Typer.text.length)) {
        clearInterval(timer);
        timer = null;
    }

    if (timer != null) {
        var speedClasses = document.querySelectorAll('.speedUp, .speedDown, .speedNormal');
        var last = [].slice.call(speedClasses).pop();
        if (last) {
            if (last.className == 'speedUp') {
                setSpeed(30)
            } else if (last.className == 'speedDown') {
                setSpeed(3)
            }
        }
    }
}

document.onkeydown = function (e) {
    if (e.key == "Escape") {
        // fastforward text
        Typer.index = Typer.text.length;
    }
}



