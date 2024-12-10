export default {
    IMAGE_EXT: [".png", ".jpg", ".jpeg"],
    /** 源目录 */
    FROM: "./images",
    /** 输出目录 */
    TO: "./output",
    /** 图片质量 */
    QUALITY: {
        JPG: 80,
        PNG: 80,
        PNG_COLORSPACE: "rgba8888",
    },
    /** 白名单（可配置目录或文件） */
    WHITES: ["effect"],
    /** 强制名单（只能配置到文件【通常是出现在白名单目录中，但是又不想被跳过的极少数文件】） */
    FORCES: ["effect/40606_0000.png"],
} as {
    IMAGE_EXT: string[];
    FROM: string;
    TO: string;
    QUALITY: {
        JPG: number;
        PNG: number;
        PNG_COLORSPACE: string;
    };
    FORCES: string[];
    WHITES: string[];
};
