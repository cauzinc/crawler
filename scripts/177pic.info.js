const cheerio = require('cheerio');
const { getHtmlBodyByUrl, downloadImageWithRefer, executeSyncPromises } = require('../utils');

let imgIndex = 1;

async function getTargetUrl(baseUrl, dir) {
  let $ = null;
  try {
    $ = await getHtmlBodyByUrl(baseUrl);
  } catch (err) {
    if (err) {
      console.log('error when read html', err);
      return;
    }
  }
  const picList = $('.single-content p').find('noscript');
  const picLength = picList.length;

  console.log('picLength', picLength);
  const taskArr = [];
  for (let i = 0; i < picLength; i++) {
    const noscriptHtml = picList[i].children[0].data;
    const body = cheerio.load(noscriptHtml);
    const img = body('img');
    const src = img.attr('src');
    if (src) {
      console.log('src', imgIndex, src);
      const filename = `${imgIndex}.jpg`;
      taskArr.push(() => downloadImageWithRefer(src, dir, filename, baseUrl));
      imgIndex++;
    }
  }
  return new Promise(async (resolve) => {
    await executeSyncPromises(taskArr).then(() => {
      resolve(true);
    });
  });
}


async function run(url, page, dir) {
  let pageCount = 1;
  for (; pageCount < page; pageCount++) {
    console.log(`----------pageCount${pageCount}----------`);
    const baseUrl = pageCount === 1 ? url : `${url}/${pageCount}/`;
    getTargetUrl(baseUrl, dir);
  }
}
const url = 'http://www.177pic.info/html/2019/07/2977875.html';
const dir = './[メガねぃ] 思春期セックス 思春期少女性愛 [205P]';
const page = 21;

run(url, page, dir);
