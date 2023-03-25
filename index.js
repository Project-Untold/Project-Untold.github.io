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

const noBots = 2;

var onlineUsers;
async function getOnline() {
    const response = await fetch('https://discord.com/api/guilds/787688375838703626/widget.json');
    const data = await response.json();
    console.log(data);
    onlineUsers = (data.presence_count - noBots);
    //return data.presence_count;
}

getOnline();

// any element with id 'k' gets their innerHTML set to the number returned from getOnline()

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
        }, 500);
        $.get(Typer.file, function (data) {
            Typer.text = data;
            Typer.text = Typer.text.slice(0, Typer.text.length - 1);
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
            var text = Typer.text.substring(0, Typer.index);
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
function t() {
    Typer.addText({keyCode: 123748});
    var kThing = document.getElementById('k');

    if (kThing) {
        kThing.innerHTML = onlineUsers;
    }

    if (Typer.index > Typer.text.length) {
        clearInterval(timer);
    }

}

document.onkeydown = function (e) {
    if (e.key == "Escape") {
        // fastforward text
        Typer.index = Typer.text.length;
    }
}



