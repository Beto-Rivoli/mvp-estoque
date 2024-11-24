document.getElementById('produtoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = document.getElementById('preco').value;

    const response = await fetch('/inventory/api/produtos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, quantidade, preco })
    });

    if (response.ok) {
        loadProdutos();
        document.getElementById('produtoForm').reset();
    }
});

const loadProdutos = async () => {
    const response = await fetch('/inventory/api/produtos');
    const produtos = await response.json();
    const produtosList = document.getElementById('produtosList');
    produtosList.innerHTML = '';
    produtos.forEach(produto => {
        const li = document.createElement('li');
        li.textContent = `${produto.nome} - Quantidade: ${produto.quantidade} - Preço: R$${produto.preco}`;

        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit');
        editButton.addEventListener('click', () => {
            document.getElementById('nome').value = produto.nome;
            document.getElementById('quantidade').value = produto.quantidade;
            document.getElementById('preco').value = produto.preco;
            document.getElementById('editarProduto').style.display = 'block';
            document.getElementById('editarProduto').dataset.id = produto.id;
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.classList.add('remove');
        removeButton.addEventListener('click', async () => {
            const response = await fetch(`/inventory/api/produtos/${produto.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                loadProdutos();
            } else {
                const error = await response.json();
                alert(error.message);
            }
        });

        li.appendChild(editButton);
        li.appendChild(removeButton);
        produtosList.appendChild(li);
    });
};

document.getElementById('editarProduto').addEventListener('click', async () => {
    const id = document.getElementById('editarProduto').dataset.id;
    const nome = document.getElementById('nome').value;
    const quantidade = document.getElementById('quantidade').value;
    const preco = document.getElementById('preco').value;

    const response = await fetch(`/inventory/api/produtos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, quantidade, preco })
    });

    if (response.ok) {
        loadProdutos();
        document.getElementById('produtoForm').reset();
        document.getElementById('editarProduto').style.display = 'none';
    } else {
        alert('Falha ao editar o produto.');
    }
});

// Carregar produtos ao iniciar
loadProdutos();

// Create a modal for displaying logs
const logModal = document.createElement('div');
logModal.id = 'logModal';
logModal.style.display = 'none';
logModal.style.position = 'fixed';
logModal.style.zIndex = '1';
logModal.style.left = '0';
logModal.style.top = '0';
logModal.style.width = '100%';
logModal.style.height = '100%';
logModal.style.overflow = 'auto';
logModal.style.backgroundColor = 'rgba(0,0,0,0.4)';

const modalContent = document.createElement('div');
modalContent.style.backgroundColor = '#fefefe';
modalContent.style.margin = '15% auto';
modalContent.style.padding = '20px';
modalContent.style.border = '1px solid #888';
modalContent.style.width = '80%';

const closeModalButton = document.createElement('span');
closeModalButton.innerHTML = '&times;';
closeModalButton.style.color = '#aaa';
closeModalButton.style.float = 'right';
closeModalButton.style.fontSize = '28px';
closeModalButton.style.fontWeight = 'bold';
closeModalButton.style.cursor = 'pointer';
closeModalButton.addEventListener('click', () => {
    logModal.style.display = 'none';
});

const logContent = document.createElement('pre');
logContent.id = 'logContent';
logContent.style.whiteSpace = 'pre-wrap';

modalContent.appendChild(closeModalButton);
modalContent.appendChild(logContent);
logModal.appendChild(modalContent);
document.body.appendChild(logModal);

document.getElementById('viewLogButton').addEventListener('click', async () => {
    const response = await fetch('/inventory/api/logs');
    if (response.ok) {
        const logs = await response.json();
        logContent.textContent = logs.map(log => JSON.stringify(log)).join('\n'); // Print each log entry on a new line
        logModal.style.display = 'block';
    } else {
        alert('Falha ao carregar o log do sistema.');
    }
});

// Close the modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target == logModal) {
        logModal.style.display = 'none';
    }
});