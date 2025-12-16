/**
 * OGP画像作成アプリケーションの型定義
 *
 * このファイルはOGP画像生成に必要なデータ構造を定義します。
 */

/**
 * OGP画像のサイズプリセット
 *
 * - standard: 標準サイズ（1200x630px）
 * - wide: ワイドサイズ（1200x675px、16:9比率）
 */
export type OgpSizePreset = "standard" | "wide";

/**
 * OGP画像のサイズ定義
 */
export interface OgpSize {
	/** サイズプリセット */
	preset: OgpSizePreset;
	/** 幅（ピクセル） */
	width: number;
	/** 高さ（ピクセル） */
	height: number;
	/** 表示用ラベル */
	label: string;
}

/**
 * OGP画像の設定データ
 */
export interface OgpConfig {
	/** サイト名 */
	siteName: string;
	/** 記事タイトル */
	articleTitle: string;
	/** 著者名 */
	authorName: string;
	/** 著者アイコンのURL（DataURLまたはHTTP URL） */
	authorIconUrl: string;
	/** 選択されたサイズプリセット */
	selectedSize: OgpSizePreset;
}

/**
 * サイズプリセットの定義リスト
 */
export const OGP_SIZE_PRESETS: Record<OgpSizePreset, OgpSize> = {
	standard: {
		preset: "standard",
		width: 1200,
		height: 630,
		label: "標準サイズ (1200x630)",
	},
	wide: {
		preset: "wide",
		width: 1200,
		height: 675,
		label: "ワイドサイズ (1200x675 / 16:9)",
	},
};

/**
 * OgpConfigから実際の画像サイズを取得する
 *
 * @param config OGP設定データ
 * @returns 画像の幅と高さ
 */
export function getOgpSize(config: OgpConfig): { width: number; height: number } {
	const preset = OGP_SIZE_PRESETS[config.selectedSize];
	return { width: preset.width, height: preset.height };
}
