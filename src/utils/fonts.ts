// Built-in fonts are bundled with the site under public/fonts, so the tool
// works on any static host (e.g. Cloudflare Pages) with no external CDN.
// Add more with: npx tsx scripts/convert-font.ts <font.ttf> public/fonts/<Name>.json
const localFontUrl = (filename: string): string =>
    `${import.meta.env.BASE_URL}fonts/${filename}`;

export const builtinFontsMap: { [name: string]: string } = {
    "Minecraft Ten": localFontUrl("Minecraft_Ten_Regular.json"),
    "Chakra Petch Bold": localFontUrl("Chakra_Petch_Bold.json"),
    "Work Sans SemiBold": localFontUrl("Work_Sans_SemiBold.json"),
    "Work Sans Bold": localFontUrl("Work_Sans_Bold.json"),
    "Press Start 2P": localFontUrl("Press_Start_2P_Regular.json"),
    "Unifont ASCII": localFontUrl("Unifont_ASCII_Regular.json"),
};

export const builtinFontsTextureYOffset: { [name: string]: number } = {}

export interface FontLicenceInfo {
    tagColor: string;
    tag: string;
    tagTooltip: string;
}

export const builtinFontsLicence: { [name: string]: FontLicenceInfo } = {
    "Minecraft Ten": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.minecraftTenTooltip",
    },
    "Chakra Petch Bold": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.chakraPetchTooltip",
    },
    "Work Sans SemiBold": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.workSansTooltip",
    },
    "Work Sans Bold": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.workSansTooltip",
    },
    "Press Start 2P": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.pressStartTooltip",
    },
    "Unifont ASCII": {
        tagColor: "success",
        tag: "fontLicence.sil",
        tagTooltip: "fontLicence.unifontTooltip",
    }
}
