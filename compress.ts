import fs from "fs";
import path from "path";
import sharp from "sharp";
import md5 from "md5";
import CFG from "./config";
import Cache from "./cache";

/**
 * 压缩单张图片
 * @param from 源文件
 * @param to 目标文件
 */
async function compressPicture(from: string, to: string) {
    fs.mkdirSync(path.resolve(path.dirname(to)), { recursive: true });
    const ext = path.extname(to).toLowerCase();
    switch (ext) {
        case ".png":
            await sharp(from)
                .toColourspace("srgb")
                .png({ quality: CFG.QUALITY.PNG, compressionLevel: 1, dither: 0, palette: true })
                .toFile(to);
            break;
        case ".jpg":
        case ".jpeg":
            await sharp(from).jpeg({ quality: CFG.QUALITY.JPG }).toFile(to);
            break;
    }
    console.log("压缩完成", from, to);
}

/** @param {string} dir 目录 */
function rawPath(dir: string) {
    return path.relative(path.resolve(CFG.FROM), dir);
}

/**
 * 压缩文件
 * @param {string} dir 源目录
 * @param {string} to 输出目录
 * @param {boolean} force 是否强制压缩
 * @returns
 */
async function compressPictureByDir(dir: string, to: string, force: boolean = false) {
    dir = path.resolve(dir);
    const whitelist = CFG.WHITES;
    if (whitelist.includes(rawPath(dir))) {
        console.log("！！！跳过白名单目录", dir);
        fs.cpSync(dir, to, {
            filter: (src) => {
                return CFG.IMAGE_EXT.includes(path.extname(src).toLowerCase());
            },
        });
        return;
    }

    Cache.initialize();

    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        let file = files[i];
        const from = path.resolve(path.join(dir, file));
        const dst = path.join(to, file);
        if (CFG.IMAGE_EXT.includes(path.extname(file).toLowerCase())) {
            const temp = rawPath(from);
            if (whitelist.includes(temp)) {
                console.log("！！！跳过白名单文件", temp);
                fs.mkdirSync(to, { recursive: true });
                fs.copyFileSync(from, dst);
                continue;
            }

            const hash = md5(fs.readFileSync(from, { encoding: "utf-8" }));
            if (force) {
                await compressPicture(from, dst);
            } else if (Cache.compare(from, hash)) {
                console.log("！！！跳过未更改文件", from, hash);
                continue;
            } else {
                await compressPicture(from, dst);
                Cache.write(from, hash);
            }
        } else if (fs.statSync(from).isDirectory()) {
            await compressPictureByDir(from, dst, force);
        }
    }

    Cache.save();
}

/**
 * 强制压缩
 */
async function compressPictureForce() {
    for (let i = 0; i < CFG.FORCES.length; i++) {
        const item = CFG.FORCES[i];
        const from = path.resolve(path.join(CFG.FROM, item));
        const to = path.join(CFG.TO, item);
        if (CFG.IMAGE_EXT.includes(path.extname(item).toLowerCase())) {
            const hash = md5(fs.readFileSync(from, { encoding: "utf-8" }));
            if (Cache.compare(from, hash)) {
                console.log("！！！跳过未更改文件", from, hash);
                continue;
            } else {
                await compressPicture(from, to);
                Cache.write(from, hash);
            }
        }
    }
    Cache.save();
}

export default { compressPicture, compressPictureByDir, compressPictureForce };
