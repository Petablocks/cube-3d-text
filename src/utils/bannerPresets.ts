// Banner sizes and safe areas from the PETABLOCKS marketing guide
// (petablocks-brand/marketing/MARKETING_GUIDE.md, "Social Media & Banner Specs").

export interface SafeArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface BannerPreset {
    id: string;
    label: string;
    width: number;
    height: number;
    safeArea: SafeArea;
    note: string;
}

const centered = (width: number, height: number, safeWidth: number, safeHeight: number): SafeArea => ({
    x: Math.round((width - safeWidth) / 2),
    y: Math.round((height - safeHeight) / 2),
    width: safeWidth,
    height: safeHeight,
});

export const bannerPresets: BannerPreset[] = [
    {
        id: "discord-banner",
        label: "Discord server banner",
        width: 960,
        height: 540,
        // Keep logos centred and out of the bottom 20%.
        safeArea: { x: 96, y: 54, width: 768, height: 378 },
        note: "960 × 540. Keep logos centred and clear of the bottom 20%.",
    },
    {
        id: "x-header",
        label: "X / Twitter header",
        width: 1500,
        height: 500,
        safeArea: centered(1500, 500, 1200, 400),
        note: "1500 × 500. Keep logos inside the 1200 × 400 centre box.",
    },
    {
        id: "youtube-banner",
        label: "YouTube channel banner",
        width: 2560,
        height: 1440,
        safeArea: centered(2560, 1440, 1232, 338),
        note: "2560 × 1440. Only the 1232 × 338 centre shows on every device.",
    },
    {
        id: "server-icon",
        label: "Minecraft server icon",
        width: 64,
        height: 64,
        safeArea: centered(64, 64, 60, 60),
        note: "64 × 64 PNG. Save it as server-icon.png.",
    },
    {
        id: "modpack-banner",
        label: "Modpack banner (16:9)",
        width: 1920,
        height: 1080,
        safeArea: centered(1920, 1080, 1600, 700),
        note: "1920 × 1080. A general 16:9 size for modpack pages and launchers (not from the brand guide).",
    },
];

export type BannerBackground = "transparent" | "space" | "surface" | "black" | "brand";

export const bannerBackgrounds: { id: BannerBackground; label: string }[] = [
    { id: "transparent", label: "Transparent" },
    { id: "space", label: "Deep Space #0B0F19" },
    { id: "surface", label: "Panel #111827" },
    { id: "black", label: "Black #000000" },
    { id: "brand", label: "Brand glow (dark with cyan / purple)" },
];

export function customPreset(width: number, height: number, marginPercent = 10): BannerPreset {
    const w = Math.max(16, Math.round(width));
    const h = Math.max(16, Math.round(height));
    const m = Math.min(Math.max(marginPercent, 0), 45) / 100;
    return {
        id: "custom",
        label: "Custom size",
        width: w,
        height: h,
        safeArea: centered(w, h, Math.round(w * (1 - 2 * m)), Math.round(h * (1 - 2 * m))),
        note: `${w} × ${h} with a ${Math.round(m * 100)}% margin.`,
    };
}

/** Largest scale factor (1–3) that keeps the supersampled render under the GPU size limit. */
export function supersampleFactor(width: number, height: number, maxTextureSize = 4096): number {
    const longest = Math.max(width, height);
    if (longest <= 0) return 1;
    return Math.max(1, Math.min(3, Math.floor(maxTextureSize / longest)));
}

export function paintBackground(ctx: CanvasRenderingContext2D, width: number, height: number, background: BannerBackground): void {
    ctx.clearRect(0, 0, width, height);
    if (background === "transparent") return;
    if (background === "brand") {
        ctx.fillStyle = "#0B0F19";
        ctx.fillRect(0, 0, width, height);
        const radius = Math.max(width, height) * 0.6;
        const cyan = ctx.createRadialGradient(width * 0.2, height * 0.15, 0, width * 0.2, height * 0.15, radius);
        cyan.addColorStop(0, "rgba(15, 205, 248, 0.35)");
        cyan.addColorStop(1, "rgba(15, 205, 248, 0)");
        ctx.fillStyle = cyan;
        ctx.fillRect(0, 0, width, height);
        const purple = ctx.createRadialGradient(width * 0.85, height * 0.9, 0, width * 0.85, height * 0.9, radius);
        purple.addColorStop(0, "rgba(168, 36, 255, 0.35)");
        purple.addColorStop(1, "rgba(168, 36, 255, 0)");
        ctx.fillStyle = purple;
        ctx.fillRect(0, 0, width, height);
        return;
    }
    ctx.fillStyle = background === "space" ? "#0B0F19" : background === "surface" ? "#111827" : "#000000";
    ctx.fillRect(0, 0, width, height);
}
