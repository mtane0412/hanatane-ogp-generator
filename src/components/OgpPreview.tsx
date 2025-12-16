/**
 * OGPプレビューコンポーネント
 *
 * OGP画像のリアルタイムプレビューを表示し、ダウンロード機能を提供します。
 * html-to-imageライブラリを使用してHTML要素を画像に変換します。
 */

import { Download } from "lucide-react";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { OgpConfig } from "@/types/ogp";
import { getOgpSize } from "@/types/ogp";

interface OgpPreviewProps {
	/** OGP設定 */
	config: OgpConfig;
}

/**
 * OGPプレビューコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 */
export default function OgpPreview({ config }: OgpPreviewProps) {
	// プレビュー要素へのref（画像変換に使用）
	const previewRef = useRef<HTMLDivElement>(null);

	// ダウンロード中の状態管理
	const [isDownloading, setIsDownloading] = useState(false);

	// 設定から画像サイズを取得
	const { width, height } = getOgpSize(config);

	/**
	 * OGP画像をPNGとしてダウンロード
	 */
	const handleDownload = async () => {
		if (!previewRef.current) return;

		setIsDownloading(true);
		try {
			// HTML要素をPNG画像に変換
			const dataUrl = await toPng(previewRef.current, {
				width,
				height,
				pixelRatio: 2, // 高解像度出力（Retina対応）
			});

			// ダウンロードリンクを作成してクリック
			const link = document.createElement("a");
			link.download = `ogp-${Date.now()}.png`;
			link.href = dataUrl;
			link.click();
		} catch (error) {
			console.error("画像のダウンロードに失敗しました:", error);
			alert("画像のダウンロードに失敗しました。もう一度お試しください。");
		} finally {
			setIsDownloading(false);
		}
	};

	// プレビューの最大幅を設定（画面に収まるように）
	const maxPreviewWidth = 600;
	const scale = Math.min(maxPreviewWidth / width, 1);
	const previewWidth = width * scale;
	const previewHeight = height * scale;

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-bold text-gray-900">プレビュー</h2>
				<button
					type="button"
					onClick={handleDownload}
					disabled={isDownloading}
					className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<Download className="size-4" />
					{isDownloading ? "ダウンロード中..." : "画像をダウンロード"}
				</button>
			</div>

			{/* プレビュー表示エリア */}
			<div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4">
				<div className="flex justify-center">
					{/* 縮小表示用ラッパー */}
					<div
						style={{
							width: `${previewWidth}px`,
							height: `${previewHeight}px`,
						}}
					>
						{/* 実際のOGP画像（この要素が画像に変換される） */}
						<div
							ref={previewRef}
							style={{
								width: `${width}px`,
								height: `${height}px`,
								transform: `scale(${scale})`,
								transformOrigin: "top left",
							}}
							className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100"
						>
							{/* 背景装飾 */}
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.1),transparent_50%)]" />

							{/* コンテンツエリア */}
							<div className="relative flex h-full flex-col justify-between p-16">
								{/* 記事タイトル */}
								<div className="flex-1">
									<h1
										className="text-6xl font-bold leading-tight text-gray-900"
										style={{
											wordBreak: "break-word",
											overflowWrap: "break-word",
										}}
									>
										{config.articleTitle || "記事タイトル"}
									</h1>
								</div>

								{/* 下部エリア: 著者情報とサイト名 */}
								<div className="flex items-end justify-between">
									{/* 著者情報 */}
									<div className="flex items-center gap-6">
										{/* 著者アイコン */}
										<img
											src={config.authorIconUrl || "/default_icon512.png"}
											alt={config.authorName}
											className="size-24 rounded-full border-4 border-white object-cover shadow-lg"
										/>

										{/* 著者名 */}
										<span className="text-3xl font-semibold text-gray-700">
											{config.authorName || "著者名"}
										</span>
									</div>

									{/* サイト名 */}
									<div className="text-right">
										<div className="text-4xl font-bold text-blue-600">
											{config.siteName || "サイト名"}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* サイズ情報 */}
			<div className="text-center text-sm text-gray-500">
				画像サイズ: {width} x {height}px
			</div>
		</div>
	);
}
