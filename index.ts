import fs from "fs";
import path from "path";
import CFG from "./config";
import COM from "./compress";

(async function main() {
    // 复制整个目录
    if (!fs.existsSync(CFG.TO)) {
        fs.mkdirSync(CFG.TO);
    }
    fs.cpSync(CFG.FROM, CFG.TO, {
        recursive: true,
        filter: (src) => {
            return CFG.IMAGE_EXT.includes(path.extname(src).toLowerCase());
        },
    });
    // 常规压缩
    await COM.compressPictureByDir(CFG.FROM, CFG.TO);
    // 强制压缩
    await COM.compressPictureForce();
})();
