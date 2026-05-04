(function () {
  function setupBoardCards() {
    const boardCards = Array.from(document.querySelectorAll('.board-card')); if (boardCards.length===0) return;
    const isMobile=()=>window.matchMedia('(max-width: 960px)').matches;
    const closeAll=()=>boardCards.forEach((card)=>{card.classList.remove('is-open'); const t=card.querySelector('.board-poster'); if(t)t.setAttribute('aria-expanded','false');});
    boardCards.forEach((card)=>{ const t=card.querySelector('.board-poster'); if(!t)return; t.addEventListener('click',(e)=>{ if(!isMobile())return; e.preventDefault(); const isOpen=card.classList.contains('is-open'); closeAll(); card.classList.toggle('is-open',!isOpen); t.setAttribute('aria-expanded',String(!isOpen));});});
    document.addEventListener('click',(e)=>{ if(!isMobile()||e.target.closest('.board-card')) return; closeAll(); });
    window.addEventListener('resize',()=>{ if(!isMobile()) closeAll(); });
  }
  window.SKV=window.SKV||{}; window.SKV.vorstand={ setupBoardCards };
})();
