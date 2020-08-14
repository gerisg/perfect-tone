(function() {

// Answer q1 enable q2 (conditional) or q3 
var q1 = document.forms['tone'].elements['q1'];
for (var i=0, len=q1.length; i<len; i++) {
    q1[i].addEventListener('change', function() {
        if (this.value === '10.A') {
            document.getElementById('question-3').classList.add('hidden');
            document.getElementById('question-2').classList.remove('hidden');
        } else if(this.value === '10.B') {
            document.getElementById('question-2').classList.add('hidden');
            document.getElementById('question-3').classList.remove('hidden');
        }
    });
}

// Answer q2 enable q3 
var q2 = document.forms['tone'].elements['q2'];
for (var i=0, len=q2.length; i<len; i++) {
    q2[i].addEventListener('change', function() {
        document.getElementById('question-3').classList.remove('hidden');
    });
}

// Answer q3 enable q4 
var q3 = document.forms['tone'].elements['q3'];
for (var i=0, len=q3.length; i<len; i++) {
    q3[i].addEventListener('change', function() {
        document.getElementById('question-4').classList.remove('hidden');
        // Colored hair cann't be clarified
        if (q1.value === '10.A') {
            document.querySelector('#question-4 .options .option input').disabled = true;
        }
    });
}

// Answer q4 enable q5
var q4 = document.forms['tone'].elements['q4'];
for (var i=0, len=q4.length; i<len; i++) {
    q4[i].addEventListener('change', function() {
        document.getElementById('question-5').classList.remove('hidden');
    });
}

// Answer q5 calculate available options and enable q6
var q5 = document.forms['tone'].elements['q5'];
for (var i=0, len=q5.length; i<len; i++) {
    q5[i].addEventListener('change', function() {
    // Create a request variable and assign a new XMLHttpRequest object to it.
    var request = new XMLHttpRequest()

    // Open a new connection, using the GET request on the URL endpoint
    if (q2.value) {
        request.open('GET', `https://quiz.cobeauty.store/options/${q1.value}/${q2.value}/${q3.value}/${q4.value}/${this.value}`, true)
    } else {
        request.open('GET', `https://quiz.cobeauty.store/options/${q1.value}/${q3.value}/${q4.value}/${this.value}`, true)
    }
    
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Begin accessing JSON data here
            var data = JSON.parse(this.response);
            // Find options for Q6
            var q6Options = null;
            var q6Children = document.getElementById('question-6').childNodes;
            for (var i = 0; i < q6Children.length; i++) {
                if (q6Children[i].className == 'options') {
                    q6Options = q6Children[i];
                    break;
                }        
            }

            // Clean
            q6Options.innerHTML = "";
            var inputs = document.forms['tone'].getElementsByTagName('input');
            for(var i = 0; i < inputs.length; i++) {
                if(inputs[i].type.toLowerCase() == 'hidden') {
                    inputs[i].remove();
                }
            }
            
            // Save tone suggested
            const inputHidden = document.createElement('input');
            inputHidden.type = 'hidden';
            inputHidden.name = 'tones';
            inputHidden.value = data.tones;
            document.forms['tone'].appendChild(inputHidden);

            // Create option
            data.reflexes.forEach((option) => {
                const optionDiv = document.createElement('div')
                optionDiv.setAttribute('class', 'option')

                const input = document.createElement('input');
                input.type = 'radio';
                input.id = option.id;
                input.name = 'q6';
                input.value = option.id;
                input.addEventListener('change', function() {
                    var buttons = document.forms['tone'].getElementsByTagName('button');
                    for(var i = 0; i < buttons.length; i++) {
                        if(buttons[i].type.toLowerCase() == 'submit') {
                            buttons[i].disabled = false;
                        }
                    }
                });
                optionDiv.appendChild(input);

                const label = document.createElement('label');
                label.htmlFor = option.id;
                label.innerHTML = option.text;
                optionDiv.appendChild(label);

                q6Options.appendChild(optionDiv);
            })
            // Show
            document.getElementById('question-6').classList.remove('hidden');
        }
    }

    // Send request
    request.send()

    });
}

}());