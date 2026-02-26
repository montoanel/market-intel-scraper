import express from 'express';
import cors from 'cors';
import { chromium } from 'playwright';

const app = express();
app.use(cors({ origin: '*' }));

app.get('/api/top-trends', async (req, res) => {
    try {
        const browser = await chromium.launch({
            headless: true, // Na nuvem OBRIGATORIAMENTE tem que ser true
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled' // Flag Mágica: Esconde que é automação
            ]
        });

        // Criamos um contexto blindado imitando um humano real no Windows
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 }
        });

        const page = await context.newPage();

        // Navegar para a página oficial de tendências
        await page.goto('https://tendencias.mercadolivre.com.br/');
        console.log('[Scraper Backend] Acessando URL:', page.url());

        // Extração super filtrada: pega apenas links de busca reais
        const trends = await page.$$eval('a', (links) => {
            return links
                // A Mágica: Tendências reais sempre apontam para a página de listas do ML
                .filter(link => link.href.includes('lista.mercadolivre.com.br/'))
                .map(link => link.textContent?.trim() || '')
                // Remove lixos de formatação e strings curtas demais
                .filter(text => text.length > 2 && !text.toLowerCase().includes('frete'))
        });

        // Garante que não teremos palavras duplicadas e capta o Top 20
        const uniqueTrends = Array.from(new Set(trends)).filter(Boolean).slice(0, 20);
        const rankedTrends = uniqueTrends.map((keyword, index) => ({
            rank: index + 1,
            keyword: keyword,
        }));

        console.log(`[Scraper Backend] Extração concluída. Itens encontrados: ${rankedTrends.length}`);
        if (rankedTrends.length === 0) console.log('[Scraper Backend] ALERTA: Nenhuma tendência encontrada. O ML mudou o DOM ou mostrou Captcha.');

        await browser.close();
        res.json(rankedTrends);
    } catch (error) {
        console.error('Erro no Playwright:', error);
        res.status(500).json({ error: 'Failed to scrape data' });
    }
});

app.get('/api/products', async (req, res) => {
    const keyword = req.query.keyword as string;
    if (!keyword) return res.status(400).json({ error: 'Keyword is required' });

    try {
        const browser = await chromium.launch({
            headless: true, // Na nuvem OBRIGATORIAMENTE tem que ser true
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-blink-features=AutomationControlled' // Flag Mágica: Esconde que é automação
            ]
        });

        // Criamos um contexto blindado imitando um humano real no Windows
        const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport: { width: 1920, height: 1080 }
        });

        const page = await context.newPage();

        const searchQuery = encodeURIComponent(keyword);
        console.log(`[Scraper] Iniciando busca aprofundada para o nicho: ${keyword}`);

        await page.goto(`https://lista.mercadolivre.com.br/${searchQuery}`);
        console.log('[Scraper Backend] Acessando URL de Produtos:', page.url());

        // Faz um scroll rápido para carregar imagens escondidas (lazy load)
        await page.evaluate(() => window.scrollBy(0, 2000));
        await page.waitForTimeout(500);

        // Seletor Curinga: Busca tanto as classes antigas quanto o novo Poly Design
        const products = await page.$$eval('.ui-search-layout__item, .poly-card', (elements) => {
            return elements.map((el, index) => {
                const priceEl = el.querySelector('.andes-money-amount__fraction');
                const linkEl = el.querySelector('a');
                const imgEl = el.querySelector('img');

                let imageUrl = '';
                let altText = '';
                if (imgEl) {
                    imageUrl = imgEl.getAttribute('data-src') || imgEl.getAttribute('data-ch-src') || imgEl.getAttribute('src') || '';
                    altText = imgEl.getAttribute('alt') || '';
                }

                const titleEl = el.querySelector('h2, h3, .poly-component__title, .ui-search-item__title');
                let extractedTitle = titleEl?.textContent?.trim() || altText.trim();

                const cardText = el.textContent || '';
                const salesMatch = cardText.match(/\+?\s*([\d,]+)\s*(mil)?\s*vendidos/i);
                let salesCount = 0;
                let salesText = '';

                if (salesMatch) {
                    let num = parseFloat(salesMatch[1].replace(',', '.'));
                    if (salesMatch[2] && salesMatch[2].toLowerCase() === 'mil') num *= 1000;
                    salesCount = num;
                    salesText = salesMatch[0].trim();
                }

                return {
                    id: `ml-scraped-${index}`,
                    title: extractedTitle || 'Produto Sem Título',
                    price: priceEl ? parseFloat(priceEl.textContent!.replace(/\./g, '').replace(',', '.')) : 0,
                    productUrl: linkEl ? linkEl.getAttribute('href') : '',
                    imageUrl: imageUrl,
                    salesCount,
                    salesText,
                    source: 'MERCADO_LIVRE'
                };
            });
        });

        products.sort((a, b) => b.salesCount - a.salesCount);

        console.log(`[Scraper] Sucesso! ${products.length} produtos encontrados.`);

        await browser.close();
        res.json(products);
    } catch (error) {
        console.error('Erro no Playwright ao buscar produtos:', error);
        res.status(500).json({ error: 'Failed to scrape products' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Scraper Backend rodando na porta ${PORT}`));
