document.addEventListener('DOMContentLoaded', function () {

    const PREGUNTAS = "https://raw.githubusercontent.com/cesarmcuellar/CuestionarioWeb/refs/heads/main/cuestionario.json";
    fetch(PREGUNTAS)
        .then(response => response.json())
        .then(data => {
            mostrarPreguntas(data);

        }).catch(error => {
            console.log(error);
        });
});

function mostrarPreguntas(data) {
    const responseUser = {};
    let puntaje = 0;
    let preguntas = data.multiple_choice_questions.map(q => ({ ...q, tipo: 'multiple' })); // Agregar propiedad tipo multiple a cada pregunta 
    let preguntasFalsoVerdadero = data.true_false_questions.map(q => ({ ...q, tipo: 'true_false' }));
    let contenedorPregunta = document.getElementById('contenedor-pregunta');
    let preguntasCombinadas = [...preguntas, ...preguntasFalsoVerdadero];

    mezclarArray(preguntasCombinadas);
    
    showQuestions(preguntasCombinadas, contenedorPregunta);

    //capturar respuestas
    getResponses(preguntasCombinadas, responseUser);

    //reiniciar
    clearSpaces();
}

function clearSpaces() {
    document.getElementById('botonReiniciar').addEventListener('click', () => {
        location.reload();
    });
}

function getResponses(preguntasCombinadas, responseUser) {
    document.getElementById('botonEnviar').addEventListener('click', () => {
        preguntasCombinadas.forEach((pregunta, index) => {
            const seleccionada = document.querySelector(`input[name="pregunta-${index}"]:checked`);
            if (seleccionada) {
                if (pregunta.tipo === 'multiple') {
                    responseUser[`pregunta-${index}`] = pregunta.options[seleccionada.value];
                    console.log(`Pregunta ${index + 1}: Respuesta seleccionada: ${pregunta.options[seleccionada.value]}`);
                } else if (pregunta.tipo === 'true_false') {
                    responseUser[`pregunta-${index}`] = seleccionada.value; // Verdadero o Falso
                    console.log(`Pregunta ${index + 1}: Respuesta seleccionada: ${seleccionada.value}`);
                }
            } 
        });

        validarRespuesta(preguntasCombinadas, responseUser);

    });
}

function validarRespuesta(preguntasCombinadas, responseUser) {
    let puntaje = 0;
    preguntasCombinadas.forEach((pregunta, index) => {
        if (pregunta.correct_answer === responseUser[`pregunta-${index}`]) {
            puntaje++;
        }
    });

    let porcentaje = (puntaje / preguntasCombinadas.length) * 100;
    let porcentajeRedondeado = porcentaje.toFixed(2);

    Swal.fire({
        title: 'Resultado',
        text: 'Tu puntaje es: ' + porcentajeRedondeado + '%',
        icon: 'warning',
        confirmButtonText: 'guardar respuestas',
    });
}

function showQuestions(preguntasCombinadas, contenedorPregunta) {
    preguntasCombinadas.forEach((pregunta, index) => {
        let divPregunta = document.createElement('div');
        let divRespuesta = document.createElement('div');

        divPregunta.classList.add('pregunta');
        divRespuesta.classList.add('respuesta');
        divPregunta.innerHTML = ` <h2>${index + 1}. ${pregunta.question}</h2> `;

        if (pregunta.tipo === 'multiple') {
            divRespuesta.innerHTML = pregunta.options
                .map((resp, indexOpc) => `<li><input type="radio" name="pregunta-${index}" value="${indexOpc}"> ${resp} </li>`
                ).join('');
        } else if (pregunta.tipo === 'true_false') {
            divRespuesta.innerHTML = `
                <li><input type="radio" name="pregunta-${index}" value="true"> Verdadero </li>
                <li><input type="radio" name="pregunta-${index}" value="false"> Falso </li> `;
        }
        divPregunta.appendChild(divRespuesta);
        contenedorPregunta.appendChild(divPregunta);
    });
}

function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // intercambiar elementos
    }
}