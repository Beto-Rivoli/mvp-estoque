document.getElementById('formulario-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        document.getElementById('formulario-login').style.display = 'none';
        document.getElementById('produtoForm').style.display = 'block';
        document.getElementById('viewLogButton').style.display = 'block'; // Show the button
        loadProdutos();
    } else {
        alert('Login falhou. Verifique suas credenciais.');
    }
});

