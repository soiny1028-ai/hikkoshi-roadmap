// ============================================
// Shared Storage Module
// localStorage と Firebase を統一APIで扱う
// ============================================
// 使い方：
//   await SharedStorage.init('checklist-key', { onUpdate: (state) => {...} });
//   await SharedStorage.set('item-1', 'done');
//   const state = SharedStorage.getAll();
//   const userId = SharedStorage.getUserId(); // 'kanan' | 'shinta' | null
// ============================================

(function() {
  const USER_KEY = 'hikkoshi-user-id';

  // ===== ユーザーID管理（localStorage） =====
  function getUserId() {
    return localStorage.getItem(USER_KEY);
  }
  function setUserId(id) {
    if (id === 'kanan' || id === 'shinta') {
      localStorage.setItem(USER_KEY, id);
    }
  }
  function clearUserId() {
    localStorage.removeItem(USER_KEY);
  }

  // ===== ストレージ実装 =====
  let _state = {};
  let _storageKey = null;
  let _firebaseRef = null;
  let _onUpdateCallback = null;
  let _suppressNextUpdate = false;
  let _useFirebase = false;

  async function init(storageKey, options = {}) {
    _storageKey = storageKey;
    _onUpdateCallback = options.onUpdate || null;

    // Firebase が使えるかチェック
    _useFirebase = !!(window.FIREBASE_READY && window.firebase && window.firebase.database);

    if (_useFirebase) {
      try {
        const db = window.firebase.database();
        const root = window.FIREBASE_ROOT || 'hikkoshi-roadmap';
        _firebaseRef = db.ref(`${root}/${storageKey}`);

        // 初回読み込み
        const snap = await _firebaseRef.once('value');
        _state = snap.val() || {};

        // localStorage にもバックアップ
        localStorage.setItem(_storageKey, JSON.stringify(_state));

        // リアルタイムリスナー
        _firebaseRef.on('value', (snap) => {
          if (_suppressNextUpdate) {
            _suppressNextUpdate = false;
            return;
          }
          _state = snap.val() || {};
          localStorage.setItem(_storageKey, JSON.stringify(_state));
          if (_onUpdateCallback) _onUpdateCallback(_state);
        });

        return _state;
      } catch (e) {
        console.warn('[SharedStorage] Firebase接続失敗、localStorageにフォールバック:', e);
        _useFirebase = false;
      }
    }

    // localStorage モード
    try {
      const raw = localStorage.getItem(_storageKey);
      _state = raw ? JSON.parse(raw) : {};
    } catch (e) {
      _state = {};
    }
    return _state;
  }

  async function set(key, value) {
    if (value === null || value === undefined) {
      delete _state[key];
    } else {
      _state[key] = value;
    }
    // localStorage にも常時保存
    try {
      localStorage.setItem(_storageKey, JSON.stringify(_state));
    } catch (e) {}
    // Firebase
    if (_useFirebase && _firebaseRef) {
      try {
        _suppressNextUpdate = true;
        await _firebaseRef.set(_state);
      } catch (e) {
        console.warn('[SharedStorage] Firebase保存失敗:', e);
      }
    }
  }

  // state全体を一括置換
  async function setAll(newState) {
    _state = { ...newState };
    try {
      localStorage.setItem(_storageKey, JSON.stringify(_state));
    } catch (e) {}
    if (_useFirebase && _firebaseRef) {
      try {
        _suppressNextUpdate = true;
        await _firebaseRef.set(_state);
      } catch (e) {
        console.warn('[SharedStorage] Firebase保存失敗:', e);
      }
    }
  }

  function getAll() {
    return _state;
  }

  function get(key) {
    return _state[key];
  }

  async function clear() {
    _state = {};
    try {
      localStorage.removeItem(_storageKey);
    } catch (e) {}
    if (_useFirebase && _firebaseRef) {
      try {
        _suppressNextUpdate = true;
        await _firebaseRef.set({});
      } catch (e) {}
    }
  }

  function isOnline() {
    return _useFirebase;
  }

  // グローバルに公開
  window.SharedStorage = {
    init,
    set,
    setAll,
    get,
    getAll,
    clear,
    isOnline,
    getUserId,
    setUserId,
    clearUserId
  };
})();
