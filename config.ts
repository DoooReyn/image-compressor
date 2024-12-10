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
    },
    /** 强制名单（可配置目录或文件） */
    FORCES: [],
    /** 白名单（可配置目录或文件） */
    WHITES: [],
} as {
    IMAGE_EXT: string[];
    FROM: string;
    TO: string;
    QUALITY: {
        JPG: number;
        PNG: number;
    };
    FORCES: string[];
    WHITES: string[];
};
