# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

このプロジェクトは、TanStack Start（React Router + SSR）とCloudflare Workersを組み合わせたフルスタックReactアプリケーションです。

## 開発コマンド

### 基本コマンド
```bash
npm run dev          # 開発サーバー起動（ポート3000）
npm run build        # プロダクションビルド
npm run preview      # プロダクションビルドのプレビュー
npm run deploy       # Cloudflare Workersへデプロイ
```

### テスト・品質管理
```bash
npm run test         # Vitestでテスト実行
npm run lint         # Biomeでリント実行
npm run format       # Biomeでフォーマット実行
npm run check        # Biomeでリント+フォーマットチェック
```

### 単一テストの実行
```bash
npx vitest run <test-file-name>
```

## アーキテクチャ

### ルーティングシステム（TanStack Router）

**ファイルベースルーティング**を採用しています。ルートファイルは `src/routes/` ディレクトリに配置され、TanStack Routerが自動的に `src/routeTree.gen.ts` を生成します。

- ルートレイアウト: `src/routes/__root.tsx` - すべてのルートに共通のレイアウト（Header、devtools、Scripts）を定義
- ルート定義: `src/router.tsx` - ルーターインスタンスを作成する `getRouter()` 関数をエクスポート
- ルート追加方法: `src/routes/` に新規ファイルを作成すると自動的にルートとして認識される

### SSRとレンダリングモード

TanStack Startは複数のレンダリングモードをサポートしています：
- **Full SSR**: サーバーサイドでHTMLを完全にレンダリング
- **Data-only SSR**: データのみをサーバーで取得し、クライアントでレンダリング
- **SPA mode**: 完全にクライアントサイドでレンダリング

デモファイル（`src/routes/demo/start.ssr.*`）に各モードの実装例があります。

### デプロイターゲット（Cloudflare Workers）

- デプロイ設定: `wrangler.jsonc` - Cloudflare Workers向けの設定
- Viteプラグイン: `@cloudflare/vite-plugin` を使用してSSR環境を構築
- エントリーポイント: `@tanstack/react-start/server-entry` がサーバーエントリーポイントとして自動的に使用される

### パスエイリアス

`tsconfig.json` で `@/*` を `./src/*` にマッピングしています。インポート時は以下のように使用します：
```tsx
import Header from '@/components/Header'
```

## コーディング規約

### Biome設定（biome.json）

- **インデント**: タブ（`indentStyle: "tab"`）
- **クォート**: ダブルクォート（`quoteStyle: "double"`）
- **対象ファイル**: `src/**/*`、`.vscode/**/*`、`index.html`、`vite.config.js`
- **除外ファイル**: `src/routeTree.gen.ts`（自動生成）、`src/styles.css`

### コード修正時の必須手順

1. コード変更後は必ず `npm run lint` を実行してエラー・警告をクリアする
2. テストが存在する場合は `npm test` を実行して全テストがパスすることを確認する

## デモファイルについて

`demo` プレフィックスが付いたファイル（`src/routes/demo/*`、`src/data/demo.punk-songs.ts`）は、学習用のサンプルファイルです。削除しても問題ありません。

## スタイリング

Tailwind CSS v4を使用しています。Viteプラグイン（`@tailwindcss/vite`）によってビルド時に自動的に処理されます。
