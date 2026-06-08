let chars = '';
let h1 = document.querySelectorAll('h1');
let p = document.querySelectorAll('p');
let span = document.querySelectorAll('span');

let rainbowMode = false;

window.addEventListener('keydown', event => {
    event.preventDefault()

    chars += event.key;

    if (!'secret'.includes(chars)) {
        chars = '';
    }

    if (chars === 'secret') {
        chars = '';
        rainbowMode = !rainbowMode;

        if (rainbowMode) {
            h1.forEach(h => h.classList.add('rainbow'));
            p.forEach(p => p.classList.add('rainbow'));
            span.forEach(p => p.classList.add('rainbow'));
        }

        alert('gamer mode activated');
    }



});