const { default: axios } = require("axios");

const getTranslateUrl = (from, to, txt) =>
    `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&sl=${from}&tl=${to}&q=${txt}`;

const native = "ru";
const languages = ["be", "uk", "en", "fr", "de", "it", "pl", "tr", "th", "ja"];
const text = "дайте мне воды";
const pause = 300; // API limit (5 requests per second)

const jobs = languages.map((language) =>
    getTranslateUrl(native, language, text)
);

let index = 0;

const intervalID = setInterval(addTranslation, pause);

async function addTranslation() {
    if (!jobs.length || index >= jobs.length) {
        clearInterval(intervalID);
        return;
    }
    let translate = [];

    let phrase;
    try {
        await axios(jobs[index]).then((resp) => {
            phrase = resp.data[0][0][0];
            console.log(phrase);
        });
    } catch (e) {
        console.log("skipped line", jobs[index]);
        console.error(e);
    }

    index++;
    translate.push(phrase);
}
