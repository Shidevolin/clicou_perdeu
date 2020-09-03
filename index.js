var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use('/', express.static('./public'))
app.set('view engine', 'ejs')

var port = 80;
http.listen(port, () => {
    console.log(`To aqui no ${port}`);
});

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/manager', (req, res) => {
    res.render('controle')
})
process.stdout.write('\033c')
/// IO

var todo_mundo = {}

function add_user(login){
    if(!todo_mundo[login.patrulha]){
        todo_mundo[login.patrulha] = {}
    }

    if(!todo_mundo[login.patrulha][login.nome]){
        todo_mundo[login.patrulha][login.nome] = {}
        todo_mundo[login.patrulha][login.nome].velocidade_media = []
        todo_mundo[login.patrulha][login.nome].green_ok = 0
        todo_mundo[login.patrulha][login.nome].green_fail = 0
        todo_mundo[login.patrulha][login.nome].red_ok = 0
        todo_mundo[login.patrulha][login.nome].red_fail = 0
        todo_mundo[login.patrulha][login.nome].black = 0
    }
}

function add_point(login, ponto){
    if(!todo_mundo[login.patrulha]){
        return
    }

    if(!todo_mundo[login.patrulha][login.nome]){
        return
    }

    if(ponto.cor == 'green'){
        if(ponto.p == 1){
            todo_mundo[login.patrulha][login.nome].velocidade_media.push(ponto.velocidade)
            todo_mundo[login.patrulha][login.nome].green_ok += ponto.p
        } else {
            todo_mundo[login.patrulha][login.nome].green_fail += ponto.p
        }
    }

    if(ponto.cor == 'red'){
        if(ponto.p == 1){
            todo_mundo[login.patrulha][login.nome].red_ok += ponto.p
        } else {
            todo_mundo[login.patrulha][login.nome].red_fail += ponto.p
        }
    }

    if(ponto.cor == 'black'){
        todo_mundo[login.patrulha][login.nome].black += ponto.p
    }
}

io.on('connection', (socket) => {

    socket.on('checa_ponto', () => {
        io.emit('ponto', todo_mundo)
    }) 

    socket.on('zerar_tudo', () => {
        io.emit('fora')
        todo_mundo = {}

        io.emit('ponto', todo_mundo)
    }) 

    socket.on('login', (login, cb) => {
        socket.usuario = login
        add_user(login)

        io.emit('ponto', todo_mundo)

        cb({
            status: 'ok'
        })
    })    

    socket.on('manda_cor', (comando) => {        
        io.emit('comando', {
            comando: 'cor',
            cor: comando.cor
        })
    })

    socket.on('velocidade', (dados, cb) => {
        if(!socket.usuario){
            socket.emit('fora')
            return
        }
          
        //console.log(dados)
        //console.log(socket.usuario)

        add_point(socket.usuario, dados)

        io.emit('ponto', todo_mundo)

        cb({
            status: 'ok'
        })
    })

});