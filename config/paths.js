const path = require('path')
const fs = require('fs')
// 这里不使用process.cwd()， 因为cwd()是根据node执行位置变化的，而__dirname相对固定
const ROOT_PATH = path.resolve(__dirname, '../')
const IMAGE_DIR = path.resolve(__dirname, '../assets/img')
const VIDEO_DIR = path.resolve(__dirname, '../assets/video')

/**
 * check if path exists
 */
function checkPathExist(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            resolve(err ? false : stats);
        })
    })
}

function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            resolve(!err);
        })
    })
}

/**
 * check and create dir
 */
async function recursionMkdir(dir) { 
    // console.log('dir', dir, count);
    const isExists = await checkPathExist(dir);
    // 如果路径已经存在，直接返回true； 如果路径已经存在，且不是文件夹，则返回false
    if (isExists && isExists.isDirectory()) {
        return true
    }
    // 获取上级路径
    let upperDir = path.parse(dir).dir;
    if (upperDir === '/') {
        console.log('path error!!')
        return false
    }
    // 执行递归操作
    let status = await recursionMkdir(upperDir);
    let mkdirStatus = null;
    
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    
    return mkdirStatus;
}

module.exports = {
    ROOT_PATH,
    IMAGE_DIR,
    VIDEO_DIR,
    recursionMkdir
}