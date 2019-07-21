const { getHtmlBodyByUrl, downloadImageWithRefer } = require('../utils/index.js')

async function requestUrl(index, mangaNo, mangaName) {
    const base = `https://18h.animezilla.com/manga/${mangaNo}`
    const $ = await getHtmlBodyByUrl(base, index)
    let img = $('#comic');
    let src = '';
    let result = false
    if(img) {
        src = img.attr('src');
        console.log(src);
        result = await downloadImageWithRefer(src, `./${mangaName}`, `${index}.jpg` , `https://18h.animezilla.com/manga/${mangaNo}/${index}`)
    } else {
        console.log('no src', img);
    }
    return new Promise((resolve, reject) => {
        resolve(result)
    })
    
}

async function run(pageCount, mangaNo, mangaName, startIndex) {
    let go = true;
    let count = startIndex || 1;
        while(go) {
        let result = await requestUrl(count, mangaNo, mangaName)
        if(count >= pageCount) {
            go = false
        } else {
            console.log(`-----------count ${count}------------`)
            count++;
        }
    }
}

let mangaName = '[中文A漫][7zu7] 異種姦オーガズム/異種姦性高潮'
let pageCount = 201
let no = 3496

run(pageCount, no, mangaName, 63);
// requestUrl(12)