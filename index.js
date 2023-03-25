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
        if (key.key == 'alt') {
            Typer.accessCount++;

            if (Typer.accessCount >= 3) {
                Typer.makeAccess();
            }
        } else if (key.key == 'caps lock') {
            Typer.deniedCount++;

            if (Typer.deniedCount >= 3) {
                Typer.makeDenied();
            }
        } else if (key.key == 'escape') {
            Typer.hidepop();
        } else if (Typer.text) {
            var cont = Typer.content();
            if (cont.substring(cont.length - 1, cont.length) == '|')
                $('#console').html(
                    $('#console')
                        .html()
                        .substring(0, cont.length - 1),
                );
            if (key.key != 'backspace') {
                Typer.index += Typer.speed;
            } else {
                if (Typer.index > 0) Typer.index -= Typer.speed;
            }
            var text = Typer.text.substring(0, Typer.index);
            var rtn = new RegExp('\n', 'g');

            $('#console').html(text.replace(rtn, '<br/>'));
            window.scrollBy(0, 50);
        }

        if (key.preventDefault && key.key != 'f11') {
            key.preventDefault();
        }

        if (key.key != 'f11') {
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

    if (Typer.index > Typer.text.length) {
        clearInterval(timer);
    }

}

document.onkeydown = function (e) {
    if (e.key == "escape") {
        // fastforward text
        Typer.index = Typer.text.length;
    }
}



