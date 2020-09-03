var socket = io();
var $ = document.querySelector.bind(document);

window.onload = function (e) {
    $('.fundo').innerHTML = templates.login
}

socket.on('fora', () => {
    $('.fundo').innerHTML = templates.login
})

function listener_preto(v = '') {
    $('.game').innerHTML = `
        <div class="black resposta">
                ${v}
                <div class="mensagem_pronto">
                    <h1>Ready?</h1>
                </div>
            </div>`

    document.querySelector('.black').addEventListener('click', (eve) => {
        if (eve.target.className == 'safe') {
            return
        }
        send_resposta_black()
        //console.log(eve.target)
    })
}

var data_i = null;
var timeout = null;
socket.on('comando', (comando) => {
    if (!$('.game')) {
        return
    }
    //console.log(comando)
    var c = comando.cor

    if (c == 'black') {
        listener_preto()
        return
    }

    var p = null
    switch (c) {
        case 'red':
            p = -1;
            break;
        case 'green':
            p = 1;
            break;
        default:
            p = -1;
            break;
    }

    var n_id = (Math.random() * 100).toFixed(0)

    var m = `
            <div class="resposta ${c} d${n_id}" onclick="send_resposta(${p}, '${c}')">
                <div class="mensagem">
                    <h1>CLICA!!!!</h1>
                </div>
            </div>
        `
    $('.game').innerHTML = m
    data_i = new Date()

    clearTimeout(timeout)
    timeout = setTimeout(function () {
        if ($(`.d${n_id}`)) {
            send_resposta(p * -1, c)
        }
    }, 1500, p, c)
})

function login() {
    var nome = $('.nome').value;
    var patrulha = $('.patrulha').value

    socket.emit('login', {
        nome: nome,
        patrulha: patrulha
    }, (r) => {
        console.log(r)
        $('.fundo').innerHTML = `<div class="game"></div>`

        listener_preto()
    })

}

function send_resposta_black() {
    socket.emit('velocidade', {
        velocidade: 0,
        p: -1,
        cor: 'black'
    }, () => {})
}

function send_resposta(p, cor) {
    try {
        var d_now = new Date().getTime();
        var d_fim = d_now - data_i.getTime();
        var velo = d_fim / 1000;
    } catch (e) {
        var velo = 0;
    }

    socket.emit('velocidade', {
        velocidade: velo,
        p: p,
        cor: cor
    }, (r) => {
        console.log(r)

        var v = ''
        if (p == 1 && velo < 1.490) {
            v = `<span class="velocidade">Velocidade: ${velo}s</span>`
        }
        listener_preto(v)
    })
}