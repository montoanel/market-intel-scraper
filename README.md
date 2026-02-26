# 📊 Market Intel Scraper
Inteligência de dados e mineração de tendências para profissionais de E-commerce.

O Market Intel Scraper é uma ferramenta Full-Stack de engenharia de dados construída para extrair, analisar e ranquear informações comerciais em tempo real do maior marketplace da América Latina. Diferente da busca tradicional, este sistema remove o viés de anúncios pagos e revela os verdadeiros campeões de vendas.

🚀 Principais Funcionalidades
Radar de Tendências Nacionais: Varredura em tempo real do diretório de tendências do Brasil.

Deep Scan de Nicho: Extração avançada que captura a volumetria de vendas e ordena pelo sucesso comercial.

Análise Financeira Instantânea: Cálculo dinâmico de Ticket Médio, Menor Preço e Maior Preço.

Arquitetura Master-Detail: Interface fluida que navega da visão macro (Tendências) para micro (Produtos).

## ⚙️ Como Rodar o Projeto Localmente

Este projeto exige que o **Node.js** esteja instalado no seu ambiente de desenvolvimento.

1. Instale todas as dependências executando o comando abaixo na raiz do projeto:
```bash
npm install
```

2. O sistema utiliza uma arquitetura dividida e precisa de **dois terminais abertos simultaneamente** para rodar:

**Terminal 1 (Backend/Scraper):**
Abra o primeiro terminal, garanta que está na raiz do projeto e execute:
```bash
npx ts-node server/index.ts
```
*(O backend rodará na porta 3001)*

**Terminal 2 (Frontend/UI):**
Abra o segundo terminal, garanta que está na raiz do projeto e execute:
```bash
npm run dev
```
*(O frontend rodará na porta: 5173)*

Após seguir os passos, acesse o endereço fornecido no Terminal 2 no seu navegador.
