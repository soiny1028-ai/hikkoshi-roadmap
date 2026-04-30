# 引っ越しロードマップ - 共有チェックリスト

二人（しんた＆かなん）の引っ越しタスクを共有するチェックリストアプリ。
**Firebase Realtime Database** + **GitHub Pages** でリアルタイム同期。

## 📂 ファイル構成

```
hikkoshi-roadmap/
├── index.html              ← ハブページ（カウントダウン＋3章へのリンク）
├── checklist.html          ← 第一章（家事・買い出し / 二人共有）
├── checklist-ch2.html      ← 第二章 彼女篇（かなん編集 / しんた閲覧）
├── checklist-bf.html       ← 第二章 彼氏篇（しんた編集 / かなん閲覧）
├── firebase-config.js      ← 🔧 Firebase鍵を入れる場所
├── firebase-bootstrap.js   ← Firebase SDK動的読み込み
├── shared-storage.js       ← localStorage + Firebase 統一API
├── permission-helper.js    ← 権限制御＆ユーザーバナー
├── shared.css              ← 共通CSS（権限バナー）
└── README.md               ← この指示書
```

---

## 🚀 Claude Code でやってほしいこと

### Step 1: Firebase プロジェクト作成

```bash
# Firebase CLI インストール（未導入の場合）
npm install -g firebase-tools

# Firebase ログイン
firebase login
```

Firebase Console (https://console.firebase.google.com/) で：

1. **新規プロジェクト作成**
   - 推奨プロジェクト名: `hikkoshi-shinta-kanan`（推測されにくく、意味あり）
   - Google Analytics は **OFF** でOK

2. **Realtime Database を有効化**
   - 左メニュー「Build」→「Realtime Database」→「データベースを作成」
   - **ロケーション**: `asia-southeast1`（Singapore）または `us-central1`
   - **セキュリティルール**: まず「**ロックモード**」で作成

3. **セキュリティルールを設定**
   - 「ルール」タブで以下に書き換える（URL知ってる人だけ読み書きOK、二人での運用想定）：

   ```json
   {
     "rules": {
       "hikkoshi-roadmap": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

   ※将来的に第三者がURLを知った場合のリスクが気になるなら、
   Firebase Auth 匿名認証を追加する手もある（後述）。

4. **Web アプリ登録 → 設定取得**
   - プロジェクトの設定（歯車アイコン）→「全般」→ 一番下「マイアプリ」
   - 「ウェブ」アイコンをクリックして新規Webアプリ登録
   - アプリ名: `hikkoshi-roadmap` 
   - 「Firebase Hosting も設定する」は **OFF**（GitHub Pages を使うため）
   - 表示される `firebaseConfig` をコピー

### Step 2: firebase-config.js を書き換え

Firebase Console から取得した設定を `firebase-config.js` に貼り付ける。
このリポジトリの `firebase-config.js` を以下のように更新：

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...（実際の値）",
  authDomain: "hikkoshi-shinta-kanan.firebaseapp.com",
  databaseURL: "https://hikkoshi-shinta-kanan-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hikkoshi-shinta-kanan",
  storageBucket: "hikkoshi-shinta-kanan.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123"
};

window.FIREBASE_ROOT = "hikkoshi-roadmap";
window.FIREBASE_READY = !window.FIREBASE_CONFIG.apiKey.includes("PLACEHOLDER");
```

**重要**: `databaseURL` は Firebase Console の「Realtime Database」タブで確認できる正確なURLを使う。

### Step 3: GitHub リポジトリ作成 & Push

```bash
cd hikkoshi-roadmap
git init
git add .
git commit -m "Initial commit: 引っ越しロードマップ共有チェックリスト"

# GitHub に新規リポジトリ作成（CLIでも手動でも可）
# 例：gh repo create hikkoshi-roadmap --public --source=. --push
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hikkoshi-roadmap.git
git push -u origin main
```

### Step 4: GitHub Pages 有効化

1. GitHub のリポジトリページ → Settings → Pages
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` / `/ (root)`
4. Save → 数分待つと URL が発行される

URL例: `https://YOUR_USERNAME.github.io/hikkoshi-roadmap/`

### Step 5: 動作確認

1. 発行されたURLをブラウザで開く
2. ハブページで「あなたは？」モーダルが出る → どちらか選ぶ
3. 各章カードをタップ → 別タブで開く
4. チェックを入れてみる
5. 別ブラウザ（or シークレットウィンドウ）で同じURLを開いて、もう一方のユーザーで操作
6. **リアルタイムで反映されたら成功！**

ハブの右上に「**LIVE SYNC**」と緑のドットが表示されれば Firebase 同期が有効。
「**LOCAL**」のままなら Firebase 接続に失敗してる（鍵間違いか、ネットワーク or ルールの問題）。

---

## 🔧 オプション: Firebase Auth 匿名認証で安全性向上（後でやってもOK）

第三者にURLが漏れた時のリスクを減らしたい場合、匿名認証を追加できる。
セキュリティルールを以下に変更：

```json
{
  "rules": {
    "hikkoshi-roadmap": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

そして `firebase-bootstrap.js` に匿名認証コードを追加：

```javascript
// firebase-app-compat.js, firebase-database-compat.js のロード後に
await loadScript(`https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-auth-compat.js`);
window.firebase.initializeApp(window.FIREBASE_CONFIG);
await window.firebase.auth().signInAnonymously();
```

---

## 🎨 デザインについて

田園（玉置浩二）のCDジャケット風和モダンデザイン。配色：
- `--paper: #e6d8b9` （和紙色）
- `--vermilion: #a8392c` （朱色）
- `--moss-d: #3e4a26` （深緑）
- `--ink: #1a140d` （墨）

デザインシステムは大きく崩さずに使ってください。

---

## 🐛 トラブルシューティング

### ハブで「LIVE SYNC」にならない
- `firebase-config.js` の値が PLACEHOLDER のまま → 実際の値に書き換える
- ブラウザのコンソールで `Firebase 初期化失敗` エラーを確認
- Firebase Console で Realtime Database が有効になってるか確認

### チェックが同期されない
- セキュリティルールで `.read` `.write` が `true` になってるか確認
- `databaseURL` が正しいか（リージョンが `asia-southeast1` なら URLが`firebasedatabase.app`、`us-central1`なら `firebaseio.com`）

### 「あなたは？」モーダルが繰り返し出る
- localStorage が無効化されてる可能性（プライベートブラウジング等）
- 通常モードのブラウザで開いてもらう

---

## 👥 二人での運用

1. **かなん** はハブで「かなん」を選択 → 第二章彼女篇のチェックを進める
2. **しんた** はハブで「しんた」を選択 → 彼氏篇のチェックを進める
3. **第一章** は両者編集可（買い出しや家事の進捗を共有）
4. お互いの進捗はリアルタイムで反映される

ハブのカウントダウン（D-12 / D-23）が引越しの目安。
チェックリストを開くたびに残り日数が分かる。
