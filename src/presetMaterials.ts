import {
    TextMaterialColorOption,
    TextMaterialGradientOption,
    TextMaterials
} from "./types/text";

export const materialGradientMediumYellow : TextMaterials = {
    front: {
        mode: "gradient",
        colorGradualStart: "#ffd07b",
        colorGradualEnd: "#ffaa00",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    back: {
        mode: "gradient",
        colorGradualStart: "#ffd07b",
        colorGradualEnd: "#ffaa00",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    up: {
        mode: "color",
        color: "#553800"
    } as TextMaterialColorOption,
    down: {
        mode: "gradient",
        colorGradualStart: "#a56c00",
        colorGradualEnd: "#553800",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    left: {
        mode: "color",
        color: "#553800"
    } as TextMaterialColorOption,
    right: {
        mode: "color",
        color: "#553800"
    } as TextMaterialColorOption,
    outline: {
        mode: "color",
        color: "#291a00"
    } as TextMaterialColorOption
}

export const materialGradientLightBlue : TextMaterials = {
    front: {
        mode: "gradient",
        colorGradualStart: "#9ae5ff",
        colorGradualEnd: "#13b2ff",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    back: {
        mode: "gradient",
        colorGradualStart: "#9ae5ff",
        colorGradualEnd: "#13b2ff",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    up: {
        mode: "color",
        color: "#003855"
    } as TextMaterialColorOption,
    down: {
        mode: "gradient",
        colorGradualStart: "#00649a",
        colorGradualEnd: "#003855",
        repeat: 1,
        offset: 0
    } as TextMaterialGradientOption,
    left: {
        mode: "color",
        color: "#003855"
    } as TextMaterialColorOption,
    right: {
        mode: "color",
        color: "#003855"
    } as TextMaterialColorOption,
    outline: {
        mode: "color",
        color: "#001e2b"
    } as TextMaterialColorOption
}

const brandMaterial = (
    frontStart: string, frontEnd: string, side: string,
    downStart: string, downEnd: string, outline: string
): TextMaterials => ({
    front: { mode: "gradient", colorGradualStart: frontStart, colorGradualEnd: frontEnd, repeat: 1, offset: 0 } as TextMaterialGradientOption,
    back: { mode: "gradient", colorGradualStart: frontStart, colorGradualEnd: frontEnd, repeat: 1, offset: 0 } as TextMaterialGradientOption,
    up: { mode: "color", color: side } as TextMaterialColorOption,
    down: { mode: "gradient", colorGradualStart: downStart, colorGradualEnd: downEnd, repeat: 1, offset: 0 } as TextMaterialGradientOption,
    left: { mode: "color", color: side } as TextMaterialColorOption,
    right: { mode: "color", color: side } as TextMaterialColorOption,
    outline: { mode: "color", color: outline } as TextMaterialColorOption,
});

// PETABLOCKS wordmark: Electric Cyan -> Mint Green with deep teal extrusion (matches public/materials/petablocks_primary.json)
export const materialPetablocksPrimary: TextMaterials =
    brandMaterial("#0FCDF8", "#8BFAA3", "#052627", "#0a4a4c", "#031617", "#000000");

// PETABLOCKS tagline: Neon Magenta -> Network Purple with Deep Nether Purple extrusion (matches public/materials/petablocks_tagline.json)
export const materialPetablocksTagline: TextMaterials =
    brandMaterial("#E040FB", "#A824FF", "#36005D", "#5a0099", "#36005D", "#000000");

// 添加到预设材料中
export const presetMaterials = [
    materialGradientMediumYellow,
    materialGradientLightBlue
]