# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Storycapture は Storybook v10 のスクリーンショット撮影アドオン。Puppeteer を使用してストーリーのスクリーンショットを自動生成し、ビジュアルリグレッションテストに利用する。

## プロジェクト構成

### モノレポ構造

- Lerna + Yarn workspaces を使用したモノレポ
- メインパッケージ: `packages/storycapture`
- サンプル実装: `examples/` ディレクトリ配下
  - `v10-simple-react`: シンプルモード例 (Storybook v10 用)
  - `v10-managed-react`: マネージドモード例 (Storybook v10 用)
  - `v10-managed-vite5-react`: Vite5 使用のマネージドモード例 (Storybook v10 用)

### ビルド出力

- ES Modules (ESM-only): `lib-esm/` (Storybook 10 は ESM-only のため)
- 型定義: `lib-esm/index.d.ts`

## コマンド

### ビルド関連

```bash
# ルートでの全パッケージビルド (ドキュメント生成とファイルコピー含む)
yarn build

# 個別パッケージのビルド (packages/storycapture で実行)
yarn build          # ESM ビルド
yarn build:esm      # ES Modules

# クリーンビルド
yarn clean
yarn build
```

### テスト関連

```bash
# 全パッケージのユニットテスト
yarn test

# packages/storycapture での Jest テスト実行
cd packages/storycapture && yarn test

# E2E テスト
yarn e2e

# ビジュアルリグレッションテスト
yarn regression
```

### リント・フォーマット

```bash
# フォーマット実行
yarn format

# フォーマットチェックのみ
yarn format:check

# ESLint 実行
yarn lint
```

### ドキュメント生成

```bash
# CLI ヘルプとTOC を README に反映
yarn doc

# TypeDoc ビルド
yarn typedoc:build
```

### 開発用

```bash
# ローカルリンク (開発時に他プロジェクトから参照する場合)
yarn linkall
yarn unlinkall

# Bootstrap (初回セットアップ時)
yarn bootstrap
```

## アーキテクチャ

### 動作モード

1. **Simple Mode**: Storybook の設定変更不要。URL を指定するだけでスクリーンショット撮影
2. **Managed Mode**: `withScreenshot` デコレーターで撮影タイミングやオプションを細かく制御

### コード構成

#### Node 側 (`src/node/`)

- `cli.ts`: CLI エントリーポイント
- `main.ts`: メイン処理。`bootCapturingBrowserAsWorkers` で並列ブラウザ起動、`detectRunMode` でモード判定
- `screenshot-service.ts`: `ScreenshotService` インターフェース定義。スクリーンショット撮影の実装
- `capturing-browser.ts`: Puppeteer ブラウザ制御
- `file.ts`: ファイル出力処理
- `shard-utilities.ts`: 複数マシンでの並列実行時のシャーディング

#### クライアント側 (`src/client/`)

- `with-screenshot.ts`: Storybook デコレーター `withScreenshot` の実装
- `register.ts`: Storybook アドオン登録
- `trigger-screenshot.ts`: ブラウザ内でスクリーンショット撮影をトリガー
- `is-screenshot.ts`: Storycapture 実行中かを判定する `isScreenshot()` 関数

#### 共有 (`src/shared/`)

- `types.ts`: `ScreenshotOptions` など共通型定義
- `screenshot-options-helper.ts`: オプション処理のユーティリティ

### 撮影フロー

1. CLI から `main()` を実行
2. `storycrawler` で Storybook のストーリー一覧を取得
3. `bootCapturingBrowserAsWorkers` で指定数の Puppeteer ブラウザをワーカーとして起動
4. 各ワーカーがストーリーを並列処理
5. `ScreenshotService` が各ストーリーの撮影オプション (`delay`, `waitAssets`, `viewport`, `variants` など) に従ってスクリーンショット撮影
6. 画像を `outDir` (デフォルト: `__screenshots__`) に保存

### 重要な概念

- **Variants**: 1 つのストーリーから複数のスクリーンショットを生成 (ホバー状態、異なるビューポートなど)
- **Viewports**: デバイス名 (例: `"iPhone 5"`) またはカスタム幅・高さで指定
- **Sharding**: `--shard 1/3` のように指定して複数マシンで並列実行

## TypeScript 設定

- Target: ES2019
- Module: ESNext (ESM ビルド)
- Strict mode 有効
- `baseUrl`: `./packages`
- 出力先は `tsconfig.build.esm.json` で管理

## コーディング規約

### ESLint ルール (`.eslintrc.yml`)

- `no-console: error` (Node 側では logger を使用)
- `no-var: error`, `prefer-const: error`
- `object-curly-spacing: [error, always]`
- `@typescript-eslint/no-use-before-define: error`

### Prettier 設定

- `printWidth: 120`
- `tabWidth: 2`
- `singleQuote: true`
- `trailingComma: all`
- `arrowParens: avoid`

### スタイルガイド

- コメントや日本語文章は全角と半角の間にスペースを入れる
- テキストファイル末尾は POSIX 準拠で改行文字を入れる
- コミットメッセージは日本語推奨
- `interface` ではなく `type` を使用
- `class`, `function` ではなく `const` で関数定義
- default export ではなく named export を使用

## 依存関係

- **puppeteer-core**: Chromium 制御 (ユーザーは任意で puppeteer もインストール可能)
- **storycrawler**: Storybook のストーリー一覧取得
- **nanomatch**: ストーリー名フィルタリング
- **mkdirp**, **rimraf**: ファイル操作
- **yargs**: CLI 引数パース

## テスト戦略

- Jest でユニットテスト (`*.test.ts`)
- E2E テストは `e2e.sh` スクリプトで実行
- ビジュアルリグレッションテストは reg-suit で管理

## 注意点

- Node 24 以降が必要
- Storybook v10 専用 (v9 以前のサポートは version 9.0.0 を使用)
- Storybook v10 は ESM-only のため、このパッケージも ESM-only で提供
- Chromium の探索順序: Puppeteer → Canary → Stable (CLI オプションで変更可能)
