// ============================================
// Firebase Configuration
// ============================================
// このファイルの値は Claude Code が Firebase プロジェクトを作成した後に
// 自動で書き換えます。今のプレースホルダのままでも、ローカルストレージで
// 動作します（同期はされません）。
// ============================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCerqYPPretyXVACAp6iTUbx5k10RNZRA8",
  authDomain: "hikkoshi-shinta-kanan-ed53e.firebaseapp.com",
  databaseURL: "https://hikkoshi-shinta-kanan-ed53e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hikkoshi-shinta-kanan-ed53e",
  storageBucket: "hikkoshi-shinta-kanan-ed53e.firebasestorage.app",
  messagingSenderId: "813727844084",
  appId: "1:813727844084:web:a650850c667a95f1c1c0a1"
};

// プロジェクトのルートパス（複数プロジェクトを混在させない場合は変更不要）
window.FIREBASE_ROOT = "hikkoshi-roadmap";

// プレースホルダのままかどうかを判定
window.FIREBASE_READY = !window.FIREBASE_CONFIG.apiKey.includes("PLACEHOLDER");
