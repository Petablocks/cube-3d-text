import { expect, test } from "@playwright/test";
import type { Cube3DTextAPI, TitleRenderSpec } from "../src/utils/titleRender";

type RenderWindow = Window & { cube3DText: Cube3DTextAPI };

test("renders preset titles with the bundled fonts without changing saved work", async ({ page }, testInfo) => {
  const savedWorkspace = JSON.stringify({ version: 1, data: { fontId: "Minecraft Ten", texts: [] } });
  await page.addInitScript((saved) => localStorage.setItem("workspace", saved), savedWorkspace);
  await page.goto("/?mode=render");
  await page.waitForFunction(() => !!(window as RenderWindow).cube3DText);
  await expect(page.getByText(/Restore to the last scene|恢复到上次的场景|前回のシーンに戻りますか/)).toHaveCount(0);

  const capabilities = await page.evaluate(() => (window as RenderWindow).cube3DText.getCapabilities());
  expect(capabilities.materialPresets.find((preset) => preset.id === "grass")?.kind).toBe("texture");
  expect(capabilities.materialPresets.find((preset) => preset.id === "gradient_blue")?.colors.length).toBeGreaterThan(0);

  const lines = [
    { text: "PETABLOCKS", presetId: "grass", fontId: "Minecraft Ten" },
    { text: "NETWORK", presetId: "petablocks_tagline", fontId: "Chakra Petch Bold" },
    { text: "SERVER", presetId: "snow", fontId: "Press Start 2P" },
    { text: "Modpacks", presetId: "snow", fontId: "Work Sans SemiBold" },
    { text: "Survival", presetId: "grass", fontId: "Work Sans Bold" },
  ];
  for (const [index, line] of lines.entries()) {
    const spec: TitleRenderSpec = { version: 1, width: 800, height: 400, lines: [line] };
    const [download, result] = await Promise.all([
      page.waitForEvent("download"),
      page.evaluate((input) => (window as RenderWindow).cube3DText.renderTitle(input), spec),
    ]);
    expect(download.suggestedFilename()).toBe("cube-3d-text.png");
    expect(result.width).toBe(800);
    if (index === 0) await download.saveAs(testInfo.outputPath("title-grass.png"));
    const pixels = await page.evaluate(async (url) => {
      const blob = await fetch(url).then((response) => response.blob());
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let opaque = 0;
      let transparent = 0;
      let minX = canvas.width;
      let minY = canvas.height;
      let maxX = 0;
      let maxY = 0;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
          opaque++;
          const pixel = (i - 3) / 4;
          const x = pixel % canvas.width;
          const y = Math.floor(pixel / canvas.width);
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        } else transparent++;
      }
      return { width: bitmap.width, height: bitmap.height, bytes: blob.size, opaque, transparent, minX, minY, maxX, maxY };
    }, result.downloadUrl);
    expect(pixels).toMatchObject({ width: 800, height: 400 });
    expect(pixels.bytes).toBeGreaterThan(1000);
    expect(pixels.opaque, `render ${index} should contain text`).toBeGreaterThan(100);
    expect(pixels.transparent).toBeGreaterThan(100);
    expect(pixels.minX).toBeGreaterThan(30);
    expect(pixels.maxX).toBeLessThan(770);
    expect(pixels.minY).toBeGreaterThan(20);
    expect(pixels.maxY).toBeLessThan(380);
  }

  expect(await page.evaluate(() => localStorage.getItem("workspace"))).toBe(savedWorkspace);
  await expect(page.evaluate(() => (window as RenderWindow).cube3DText.renderTitle({
    version: 1, lines: [{ text: "Invalid", presetId: "missing" }],
  }))).rejects.toThrow(/presetId/);
});

test("shows and copies localized skill text without narrow-screen overlap", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  for (const [language, title, copyLabel, phrase] of [
    ["zh_CN", "AI 制作 Skill", "复制 Skill", "PNG 标题图"],
    ["en_US", "AI Creation Skill", "Copy Skill", "PNG titles"],
    ["ja_JP", "AI 制作 Skill", "Skill をコピー", "PNG タイトル"],
  ]) {
    await page.evaluate((lang) => localStorage.setItem("language", lang), language);
    await page.reload();
    await page.getByRole("button", { name: title }).click();
    const dialog = page.getByRole("dialog", { name: title });
    await expect(dialog).toContainText(phrase);
    await dialog.getByRole("button", { name: copyLabel }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(phrase);
    expect(copied).toContain("gradient_blue");
    await dialog.getByRole("button", { name: "Close" }).click();
  }

  await page.setViewportSize({ width: 320, height: 700 });
  const aiBounds = await page.getByRole("button", { name: "AI 制作 Skill" }).boundingBox();
  const settingsBounds = await page.getByRole("button", { name: /カメラ設定/ }).boundingBox();
  expect(aiBounds).not.toBeNull();
  expect(settingsBounds).not.toBeNull();
  expect(aiBounds!.x).toBeGreaterThan(settingsBounds!.x + settingsBounds!.width);
  await page.getByRole("button", { name: "AI 制作 Skill" }).click();
  const dialogBounds = await page.getByRole("dialog").boundingBox();
  expect(dialogBounds).not.toBeNull();
  expect(dialogBounds!.x).toBeGreaterThanOrEqual(0);
  expect(dialogBounds!.x + dialogBounds!.width).toBeLessThanOrEqual(320);
});
