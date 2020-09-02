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

/// IO

io.on('connection', (socket) => {

    socket.on('login', (login, cb) => {
        console.log(login),
        cb({
            status: 'ok'
        })
    })    

    socket.on('manda_cor', (comando) => {
        //console.log(comando)
        io.emit('comando', {
            comando: 'cor',
            cor: comando.cor
        })
    })

    socket.on('velocidade', (dados, cb) => {
        console.log(dados)
        cb({
            status: 'ok'
        })
    })

});