import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button, Checkbox, Flex, InputNumber, Modal, Select, Slider, Space, Typography } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { ThreeCanvasHandle } from "./ThreeCanvas";
import { BannerBackground, bannerBackgrounds, bannerPresets, customPreset } from "../utils/bannerPresets";
import { useLanguage } from "../language";

interface BannerExportModalProps {
    open: boolean;
    onClose: () => void;
    canvasRef: React.RefObject<ThreeCanvasHandle | null>;
}

const checkerboard = "repeating-conic-gradient(#d1d5db 0% 25%, #f9fafb 0% 50%) 50% / 16px 16px";

const BannerExportModal: React.FC<BannerExportModalProps> = ({ open, onClose, canvasRef }) => {
    const { gLang } = useLanguage();
    const [presetId, setPresetId] = useState(bannerPresets[0].id);
    const [customWidth, setCustomWidth] = useState(1200);
    const [customHeight, setCustomHeight] = useState(630);
    const [background, setBackground] = useState<BannerBackground>("brand");
    const [padding, setPadding] = useState(5);
    const [useCurrentView, setUseCurrentView] = useState(true);
    const [showSafeArea, setShowSafeArea] = useState(true);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const preset = useMemo(
        () => presetId === "custom"
            ? customPreset(customWidth, customHeight)
            : bannerPresets.find(p => p.id === presetId) ?? bannerPresets[0],
        [presetId, customWidth, customHeight],
    );

    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        return canvas.renderBanner({ preset, background, padding: padding / 100, useCurrentView });
    }, [canvasRef, preset, background, padding, useCurrentView]);

    const [preview, setPreview] = useState<string | null>(null);
    const [previewError, setPreviewError] = useState<string | null>(null);

    // Re-render the preview on the next frame whenever the options change.
    useEffect(() => {
        if (!open) return;
        const frame = requestAnimationFrame(() => {
            try {
                const output = render();
                setPreview(output ? output.toDataURL("image/png") : null);
                setPreviewError(null);
            } catch (e) {
                setPreview(null);
                setPreviewError(e instanceof Error ? e.message : String(e));
            }
        });
        return () => cancelAnimationFrame(frame);
    }, [open, render]);
    const error = previewError ?? downloadError;

    const download = () => {
        try {
            const output = render();
            if (!output) return;
            output.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = preset.id === "server-icon"
                    ? "server-icon.png"
                    : `petablocks-${preset.id}-${preset.width}x${preset.height}.png`;
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }, "image/png");
            setDownloadError(null);
        } catch (e) {
            setDownloadError(e instanceof Error ? e.message : String(e));
        }
    };

    const { safeArea } = preset;
    const pct = (value: number, total: number) => `${(value / total) * 100}%`;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={gLang('banner.title')}
            width={760}
            footer={[
                <Button key="close" onClick={onClose}>{gLang('banner.close')}</Button>,
                <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={download} disabled={!!error}>
                    {gLang('banner.download', { width: preset.width, height: preset.height })}
                </Button>,
            ]}
        >
            <Flex vertical gap="middle">
                <Flex gap="middle" wrap>
                    <Flex vertical gap={4} style={{ flex: "1 1 260px" }}>
                        <Typography.Text strong>{gLang('banner.size')}</Typography.Text>
                        <Select
                            value={presetId}
                            onChange={setPresetId}
                            options={[
                                ...bannerPresets.map(p => ({ value: p.id, label: `${p.label} (${p.width} × ${p.height})` })),
                                { value: "custom", label: gLang('banner.custom') },
                            ]}
                        />
                        {presetId === "custom" && (
                            <Space>
                                <InputNumber min={16} max={8192} value={customWidth} onChange={v => setCustomWidth(v ?? 1200)} prefix="W" />
                                <InputNumber min={16} max={8192} value={customHeight} onChange={v => setCustomHeight(v ?? 630)} prefix="H" />
                            </Space>
                        )}
                        <Typography.Text type="secondary">{preset.note}</Typography.Text>
                    </Flex>
                    <Flex vertical gap={4} style={{ flex: "1 1 220px" }}>
                        <Typography.Text strong>{gLang('banner.background')}</Typography.Text>
                        <Select
                            value={background}
                            onChange={setBackground}
                            options={bannerBackgrounds.map(b => ({ value: b.id, label: b.label }))}
                        />
                        <Typography.Text strong>{gLang('banner.padding', { value: padding })}</Typography.Text>
                        <Slider min={0} max={40} value={padding} onChange={setPadding} />
                    </Flex>
                </Flex>
                <Space wrap>
                    <Checkbox checked={useCurrentView} onChange={e => setUseCurrentView(e.target.checked)}>
                        {gLang('banner.useCurrentView')}
                    </Checkbox>
                    <Checkbox checked={showSafeArea} onChange={e => setShowSafeArea(e.target.checked)}>
                        {gLang('banner.showSafeArea')}
                    </Checkbox>
                </Space>
                {error ? (
                    <Alert type="warning" showIcon message={error} />
                ) : (
                    <div
                        style={{
                            position: "relative",
                            width: `min(100%, ${Math.round(420 * preset.width / preset.height)}px)`,
                            aspectRatio: `${preset.width} / ${preset.height}`,
                            margin: "0 auto",
                            background: checkerboard,
                            borderRadius: 6,
                            overflow: "hidden",
                        }}
                    >
                        {preview && (
                            <img
                                src={preview}
                                alt={gLang('banner.previewAlt')}
                                style={{
                                    position: "absolute", inset: 0, width: "100%", height: "100%",
                                    imageRendering: preset.width <= 128 ? "pixelated" : "auto",
                                }}
                            />
                        )}
                        {showSafeArea && (
                            <div
                                aria-hidden
                                style={{
                                    position: "absolute",
                                    left: pct(safeArea.x, preset.width),
                                    top: pct(safeArea.y, preset.height),
                                    width: pct(safeArea.width, preset.width),
                                    height: pct(safeArea.height, preset.height),
                                    border: "2px dashed #E040FB",
                                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.25)",
                                    pointerEvents: "none",
                                }}
                            />
                        )}
                    </div>
                )}
                <Typography.Text type="secondary">{gLang('banner.hint')}</Typography.Text>
            </Flex>
        </Modal>
    );
};

export default BannerExportModal;
