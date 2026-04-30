// ============================================
// Firebase Bootstrap
// Firebase SDK を動的にロードして初期化する
// ============================================

(function() {
  if (!window.FIREBASE_CONFIG) {
    console.warn('[FirebaseBootstrap] FIREBASE_CONFIG が見つかりません');
    return;
  }
  if (!window.FIREBASE_READY) {
    // プレースホルダのまま → Firebase 使わない
    console.info('[FirebaseBootstrap] Firebase未設定、ローカル動作');
    return;
  }

  // Firebase SDK を動的ロード（v9 compat 版）
  const SDK_VERSION = '10.7.1';
  const scripts = [
    `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-app-compat.js`,
    `https://www.gstatic.com/firebasejs/${SDK_VERSION}/firebase-database-compat.js`
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  // Promise を window に出して、各ページから await できるようにする
  window.FIREBASE_READY_PROMISE = (async () => {
    try {
      for (const src of scripts) await loadScript(src);
      window.firebase.initializeApp(window.FIREBASE_CONFIG);
      console.info('[FirebaseBootstrap] Firebase 初期化完了');
      return true;
    } catch (e) {
      console.warn('[FirebaseBootstrap] Firebase 初期化失敗:', e);
      return false;
    }
  })();
})();
