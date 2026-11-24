async function carregaProdutos() {
    const container = document.getElementById("lista-produtos");

    // busca os dados na api
    const resposta = await fetch('https://dummyjson.com/products?limit=20');
    const dados = await resposta.json();

    // limpar antes de inserir
    container.innerHTML = '';

    dados.products.forEach(produto => { 
        const cardHTML = `
            <div class="col-md mb-4">
                <div class="product-card">
                    <img src="${produto.thumbnail}" alt="${produto.title}" class="product-image"/>
                        <div class="product-info">
                            <h3 class="product-title">${produto.title}</h3>
                            <p class="product-description">${produto.description}</p>
                            <div class="product-price">${produto.price}</div>
                            <button class="btn-buy">Compra agora</button>
                        </div>
                </div>
            </div>`;
        // adiciona outros card
        container.innerHTML += cardHTML;
    });
}

// busca inicial
carregaProdutos();