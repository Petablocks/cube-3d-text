import assert from "node:assert/strict";
import test from "node:test";
import { bannerPresets, customPreset, supersampleFactor } from "../src/utils/bannerPresets";

test("every banner preset keeps its safe area inside the canvas", () => {
    for (const preset of [...bannerPresets, customPreset(1200, 630)]) {
        const { x, y, width, height } = preset.safeArea;
        assert.ok(x >= 0 && y >= 0, preset.id);
        assert.ok(width > 0 && height > 0, preset.id);
        assert.ok(x + width <= preset.width, preset.id);
        assert.ok(y + height <= preset.height, preset.id);
    }
});

test("banner presets match the PETABLOCKS marketing guide", () => {
    const byId = Object.fromEntries(bannerPresets.map(p => [p.id, p]));
    assert.deepEqual([byId["discord-banner"].width, byId["discord-banner"].height], [960, 540]);
    // Discord: nothing in the bottom 20%.
    const discord = byId["discord-banner"].safeArea;
    assert.ok(discord.y + discord.height <= 540 * 0.8);
    assert.deepEqual(byId["x-header"].safeArea, { x: 150, y: 50, width: 1200, height: 400 });
    assert.deepEqual(byId["youtube-banner"].safeArea, { x: 664, y: 551, width: 1232, height: 338 });
    assert.deepEqual([byId["server-icon"].width, byId["server-icon"].height], [64, 64]);
});

test("supersampling stays within the texture size limit", () => {
    assert.equal(supersampleFactor(60, 60), 3);
    assert.equal(supersampleFactor(1232, 338), 3);
    assert.equal(supersampleFactor(2000, 500), 2);
    assert.equal(supersampleFactor(5000, 500), 1);
});
