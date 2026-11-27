// funcao que carrega os produtos e monta os card
async function carregarProdutos(termo = '', categoria = '') {
    const container = document.getElementById("lista-produtos");

    let url = 'https://dummyjson.com/products?limit=40';

    if (termo) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(termo)}`;
    } else if (categoria) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(categoria)}`;
    }

    const resposta = await fetch(url);
    const dados = await resposta.json();

    container.innerHTML = '';

    if (dados.products.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-muted fs-5">Nenhum produto encontrado para "<strong>${termo}</strong>".</p>
            </div>`;
        return;
    }
    // formata o preço para real do Brasil
    dados.products.forEach(produto => {
        const precoFormatado = produto.price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

        const cardHTML = `
            <div class="col-md-3 mb-4">
                <div class="product-card mx-auto">
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

// Quando o usuário digitar uma busca manual, desmarca as categorias ativas
document.getElementById("form-busca").addEventListener("submit", (e) => {
    e.preventDefault();
    // remove o atributo caso o usuario digite no input
    document.querySelectorAll(".btn-category").forEach(b => b.classList.remove("active"));
    // remove os espaços em branco no inicio e no final
    const termo = document.getElementById("input-busca").value.trim();
    // chama a funcao para carregar os produtos
    carregarProdutos(termo);
});
// quando se faz uma busca com o input vazio o sistema ativa a categoria todos produtos
document.getElementById("input-busca").addEventListener("search", (e) => {
    if (e.target.value === '') {
        // muda a classe pra ativa e carrega os produtos
        document.querySelector('.btn-category[data-category=""]')?.classList.add("active");
        // chama a funcao que carrega os produtos
        carregarProdutos();
    }
});

// Dicionário opcional para exibir os nomes em português nos botões
const traducoesCategorias = {
    "beauty": "Beleza",
    "fragrances": "Fragrâncias",
    "furniture": "Móveis",
    "groceries": "Supermercado",
    "home-decoration": "Decoração",
    "kitchen-accessories": "Cozinha",
    "laptops": "Notebooks",
    "mens-shirts": "Camisas Masculinas",
    "mens-shoes": "Calçados Masculinos",
    "mens-watches": "Relógios Masculinos",
    "mobile-accessories": "Acessórios Celular",
    "smartphones": "Smartphones",
    "sports-accessories": "Esportes",
    "sunglasses": "Óculos de Sol"
};

// carrega os produtos por catetorias
async function carregarCategorias() {
    const containerCategorias = document.getElementById("lista-categorias");
    // se nao clicar em nenhuma categoria encerra a funcao
    if (!containerCategorias) return;

    // consulta no produto no end poist categorias
    const resposta = await fetch('https://dummyjson.com/products/category-list');
    // converte os dados
    const categorias = await resposta.json();

    // Pega as 8 primeiras categorias para não poluir a tela (ou use todas se preferir)
    const principais = categorias.slice(0, 8);

    // carrega as pilulas na tela - Botão padrão "Todos" já inicia ativo
    containerCategorias.innerHTML = `
        <button type="button" class="btn-category active" data-category="">
            Todos
        </button>
    `;

    // percorre a lista categorias e adiciona os botoes na tela
    principais.forEach(item => {
        const nomeExibicao = traducoesCategorias[item] || item.replace('-', ' ');
        containerCategorias.innerHTML += `
            <button type="button" class="btn-category" data-category="${item}">
                ${nomeExibicao}
            </button>
        `;
    });

    // Adiciona evento de clique em cada pílula
    const botoes = containerCategorias.querySelectorAll(".btn-category");
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            // Remove 'active' de todos e marca apenas o clicado
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");

            // Limpa o campo de busca textual para evitar conflito visual
            document.getElementById("input-busca").value = '';

            // pega a categoria selecionada e chama a funcao com essa informação
            const categoriaSelecionada = botao.getAttribute("data-category");
            carregarProdutos('', categoriaSelecionada);
        });
    });
}

// Inicializa categorias e produtos
carregarCategorias();
carregarProdutos();