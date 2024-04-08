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
(async () => {
    const response = await fetch('https://discord.com/api/v9/invites/qZG6NHPvYJ?with_counts=true&with_expiration=true');
    const data = await response.json();
    onlineUsers = (data.approximate_presence_count - noBots);
    totalUsers = (data.approximate_member_count - noBots);

    //return data.presence_count;
}) ();

const directories = [
    'archived-logs',
    'archived-docs',
    'dossiers',
    'factions',
];

var files = [];

(async () => {
    const response = await fetch('https://api.github.com/repos/Project-Untold/Project-Untold.github.io/contents');
    const data = await response.json();
    for (let i = 0; i < data.length; i++) {
        if (directories.includes(data[i].name)) {
            let response1 = await fetch('https://api.github.com/repos/Project-Untold/Project-Untold.github.io/contents/' + data[i].name);
            let data1 = await response1.json();
            for (let j = 0; j < data1.length; j++) {
                if (data1[j].type == "file") {
                    files.push(getFileName(data1[j].name))
                }
            }
        }
    }
   // console.log(directories);
   // console.log(files);
}) ();

const terminal_cursor = '<span class="terminal_cursor">█</span>';
const consoleText = `\n<span id="a">drift@parawatchnet</span>:<span id="b">~</span><span id="c">$</span> ${terminal_cursor}`;

var accumulatedText = "";
var accumulatedLength = 0;

var storingScript = false;

var savedText;

// 0 = not found, 1 = directory, 2 = file
function getTextCategory(name) {
    if (directories.includes(name)) {
        return 1;
    } else if (files.includes(name)) {
        return 2;
    }
    return 0;
}

function getFileName(filename) {
    let filenameextension = filename.replace(/^.*[\\\/]/, '');
    return filenameextension.substring(0, filenameextension.lastIndexOf('.'));
}

function closestDirectory(filePath) {
    // Split the file path into an array of directories and the file name
    let pathSegments = filePath.split(/[\\/]/);

    // Check if there are at least two segments in the path
    if (pathSegments.length < 2) {
        return null; // There is no directory to return
    }

    // Return the second-to-last element, which is the closest directory
    return pathSegments[pathSegments.length - 2];
}


function directoryWrapper(text, dir) {
    return `cd ~
    <span id="a">drift@parawatchnet</span>:<span id="b">~</span><span id="c">$</span> cd ./` + dir + `\n` +
    text +
    `

    <span class="speedDown"></span><span class="speedNormal"></span>`
}

function fileWrapper(text, dir) {
    console.log("dir", dir)
    return text + `


    <button type="button" onclick = "createText('`+dir+`', 10)">../</button>`
}

var Typer = {
    text: '',
    animation: null,
    index: 0,
    speed: 2,
    file: '',
    accessCount: 0,
    deniedCount: 0,
    lastAnimationFrameTime: 0, // variable to store the timestamp of the last animation frame
    allowedToSkip: false,
    init: function () {
        /* function animate(timeStamp) {
            // Check if one second has passed since the last animation frame
            if (timeStamp - Typer.lastAnimationFrameTime >= 1000) {
                Typer.updLstChr();
                Typer.lastAnimationFrameTime = timeStamp; // Update the last animation frame timestamp
            }

            return requestAnimationFrame(animate);
        }
        Typer.lastAnimationFrameTime = performance.now(); // Initialize the last animation frame timestamp
        animation = requestAnimationFrame(animate); */

        $.get(Typer.file, function (data) {
            //console.log(Typer.file, getFileName(Typer.file));
            Typer.category = getTextCategory(getFileName(Typer.file));
            console.log("category", Typer.category);
            //console.log(Typer.category);
            if (Typer.category == 1) {
                data = directoryWrapper(data, getFileName(Typer.file));
            }else if (Typer.category == 2) {
                data = fileWrapper(data, closestDirectory(Typer.file));
            }
            data += consoleText;
            // remove terminal_cursor from accumulatedText
            if (accumulatedText.slice(accumulatedText.length - terminal_cursor.length, accumulatedText.length) == terminal_cursor) {
                //console.log("removing terminal cursor");
                //console.log(accumulatedText.slice(accumulatedText.length - terminal_cursor.length, accumulatedText.length));
                accumulatedText = accumulatedText.slice(0, accumulatedText.length - terminal_cursor.length);
            }
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
        } else if (key.key == 'Escape' && Typer.allowedToSkip) {
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
        console.log("updating");
        /* var cont = this.content();
        if (cont.substring(cont.length - 1, cont.length) == '|')
            $('#console').html(
                $('#console')
                    .html()
                    .substring(0, cont.length - 1),
            );
        else this.write('|'); // else write it */
    },

    onComplete: function (callback) {
        callback();
    }

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
    if (e.key == "Escape" && Typer.allowedToSkip) {
        // fastforward text
        Typer.index = Typer.text.length;
    }
}

function siteInit() {
    Typer.speed = 3;
    Typer.file = 'intro.txt';
    Typer.init();
    setTimeout(() => {
        if (onlineUsers == null) {
            console.log(onlineUsers)
            console.log("onlineUsers is null");
            Typer.file = 'error_warning.txt';
            Typer.init();
        }
        setTimeout(() => {
            Typer.file = 'untold.txt';
            Typer.init();
            Typer.allowedToSkip = true;
        }, onlineUsers == null ? 100 : 0);
    }, 2000);
}

siteInit();