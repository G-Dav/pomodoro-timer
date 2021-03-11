var conf = {
    pomodoro: 25,
    dCorto: 5,
    dLargo: 15,
    sesiones: 4,        // número de sesiones de trabajo antes de un descanso largo
    automatic: false,   // indica si las sesiones se inician de forma automática
    alarma: true,
    volumen: 100
}

// Objeto tiempo que define el tiempo restante de una sesión
let tiempoAux = {
    min: 25,
    seg: 0
}
pomodoro.min
const tiempoPantalla = document.getElementById('tiempo')
const btnInicio = document.getElementById('start')
const btnReset = document.getElementById('reset')
const btnSesion = document.getElementById('pomodoro')
const btndCorto = document.getElementById('shortBreak')
const btndLargo = document.getElementById('longBreak')
const btnAjustes = document.getElementById('ajuste')
const btnSave = document.getElementById('guardar')
const btnAuto = document.querySelector('.auto')
const checkAuto = document.config.autostart
const btnAlarma = document.querySelector('.timbre')
const checkAlarm = document.config.alarm
const vol = document.config.barraVol
btnInicio.dataset.id = 1    // 1: iniciar la cuenta regresiva, 2: detener la cuenta regresiva
let intervalo = false       // indica si hay una sesión en curso, si la hay intervalo = setIterval()
let tipoSesion = 1          // 1: pomodoro, 2: descanso corto, 3: descanso largo
let confirmacion            // se utliza para indicar si el usuario elige interrumpir una sesión para iniciar otra
let numSesiones = 0         // número de sesiones pomodoro que se han terminado antes de un descanso largo
let sonido
const canvas = document.getElementById('lienzo')
let ctx
let totalSegundos
let incremento
let angulo 

window.addEventListener('load', () => {
    sonido = cargarSonido("alarm.mp3")
    ctx = canvas.getContext("2d")
    calcularIncremento()
    sonido.volume = 1
    //draw(angulo)
})

function calcularIncremento() {
    totalSegundos = tiempoAux.min*60
    incremento = 2/totalSegundos
    angulo = incremento
}

function draw(angulo) {
    limpiarCanvas()

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.moveTo(125, 125)
    ctx.arc(125, 125, 120, 0, 2*Math.PI, false)
    ctx.fill();
    //pintarParte("black", 0, 2*Math.PI)

    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.moveTo(125, 125)
    ctx.arc(125, 125, 110, 1.5*Math.PI, (1.5 + angulo)*Math.PI, false)
    ctx.fill();

    ctx.fillStyle = "black"
    ctx.beginPath()
    ctx.moveTo(125, 125)
    ctx.arc(125, 125, 105, 0, 2*Math.PI, false)
    ctx.fill();
    //ctx.closePath()
    //ctx.stroke()
}  

const pintarParte = (color, angulo_inicio, angulo_fin) => {
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(125, 125)
    ctx.arc(125, 125, 105, angulo_inicio, angulo_fin, false)
    ctx.fill()
}

const dibujarTiempo = () => {
    //limpiarCanvas()
    ctx.fillStyle = "white"
    ctx.font = "bold 40px sans-serif";
    ctx.fillText(formatoTiempo(tiempoAux.min, tiempoAux.seg),100,100);
}

const limpiarCanvas = () => {
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 250, 250)
}

// Carga un sonido y lo interta en el DOM de forma oculta
function cargarSonido(fuente) {
    var elementoAudio = document.createElement("audio")
    elementoAudio.src = fuente
    elementoAudio.setAttribute("preload", "auto")
    elementoAudio.setAttribute("controls", "none")
    elementoAudio.style.display = "none"
    document.body.appendChild(elementoAudio)
    return elementoAudio
}

// Iniciar la cuenta regresiva al presionar el botón Start
// Cambiar el estado del botón entre Start y Stop en cada click
btnInicio.addEventListener('click', () =>{
    if(btnInicio.dataset.id == 1){
        btnInicio.dataset.id = 2
        btnInicio.innerText = "Stop"
        intervalo = setInterval("restarTiempo()", 1000);
        //console.log("start"+intervalo)
    }else{
        resetBtnStart()
        clearInterval(intervalo)
        //console.log("stop"+intervalo)
    }
})

// Función que realiza la cuenta regresiva
const restarTiempo = () => {
    //console.log(angulo)
    if(tiempoAux.seg == 0){
        tiempoAux.min--
        if(tiempoAux.min < 0){
            if(conf.alarma){
                sonido.play()
            }
            if(!conf.automatic){
                // detener la cuenta regresiva 
                clearInterval(intervalo)
                intervalo = false
            }
            // Asignar el tiempo de la sesión siguiente según la sesión actual
            switch(tipoSesion){
                case 1:
                    numSesiones++
                    if(numSesiones >= conf.sesiones){
                        tipoSesion = 3
                        tiempoAux.min = conf.dLargo
                        numSesiones = 0
                    }else{
                        tipoSesion = 2
                        tiempoAux.min = conf.dCorto
                    }
                    break;
                case 2:
                    tiempoAux.min = conf.pomodoro
                    tipoSesion = 1
                    break;
                case 3:
                    tiempoAux.min = conf.pomodoro
                    tipoSesion = 1
                    break;
            }
            tiempoAux.seg = 0
            // Restablecer los valores del boton start
            if(!intervalo){
                resetBtnStart()
            }
            //limpiarCanvas()
            calcularIncremento()
            if(conf.automatic){
                angulo = 0
            }
        }else{
            tiempoAux.seg = 59
        }
    }else{
        tiempoAux.seg--
    }
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    if(ctx){
        if(intervalo!==false){
            draw(angulo)
            angulo += incremento
        }else{
            limpiarCanvas()
        }
        dibujarTiempo()
    }
}

// Para mostrar el tiempo en el formato mm:ss
const formatoTiempo = (minutos, segundos) => {
    var m = minutos<10?"0"+minutos:minutos
    var s = segundos<10?"0"+segundos:segundos
    return m + ":" + s
}

// Reiniciar el contador con el botón reset
btnReset.addEventListener('click', () => {
    resetear()
    console.log(conf)
})

const resetear = () => {
    resetBtnStart()
    clearInterval(intervalo)
    intervalo = false
    console.log(tipoSesion)
    switch(tipoSesion){
        case 1:
            tiempoAux.min = conf.pomodoro
            break;
        case 2:
            tiempoAux.min = conf.dCorto
            break;
        case 3:
            tiempoAux.min = conf.dLargo
            break;
    }
    tiempoAux.seg = 0
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    limpiarCanvas()
    angulo = 0
}

// Cambiar a descanso corto
btndCorto.addEventListener('click', () => {
    revisarSesionActiva(2, conf.dCorto)
})

// Cambiar a descanso largo
btndLargo.addEventListener('click', () => {
    revisarSesionActiva(3, conf.dLargo)
})

// Cambiar a sesión pomodoro
btnSesion.addEventListener('click', () => {
    revisarSesionActiva(1, conf.pomodoro)
})

// Revisar si hay una sesión activa cuando al intentar cambiar a otra 
// Si la hay, se muestra una ventana donde el usuario debe confirmar o cancelar el cambio
// Si se confirma el cambio se termina la sesión actual y se reinician los valores de tiempo
// según el tipo de sesión seleccionado (1:pomodoro, 2:desc.corto, 3:desc.largo) 
const revisarSesionActiva = (tSesion, mins) => {
    // Si no hay una sesión activa, se hace el cambio de inmediato
    if(!intervalo){
        cambioSesion(tSesion, mins)
    }else{
        // Si hay una sesión en curso, se solicita la confirmación del usuario
        confirmacion = window.confirm("Are you sure you want to interrupt the current session?")
        // Si el usuario acepta, se hace el cambio y se reinician los valores
        if(confirmacion){
            clearInterval(intervalo)
            cambioSesion(tSesion, mins)
            limpiarCanvas()
            dibujarTiempo()
        }
    }
}

// Termina con la sesión actual y reinicia los valores de tiempo 
const cambioSesion = (tSesion, min) => {
    tipoSesion = tSesion
    tiempoAux.min = min
    tiempoAux.seg = 0
    tiempoPantalla.innerHTML = formatoTiempo(tiempoAux.min, tiempoAux.seg)
    intervalo = false
    calcularIncremento()
    resetBtnStart()
}

const resetBtnStart = () => {
    btnInicio.dataset.id = 1
    btnInicio.innerText = "Start"
}

// Modificar los valores de la variable conf según la elección del usuario
btnSave.addEventListener('click', () => {
    conf.pomodoro = document.config.tPomodoro.value
    conf.dCorto = document.config.tShortBreak.value
    conf.dLargo = document.config.tLongBreak.value
    conf.sesiones = document.config.interval.value
    conf.automatic = checkAuto.checked
    conf.alarma = checkAlarm.checked
    conf.volumen = document.config.barraVol.value
    resetear()
    calcularIncremento()
})

// Al mostrar la ventana modal, los campos del fomulario deben tener como
// valor los ajustes seleccionados por el usuario
btnAjustes.addEventListener('click', () => {
    document.config.tPomodoro.value = conf.pomodoro
    document.config.tShortBreak.value = conf.dCorto
    document.config.tLongBreak.value = conf.dLargo
    document.config.interval.value = conf.sesiones
    checkAuto.checked = conf.automatic
    checkAlarm.checked = conf.alarma
    document.config.barraVol.value = conf.volumen
})

// Activar/desactivar de forma automática el inicio de una sesión
btnAuto.addEventListener('click', () => {
    document.config.autostart.click()
})

checkAuto.addEventListener('click', (e) => {
    e.stopPropagation()
})

// Activar/desactivar alarma
btnAlarma.addEventListener('click', () => {
    document.config.alarm.click()
    HabilitarRango()
})

checkAlarm.addEventListener('click', (e) => {
    e.stopPropagation()
    HabilitarRango()
})

const HabilitarRango = () => {
    // Si el campo de Alarma está seleccionado
    if(checkAlarm.checked){
        vol.disabled = false
    }else{
        vol.disabled = true
    }
}

vol.addEventListener('change', (e) => {
    // recuperar el valor seleccionado con e.currentTarget.value
    // volume acepta valores entre 0 y 1
    sonido.volume = e.currentTarget.value/100
    sonido.play()
})