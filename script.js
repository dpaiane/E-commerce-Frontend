async function carregarProdutos(termo = '') {
    const container = document.getElementById("lista-produtos");

    // Se houver termo, usa a rota de busca da API; senão, carrega os 20 iniciais
    const url = termo 
        ? `https://dummyjson.com/products/search?q=${encodeURIComponent(termo)}`
        : 'https://dummyjson.com/products?limit=20';

    const resposta = await fetch(url);
    const dados = await resposta.json();

    container.innerHTML = '';

    // Feedback caso nenhum produto seja encontrado
    if (dados.products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">Nenhum produto encontrado para "<strong>${termo}</strong>".</p>
            </div>`;
        return;
    }

    dados.products.forEach(produto => {
        const precoFormatado = produto.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const cardHTML = `
            <div class="col-md-4 mb-4">
                <div class="product-card">
                    <img src="${produto.thumbnail}" alt="${produto.title}" class="product-image" />
                    <div class="product-info">
                        <h3 class="product-title">${produto.title}</h3>
                        <p class="product-description">${produto.description}</p>
                        <div class="product-price">${precoFormatado}</div>
                        <button class="btn-buy" data-name="${produto.title}" data-price="${produto.price}">
                            Comprar Agora
                        </button>
                    </div>
                </div>
            </div>`;
        container.innerHTML += cardHTML;
    });
}

// Escuta o envio do formulário de busca
document.getElementById("form-busca").addEventListener("submit", (e) => {
    e.preventDefault();
    const termo = document.getElementById("input-busca").value.trim();
    carregarProdutos(termo);
});

// Recarrega todos os produtos se o usuário limpar o campo (clicando no "x" do input search)
document.getElementById("input-busca").addEventListener("search", (e) => {
    if (e.target.value === '') {
        carregarProdutos();
    }
});

carregarProdutos();