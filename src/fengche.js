const parser = require('node-html-parser');
const parse = parser.parse;

export async function search(keyword) {
    const resp = await fetch(`https://www.mochadm.com/search/-------------.html?wd=${keyword}`);
    const html = await resp.text();
    const doc = parse(html);

    const divs = doc.querySelectorAll('.result_list');
    const ret = divs.map(div => {
        const a = div.querySelector('a');
        const info = div.querySelector('.search-info');
        const seriesId = a.attributes.href;
        const name = info.querySelector('.result_title').querySelector('a').attributes.title;
        const image = a.querySelector('img_wrapper lazyload').attributes['data-original'];
        return {
            seriesId,
            name,
            image,
        };
    });
    return JSON.stringify(ret);
}

export async function getSources(seriesId) {
    const resp = await fetch(`https://www.mochadm.com${seriesId}`);
    const doc = parse(await resp.text());
    const ul = doc.querySelector('.con_c2_list');
    const episodes = ul.querySelectorAll('li').map((li, idx) => {
        const a = li.querySelector('a');
        return {
            episodeId: a.attributes.href,
            episode: idx,
            episodeName: a.text,
        };
    })
    return JSON.stringify([{
        episodes,
    }])
}

export async function getVideoResource(episodeId) {
    return `https://www.mochadm.com${episodeId}`;
}

export function getConfig() {
    return JSON.stringify({
        name: 'fengche.js',
        useWebview: true,
    });
}