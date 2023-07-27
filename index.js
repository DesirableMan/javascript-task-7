'use strict';

const { get } = require('got');

const async = require('./async');

/**
 * Возвращает функцию, которая возвращает промис
 * @param {String} from - язык с которого нужно перевести
 * @param {String} lang - язык на который нужно перевести
 * @param {String} text - переводимый текст
 * @returns {Function<Promise>}
 */
function createTranslationJob(from, lang, text) {
    let url = `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${encodeURIComponent(
        from
    )}&tl=${encodeURIComponent(lang)}&q=${encodeURIComponent(text)}`;

    return () => get(url, { json: true });
}

const native = 'ru';
const languages = ['be', 'uk', 'en', 'fr', 'de', 'it', 'pl', 'tr', 'th', 'ja'];
const text = 'дайте мне воды';

const jobs = languages.map((language) =>
    createTranslationJob(native, language, text)
);

async
    .runParallel(jobs, 2)
    .then(result => result.map(item => item instanceof Error ? item : item.body[0][0][0]))
    .then(translations => translations.join('\n'))
    .then(console.info);

/*
    дайце мне вады
    дайте мені води
    give me water
    donnez-moi de l'eau
    gib mir Wasser
    dammi dell'acqua
    daj mi wody
    verin bana su
    ให้ฉัน้ำ
    い水
*/
