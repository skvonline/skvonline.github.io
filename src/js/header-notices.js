(function () {
  function parseVisibilityTimestamp(value) {
    if (!value || typeof value !== 'string') return null;
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})-(\d{2}):(\d{2})$/);
    if (!match) return null;
    const [, year, month, day, hour, minute] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  }
  function formatNoticeCountdown(targetDate, now = new Date()) {
    const diffMs = targetDate.getTime() - now.getTime(); if (diffMs <= 0) return null;
    const s=Math.floor(diffMs/1000),m=Math.floor(s/60),h=Math.floor(m/60),d=Math.floor(h/24),pad=(v)=>String(v).padStart(2,'0');
    return d>=1?`${d} T ${pad(h%24)} Std ${pad(m%60)} Min`:`${pad(h)} Std ${pad(m%60)} Min ${pad(s%60)} Sek`;
  }
  window.SKV = window.SKV || {}; window.SKV.headerNotices = { parseVisibilityTimestamp, formatNoticeCountdown };
})();
