/*
 * CATÁLOGO DA REI DAS EMBALAGENS
 * ----------------------------------------------------------------
 * Este é o ÚNICO arquivo que você precisa editar para atualizar a loja.
 *
 *  - preco:   valor em reais, com ponto (ex.: 18.90)
 *  - estoque: quantidade disponível. Use 0 para marcar como "Esgotado".
 *             Com 5 ou menos, o site mostra "Restam N".
 *  - imagem:  arquivo dentro de assets/img/
 *
 * Preços e estoques abaixo são EXEMPLOS: confira com a loja antes de publicar.
 * Depois de editar, salve e envie para o GitHub (git add . && git commit && git push).
 */
window.REI = {
  whatsapp: "553135321493", // somente dígitos, com 55 + DDD

  categorias: [
    { nome: "Descartáveis", slug: "descartaveis" },
    { nome: "Embalagens para Alimentos", slug: "embalagens-alimentos" },
    { nome: "Caixas e Papelão", slug: "caixas-papelao" },
    { nome: "Sacolas e Sacos Plásticos", slug: "sacolas-sacos" },
    { nome: "Fitas e Filmes", slug: "fitas-filmes" },
    { nome: "Higiene e Limpeza", slug: "higiene-limpeza" },
  ],

  produtos: [
    { id: 1, nome: "Copo descartável branco 200 ml", categoria: "descartaveis", descricao: "Pacote com copos resistentes para bebidas.", preco: 18.90, estoque: 24, unidade: "pacote", imagem: "assets/img/copo.svg" },
    { id: 2, nome: "Copo descartável transparente 300 ml", categoria: "descartaveis", descricao: "Ideal para festas e atendimento em lanchonetes.", preco: 21.50, estoque: 5, unidade: "pacote", imagem: "assets/img/copo.svg" },
    { id: 3, nome: "Prato descartável fundo", categoria: "descartaveis", descricao: "Prato reforçado para refeições.", preco: 16.90, estoque: 0, unidade: "pacote", imagem: "assets/img/prato.svg" },
    { id: 4, nome: "Talher de plástico leve", categoria: "descartaveis", descricao: "Conjunto com garfo, faca e colher.", preco: 14.50, estoque: 9, unidade: "pacote", imagem: "assets/img/talher.svg" },
    { id: 5, nome: "Guardanapo 33x30 cm", categoria: "higiene-limpeza", descricao: "Guardanapo macio para uso diário.", preco: 8.90, estoque: 32, unidade: "pacote", imagem: "assets/img/guardanapo.svg" },
    { id: 6, nome: "Marmitex de alumínio 750 ml", categoria: "embalagens-alimentos", descricao: "Formato compacto para refeições.", preco: 34.90, estoque: 4, unidade: "pacote", imagem: "assets/img/marmitex.svg" },
    { id: 7, nome: "Marmitex de isopor 900 ml", categoria: "embalagens-alimentos", descricao: "Bandeja térmica descartável.", preco: 29.90, estoque: 0, unidade: "pacote", imagem: "assets/img/marmitex.svg" },
    { id: 8, nome: "Pote redondo com tampa 500 ml", categoria: "embalagens-alimentos", descricao: "Pote transparente para delivery.", preco: 38.00, estoque: 18, unidade: "pacote", imagem: "assets/img/pote.svg" },
    { id: 9, nome: "Pote quadrado com tampa 750 ml", categoria: "embalagens-alimentos", descricao: "Versátil para doces e comidas.", preco: 42.50, estoque: 3, unidade: "pacote", imagem: "assets/img/pote.svg" },
    { id: 10, nome: "Caixa para bolo 30 cm", categoria: "caixas-papelao", descricao: "Caixa resistente com visor de papel.", preco: 4.90, estoque: 15, unidade: "un", imagem: "assets/img/caixa.svg" },
    { id: 11, nome: "Caixa para doces 6 doces", categoria: "caixas-papelao", descricao: "Acabamento simples para presentear.", preco: 2.80, estoque: 50, unidade: "un", imagem: "assets/img/caixa.svg" },
    { id: 12, nome: "Caixa de papelão média", categoria: "caixas-papelao", descricao: "Caixa para transporte e armazenagem.", preco: 3.50, estoque: 2, unidade: "un", imagem: "assets/img/caixa.svg" },
    { id: 13, nome: "Caixa de papelão grande", categoria: "caixas-papelao", descricao: "Reforçada para cargas maiores.", preco: 7.90, estoque: 12, unidade: "un", imagem: "assets/img/caixa.svg" },
    { id: 14, nome: "Sacola plástica 30x40", categoria: "sacolas-sacos", descricao: "Sacola para pequenas compras.", preco: 18.00, estoque: 0, unidade: "pacote", imagem: "assets/img/sacola.svg" },
    { id: 15, nome: "Sacola plástica reforçada 40x50", categoria: "sacolas-sacos", descricao: "Alta resistência para varejo.", preco: 32.90, estoque: 7, unidade: "pacote", imagem: "assets/img/sacola.svg" },
    { id: 16, nome: "Saco de lixo preto 30 litros", categoria: "sacolas-sacos", descricao: "Rolo com fundo resistente.", preco: 13.90, estoque: 26, unidade: "pacote", imagem: "assets/img/saco.svg" },
    { id: 17, nome: "Saco de lixo preto 50 litros", categoria: "sacolas-sacos", descricao: "Ideal para cozinhas e empresas.", preco: 19.90, estoque: 5, unidade: "pacote", imagem: "assets/img/saco.svg" },
    { id: 18, nome: "Saco de lixo azul 100 litros", categoria: "sacolas-sacos", descricao: "Indicado para coleta separada.", preco: 27.90, estoque: 0, unidade: "pacote", imagem: "assets/img/saco.svg" },
    { id: 19, nome: "Fita adesiva transparente 48 mm", categoria: "fitas-filmes", descricao: "Rolo largo para fechamento de caixas.", preco: 8.50, estoque: 40, unidade: "un", imagem: "assets/img/fita.svg" },
    { id: 20, nome: "Fita gomada marrom 45 mm", categoria: "fitas-filmes", descricao: "Reforça embalagens para envio.", preco: 12.90, estoque: 4, unidade: "un", imagem: "assets/img/fita.svg" },
    { id: 21, nome: "Filme PVC 28 cm x 300 m", categoria: "fitas-filmes", descricao: "Proteção prática para alimentos.", preco: 39.90, estoque: 11, unidade: "pacote", imagem: "assets/img/filme.svg" },
    { id: 22, nome: "Papel alumínio 30 cm x 100 m", categoria: "fitas-filmes", descricao: "Para cozinhas profissionais e domésticas.", preco: 44.90, estoque: 6, unidade: "pacote", imagem: "assets/img/aluminio.svg" },
    { id: 23, nome: "Desinfetante concentrado 2 litros", categoria: "higiene-limpeza", descricao: "Limpeza perfumada para ambientes.", preco: 24.90, estoque: 8, unidade: "un", imagem: "assets/img/limpeza.svg" },
    { id: 24, nome: "Detergente neutro 500 ml", categoria: "higiene-limpeza", descricao: "Produto concentrado para louças.", preco: 6.90, estoque: 22, unidade: "un", imagem: "assets/img/limpeza.svg" },
    { id: 25, nome: "Papel toalha interfolhado", categoria: "higiene-limpeza", descricao: "Pacote para higienização.", preco: 17.50, estoque: 3, unidade: "pacote", imagem: "assets/img/papel.svg" },
    { id: 26, nome: "Luva descartável preta", categoria: "higiene-limpeza", descricao: "Proteção para manipulação de alimentos.", preco: 29.90, estoque: 0, unidade: "caixa", imagem: "assets/img/luva.svg" },
  ],
};
