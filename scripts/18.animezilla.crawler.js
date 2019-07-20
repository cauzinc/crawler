const { getHtmlBodyByUrl, downloadImageWithRefer } = require('../utils/index.js')

let mangaName = '[中文A漫][7zu7] 異種姦オーガズム/異種姦性高潮'
let pageCount = 201
let no = 3496

async function requestUrl(index, mangaNo) {
    
    const base = `https://18h.animezilla.com/manga/${mangaNo}`
    const $ = await getHtmlBodyByUrl(base, index)
    let img = $('#comic');
    let src = '';
    let result = false
    if(img) {
        src = img.attr('src');
        console.log(src);
        result = await downloadImageWithRefer(src, `./${mangaName}`, `${index}.jpg` , `https://18h.animezilla.com/manga/${mangaNo}/${index}`)
        
        // request({
        //     url: src,
        //     method: 'GET',
        //     headers: {
        //         'Referer': `https://18h.animezilla.com/manga/${mangaNo}/${index}`,
        //         'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15'
        //     }
        // }).pipe(fs.createWriteStream(`../assets/img/${index}.jpg`))
        // reslove({ src, img })
    } else {
        console.log('no src', img);
    }
    return new Promise((resolve, reject) => {
        resolve(result)
    })
    
}

async function run(pageCount, mangaNo, startIndex) {
    let go = true;
    let count = startIndex || 1;
        while(go) {
        let result = await requestUrl(count, mangaNo)
        if(count >= pageCount) {
            go = false
        } else {
            console.log(`-----------count ${count}------------`)
            count++;
        }
    }
}


run(pageCount, no, 63);
// requestUrl(12)