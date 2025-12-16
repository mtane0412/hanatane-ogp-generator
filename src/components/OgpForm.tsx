/**
 * OGP設定入力フォームコンポーネント
 *
 * ユーザーがサイト名、記事タイトル、著者名、著者アイコン、画像サイズを入力するためのフォーム。
 */

import { Upload } from "lucide-react";
import { useId, useRef } from "react";
import type { OgpConfig, OgpSizePreset } from "@/types/ogp";
import { OGP_SIZE_PRESETS } from "@/types/ogp";

interface OgpFormProps {
	/** 現在のOGP設定 */
	config: OgpConfig;
	/** 設定変更時のコールバック */
	onChange: (config: OgpConfig) => void;
}

/**
 * OGP設定入力フォームコンポーネント
 *
 * @param props - コンポーネントのプロパティ
 */
export default function OgpForm({ config, onChange }: OgpFormProps) {
	// ユニークなIDを生成（複数のフォームが存在する場合のID衝突を防ぐ）
	const siteNameId = useId();
	const articleTitleId = useId();
	const authorNameId = useId();
	const authorIconId = useId();
	const sizePresetId = useId();

	// ファイル入力のref（プログラムから開くため）
	const fileInputRef = useRef<HTMLInputElement>(null);

	/**
	 * テキスト入力フィールドの変更ハンドラ
	 */
	const handleTextChange =
		(field: keyof OgpConfig) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			onChange({ ...config, [field]: e.target.value });
		};

	/**
	 * サイズプリセット選択の変更ハンドラ
	 */
	const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedSize = e.target.value as OgpSizePreset;
		onChange({ ...config, selectedSize });
	};


	/**
	 * ファイル選択ボタンのクリックハンドラ
	 */
	const handleFileButtonClick = () => {
		fileInputRef.current?.click();
	};

	/**
	 * 著者アイコンファイルの選択ハンドラ
	 */
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// ファイルをDataURLとして読み込む
		const reader = new FileReader();
		reader.onload = (event) => {
			const dataUrl = event.target?.result as string;
			onChange({ ...config, authorIconUrl: dataUrl });
		};
		reader.readAsDataURL(file);
	};

	return (
		<div className="space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<h2 className="text-xl font-bold text-gray-900">OGP設定</h2>

			{/* サイト名 */}
			<div>
				<label
					htmlFor={siteNameId}
					className="mb-2 block text-sm font-medium text-gray-700"
				>
					サイト名
				</label>
				<input
					id={siteNameId}
					type="text"
					value={config.siteName}
					onChange={handleTextChange("siteName")}
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="サイト名"
				/>
			</div>

			{/* 記事タイトル */}
			<div>
				<label
					htmlFor={articleTitleId}
					className="mb-2 block text-sm font-medium text-gray-700"
				>
					記事タイトル
				</label>
				<textarea
					id={articleTitleId}
					value={config.articleTitle}
					onChange={handleTextChange("articleTitle")}
					rows={3}
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="例: metaタグ、OGP設定"
				/>
			</div>

			{/* 著者名 */}
			<div>
				<label
					htmlFor={authorNameId}
					className="mb-2 block text-sm font-medium text-gray-700"
				>
					著者名
				</label>
				<input
					id={authorNameId}
					type="text"
					value={config.authorName}
					onChange={handleTextChange("authorName")}
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="例: saya"
				/>
			</div>

			{/* 著者アイコン */}
			<div>
				<label
					htmlFor={authorIconId}
					className="mb-2 block text-sm font-medium text-gray-700"
				>
					著者アイコン
				</label>
				<div className="flex items-center gap-4">
					{/* アイコンプレビュー */}
					{config.authorIconUrl && (
						<img
							src={config.authorIconUrl}
							alt="著者アイコン"
							className="size-16 rounded-full border-2 border-gray-200 object-cover"
						/>
					)}

					{/* ファイル選択ボタン */}
					<button
						type="button"
						onClick={handleFileButtonClick}
						className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
					>
						<Upload className="size-4" />
						ファイルを選択
					</button>

					{/* 非表示のファイル入力 */}
					<input
						id={authorIconId}
						ref={fileInputRef}
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="hidden"
					/>
				</div>
			</div>

			{/* 画像サイズ選択 */}
			<div>
				<label
					htmlFor={sizePresetId}
					className="mb-2 block text-sm font-medium text-gray-700"
				>
					画像サイズ
				</label>
				<select
					id={sizePresetId}
					value={config.selectedSize}
					onChange={handleSizeChange}
					className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					{Object.entries(OGP_SIZE_PRESETS).map(([key, preset]) => (
						<option key={key} value={preset.preset}>
							{preset.label}
						</option>
					))}
				</select>
			</div>
		</div>
	);
}
