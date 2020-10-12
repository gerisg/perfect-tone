// Agrego un step al path
function addStepToPath(step) {
    let path = localStorage.getItem('path');
    path = path ? JSON.parse(path) : [];
    path.push(step);
    localStorage.setItem('path', JSON.stringify(path));
}

// Elimino un step del path
function removeStepFromPath() {
    var path = JSON.parse(localStorage.getItem('path'));
    let current = path.pop();
    localStorage.setItem('path', JSON.stringify(path));
    return current;
}

function getLastStepFromPath() {
    var path = JSON.parse(localStorage.getItem('path'));
    return path[path.length - 1];
}

// Mostrar un slide del wizard
function showSlide(n) {
    console.log('show slide ' + n);
    let slides = document.getElementsByClassName('question-wrapper');
    let current = n > slides.length || n < 1 ? 1 : n;
    for (let i = 0; i < slides.length; i++)
        slides[i].style.display = 'none';
    slides[current-1].style.display = 'block';
}

function init() {
    // Logo Home
    document.getElementsByTagName('header')[0].classList.add('main');
    
    // Slide inicial
    showSlide(1);

    // Limpieza de storage y form
    localStorage.clear();
    addStepToPath(1);
    document.getElementById("prefectTone").reset();
}

init();

// Enviar datos por POST
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data)
    });
    return response.json();
}

// Reflejo
let reflexAnswer = document.getElementById("reflex");

// Teñido
let dyedAnswer = document.getElementById("dyedAnswer");
let dyedOptions = dyedAnswer.parentNode.querySelectorAll('input[type="radio"]');
Array.prototype.find.call(dyedOptions, dyedOption => {
    dyedOption.addEventListener('click', function(e){
        Array.prototype.forEach.call(dyedOptions, dyedOption => dyedOption.parentNode.parentNode.classList.remove('selected'));
        this.parentNode.parentNode.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        dyedAnswer.value = this.value;
    });
});

// Color de pelo teñido
let currentToneAnswer = document.getElementById("currentTone");
let currentToneBtns = document.getElementsByClassName("current-tone-btn");
Array.prototype.forEach.call(currentToneBtns, currentToneBtn => {
    currentToneBtn.addEventListener('click', function(e){
        e.preventDefault();
        Array.prototype.forEach.call(currentToneBtns, ct => ct.classList.remove('selected'));
        this.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        currentToneAnswer.value = this.value;
    });
});

// Color de pelo natural
let naturalToneAnswer = document.getElementById("naturalTone");
let naturalToneBtns = document.getElementsByClassName("natural-tone-btn");
Array.prototype.forEach.call(naturalToneBtns, naturalToneBtn => {
    naturalToneBtn.addEventListener('click', function(e){
        e.preventDefault();
        Array.prototype.forEach.call(naturalToneBtns, nt => nt.classList.remove('selected'));
        this.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        naturalToneAnswer.value = this.value;
    });
});

// Tono deseado
let desiredToneAnswer = document.getElementById("desiredTone");
let desiredToneBtns = document.getElementsByClassName("desired-tone-btn");
Array.prototype.forEach.call(desiredToneBtns, desiredToneBtn => {
    desiredToneBtn.addEventListener('click', function(e){
        e.preventDefault();
        Array.prototype.forEach.call(desiredToneBtns, dt => dt.classList.remove('selected'));
        this.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        desiredToneAnswer.value = this.value;
    });
});

// Canas
let greyHairAnswer = document.getElementById("greyHair");
let greyHairBtns = document.getElementsByClassName("grey-hair-btn");
Array.prototype.forEach.call(greyHairBtns, greyHairBtn => {
    greyHairBtn.addEventListener('click', function(e){
        e.preventDefault();
        Array.prototype.forEach.call(greyHairBtns, gh => gh.classList.remove('selected'));
        this.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        greyHairAnswer.value = this.value;
    });
});

let backBtns = document.querySelectorAll('button[type="back"]');
backBtns.forEach(back => back.addEventListener('click', function(event){
    // No enviar el form
    event.preventDefault();
    // Qué slide mostrar?
    let backStep = removeStepFromPath();
    console.log('removed', backStep);
    showSlide(getLastStepFromPath());
}));

let forwardBtns = document.querySelectorAll('button[type="forward"]');
forwardBtns.forEach(forward => forward.addEventListener('click', function(event){
    // No enviar el form
    event.preventDefault();
    // Mostrar logo normal
    document.getElementsByTagName('header')[0].classList.remove('main');
    // Qué slide mostrar?
    let current = getLastStepFromPath();
    switch (current) {
        case 3: // Teñido preguntar tono actual (slide 4), sino preguntar tono en raíces (slide 6)
            if(dyedAnswer.value) {
                let next = 6;
                if(dyedAnswer.value == 'yes') {
                    next = 4;
                    // Si tiene teñido no puede aclarar
                    let lightDesiredTone = document.getElementsByClassName('desired-tone-btn')[0];
                    lightDesiredTone.disabled = true;
                    lightDesiredTone.parentElement.style.opacity = .5;
                }
                addStepToPath(next);
                showSlide(next);
            }
            break;
        case 9: // Reflejos requiere data del BE
            postData('https://quiz.cobeauty.store/api/reflexes', { current: currentToneAnswer.value, natural: naturalToneAnswer.value, desired: desiredToneAnswer.value, greys: greyHairAnswer.value })
                .then(data => { 
                    let reflexTemplate = document.getElementById('reflex-tpl');
                    let reflexes = data.reflexes;
                    console.log('Tono sugerido: ' + data.tones[0]);
                    // Armar HTML de reflejos clonando un DIV que uso como template
                    for (let i = 0; i < reflexes.length; i++) {
                        const reflex = reflexes[i];
                        reflex.products.forEach(reflexProd => {
                            let reflexNode = reflexTemplate.cloneNode(true);
                            reflexNode.setAttribute('id', 'reflex-' + i);
                            reflexNode.childNodes[1].childNodes[1].value = reflexProd.id;
                            reflexNode.childNodes[1].childNodes[3].childNodes[1].src = `/images/reflex/${reflexProd.img}`;
                            reflexNode.childNodes[1].childNodes[3].childNodes[3].childNodes[3].innerHTML = `${reflex.text} (${reflexProd.id})`;
                            // En cada click muesto un check y guardo la respuesta
                            reflexNode.childNodes[1].childNodes[1].addEventListener('click', function(e){
                                e.preventDefault();
                                let reflexesBtns = document.getElementsByClassName("reflex-btn");
                                Array.prototype.forEach.call(reflexesBtns, rb => rb.classList.remove('selected'));
                                this.classList.add("selected");
                                // Guardo la respuesta que se envia en el Form
                                reflexAnswer.value = this.value;
                            });
                            reflexTemplate.parentNode.insertBefore(reflexNode, null);
                        });
                    }
                })
                .catch(error => { console.log(error); });
            current++;
            addStepToPath(current);
            showSlide(current);
            break;
        case 10:
            document.getElementById("prefectTone").submit();
            localStorage.clear();
            break;
        default:
            current++;
            addStepToPath(current);
            showSlide(current);
            break;
    }
}));