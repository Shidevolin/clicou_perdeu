var templates = {
    login: `
    <div class="form">
            <div class="imagem">
                <h4>GAME</h4>
                <h1>CLicOu, PERDEU!</h1>
            </div>
            <div class="input">
                <label for="nome">Nome:</label><br>
                <input type="text" class="nome">
            </div>
            <div class="input">
                <label for="patrulha">Patrulha:</label><br>
                <select name="patrulha" class="patrulha">
                    <option value="" disabled selected="selected"></option>
                    <option value="Phoenix">Phoenix</option>
                    <option value="Lira">Lira</option>
                    <option value="Gêmini">Gêmini</option>
                    <option value="Sol">Sol</option>
                    <option value="Sirius">Sirius</option>
                </select>
            </div>
            <div class="botao">
                <button onclick="login()">ENTRAR</button>
            </div>
        </div>
    `
}