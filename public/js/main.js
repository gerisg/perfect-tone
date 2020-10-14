// Agrego un step al path
function addStepToPath(step) {
    let path = localStorage.getItem('path');
    path = path ? JSON.parse(path) : [];
    path.push(step);
    localStorage.setItem('path', JSON.stringify(path));
}

// Elimino un step del path
function removeStepFromPath() {
    let current = 1;
    var path = JSON.parse(localStorage.getItem('path'));
    if(path.length > 1) {
        current = path.pop();
        localStorage.setItem('path', JSON.stringify(path));
    }
    return Number(current);
}

function getLastStepFromPath() {
    var path = JSON.parse(localStorage.getItem('path'));
    return Number(path[path.length - 1]);
}

// Mostrar un slide del wizard
function showSlide(n) {
    console.log('show slide ' + n);
    let slides = document.getElementsByClassName('question-wrapper');
    let current = n > slides.length || n < 1 ? 1 : n;
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        slides[i].style.visibility = 'hidden';
        slides[i].style.opacity = 0;
    }
    slides[current-1].style.display = 'block';
    setTimeout(function(){
        slides[current-1].style.visibility = 'visible';
        slides[current-1].style.opacity = 1;
    }, 100);
}

function init(step) {
    // Slide inicial
    showSlide(step);

    // Hide back control
    document.getElementById('back-controls').style.opacity = 0;

    // Limpieza form
    document.getElementById('prefectTone').reset();

    // Limpieza storage
    localStorage.clear();
    addStepToPath(step);
}

init(1);

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
let currentToneBtns = document.getElementsByClassName("current");
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
let naturalToneBtns = document.getElementsByClassName("natural");
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
let desiredToneBtns = document.getElementsByClassName("desired");
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
let greyHairBtns = document.getElementsByClassName("grey-hair");
Array.prototype.forEach.call(greyHairBtns, greyHairBtn => {
    greyHairBtn.addEventListener('click', function(e){
        e.preventDefault();
        Array.prototype.forEach.call(greyHairBtns, gh => gh.classList.remove('selected'));
        this.classList.add("selected");
        // Guardo la respuesta que se envia en el Form
        greyHairAnswer.value = this.value;
    });
});

// Retroceder
let backBtns = document.querySelectorAll('button[type="back"]');
backBtns.forEach(back => back.addEventListener('click', function(event){
    // No enviar el form
    event.preventDefault();
    // Retroceder en el path
    removeStepFromPath();
    // Qué slide mostrar?
    let current = Number(getLastStepFromPath());
    if(current == 1) {
        document.getElementById('back-controls').style.opacity = 0;
    }
    showSlide(current);
}));

// Avanzar
let forwardBtns = document.querySelectorAll('button[type="forward"]');
forwardBtns.forEach(forward => forward.addEventListener('click', function(event){
    // No enviar el form
    event.preventDefault();
    // Qué slide mostrar?
    let current = getLastStepFromPath();
    if(current == 1) {
        // Hide back control
        document.getElementById('back-controls').style.opacity = 1;
    }
    switch (current) {
        case 3: // Teñido preguntar tono actual (slide 4), sino preguntar tono en raíces (slide 6)
            if(dyedAnswer.value) {
                let next = 6;
                if(dyedAnswer.value == 'yes') {
                    next = 4;
                    // Si tiene teñido no puede aclarar
                    let lightDesiredTone = desiredToneBtns[0];
                    lightDesiredTone.disabled = true;
                    lightDesiredTone.parentElement.style.opacity = .5;
                }
                addStepToPath(next);
                showSlide(next);
            }
            break;
        case 9: // Reflejos requiere data del BE
            postData(window.location.href + 'api/reflexes', { current: currentToneAnswer.value, natural: naturalToneAnswer.value, desired: desiredToneAnswer.value, greys: greyHairAnswer.value })
                .then(data => { 
                    // TODO Check zero results
                    let reflexes = data.reflexes;
                    
                    // Limpiar reflejos existentes
                    let rootReflex = document.getElementById('reflex-root');
                    while (rootReflex.firstChild) {
                        rootReflex.removeChild(rootReflex.firstChild);
                    }

                    // Armar HTML de reflejos clonando un DIV que uso como template
                    let reflexTemplate = document.getElementById('reflex-tpl');
                    for (let i = 0; i < reflexes.length; i++) {
                        const reflex = reflexes[i];
                        reflex.products.forEach(reflexProd => {
                            let reflexNode = reflexTemplate.cloneNode(true);
                            reflexNode.setAttribute('id', 'reflex-' + i);
                            reflexNode.childNodes[1].childNodes[1].value = reflexProd.id;
                            reflexNode.childNodes[1].childNodes[3].childNodes[1].src = `/images/reflex/${reflexProd.img}`;
                            reflexNode.childNodes[1].childNodes[3].childNodes[3].childNodes[1].innerHTML = `${reflex.text}`;
                            // En cada click muesto un check y guardo la respuesta
                            reflexNode.childNodes[1].childNodes[1].addEventListener('click', function(e){
                                e.preventDefault();
                                let reflexesBtns = document.getElementsByClassName('reflex-btn');
                                Array.prototype.forEach.call(reflexesBtns, rb => rb.classList.remove('selected'));
                                this.classList.add('selected');
                                // Guardo la respuesta que se envia en el Form
                                reflexAnswer.dataset.wc = 'https://cobeauty.store/product/' + reflexProd.wc;
                                reflexAnswer.value = this.value;
                            });
                            reflexTemplate.nextElementSibling.insertBefore(reflexNode, null);
                        });
                    }
                })
                .catch(error => { console.log(error); });
            current++;
            addStepToPath(current);
            showSlide(current);
            break;
        case 10:
            // Eliminar controles
            let controls = document.getElementsByClassName('controls')[0];
            controls.parentElement.removeChild(controls);    
            // Mostrar nombre usuario
            let name = document.getElementById('prefectTone').name.value;
            let lastStep = document.getElementById('slide-11');
            lastStep.childNodes[1].innerText = name;
            // Mostrar el botón luego de tres segundos
            setTimeout(function(){
                var a = document.createElement('a');
                var link = document.createTextNode('Conocé tu resultado');
                a.appendChild(link);
                a.href = reflexAnswer.dataset.wc;
                a.classList.add('btn-woocom', 'border-shadow');
                lastStep.appendChild(a);
            }, 3000);
            // Continue to next step
        default:
            current++;
            addStepToPath(current);
            showSlide(current);
            break;
    }
}));