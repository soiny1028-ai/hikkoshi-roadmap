// ============================================
// Permission Helper for Checklist Pages
// 各章ファイルが、自分のユーザーIDと「編集できるか」を判断するヘルパー
// ============================================
//
// 使い方：
//   PermissionHelper.init({ owner: 'kanan' | 'shinta' | 'both', label: '彼女篇' });
//   if (PermissionHelper.canEdit()) { ... }
// ============================================

(function() {
  let _owner = 'both';
  let _label = '';
  let _bannerEl = null;

  function init(config) {
    _owner = config.owner || 'both';
    _label = config.label || '';
    renderBanner();
  }

  function getCurrentUser() {
    return localStorage.getItem('hikkoshi-user-id');
  }

  function canEdit() {
    if (_owner === 'both') return true;
    const me = getCurrentUser();
    return me === _owner;
  }

  function renderBanner() {
    const me = getCurrentUser();
    // バナーを表示する場所を確保（body直下に挿入）
    if (_bannerEl && _bannerEl.parentNode) {
      _bannerEl.parentNode.removeChild(_bannerEl);
    }
    _bannerEl = document.createElement('div');
    _bannerEl.className = 'perm-banner';

    const userLabel = me === 'kanan' ? 'かなん' : me === 'shinta' ? 'しんた' : '未選択';
    const userClass = me === 'kanan' ? 'kanan' : me === 'shinta' ? 'shinta' : '';

    if (!me) {
      // ユーザー未選択
      _bannerEl.innerHTML = `
        <span class="perm-label">⚠️ 未選択</span>
        <span class="perm-msg">ハブに戻ってユーザーを選択してください</span>
        <a class="perm-link" href="index.html">ハブへ</a>
      `;
      _bannerEl.classList.add('warn');
    } else if (canEdit()) {
      // 編集可能
      _bannerEl.innerHTML = `
        <span class="perm-label ${userClass}">${userLabel}</span>
        <span class="perm-msg">編集モード</span>
        <span class="perm-sync" id="permSync"><span class="dot"></span><span id="permSyncText">LOCAL</span></span>
        <a class="perm-link" href="index.html">ハブ</a>
      `;
      _bannerEl.classList.add('editable');
    } else {
      // 閲覧のみ
      _bannerEl.innerHTML = `
        <span class="perm-label ${userClass}">${userLabel}</span>
        <span class="perm-msg">👁 閲覧モード（${_label}は相手のタスク）</span>
        <span class="perm-sync" id="permSync"><span class="dot"></span><span id="permSyncText">LOCAL</span></span>
        <a class="perm-link" href="index.html">ハブ</a>
      `;
      _bannerEl.classList.add('readonly');
    }

    // bodyの先頭に挿入
    document.body.insertBefore(_bannerEl, document.body.firstChild);

    // 同期インジケーター更新
    updateSyncIndicator();
  }

  function updateSyncIndicator() {
    const sync = document.getElementById('permSync');
    const syncText = document.getElementById('permSyncText');
    if (!sync) return;
    if (window.FIREBASE_READY && window.firebase) {
      sync.classList.add('online');
      syncText.textContent = 'LIVE';
    } else {
      sync.classList.remove('online');
      syncText.textContent = 'LOCAL';
    }
  }

  // 全体を読み取り専用に（バナー以外のクリックを無効化）
  function applyReadonly() {
    if (canEdit()) {
      document.body.classList.remove('readonly-mode');
      return;
    }
    document.body.classList.add('readonly-mode');
  }

  window.PermissionHelper = {
    init,
    canEdit,
    getCurrentUser,
    applyReadonly,
    updateSyncIndicator
  };
})();
