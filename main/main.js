/** スクロール量の差分を取得し、その差分を回転角度に変換して画像を更新する。
 (ユーザー体験のため、スクロール連動のアニメーションをCSSではなくJSで制御)*/
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('[class^="img-"] img');
  if (images.length === 0) return;
  let lastY = window.scrollY;
  const baseRotations = Array.from(images).map(img => {
    const style = window.getComputedStyle(img);
    const transform = style.transform;

    if (transform === "none") return 0;

    const values = transform.match(/matrix\(([^)]+)\)/)[1].split(", ");
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    return angle;
  });

  const currentRotations = [...baseRotations];

  window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    const delta = currentY - lastY;
    lastY = currentY;

    images.forEach((img, i) => {
      currentRotations[i] += delta * 0.5;
      img.style.transform = `rotate(${currentRotations[i]}deg)`;
    });
  }, { passive: true });
});
/** 多言語切り替えロジック
 ページ遷移やリロードをせず、DOM操作でテキストを動的に書き換えることで、
 ユーザー体験（UX）を向上させる設計とした。
 翻訳データはHTMLのdata属性に格納し、JS側で一元管理。*/
function changeLanguage(lang) {
    const elements = document.querySelectorAll('.js-translatable');
    const dataAttribute = `data-${lang}`;
    
    elements.forEach(element => {
        const newText = element.getAttribute(dataAttribute);
        
        if (newText !== null) {
            const finalHtml = (newText || '').replace(/\\n/g, '<br>');
            element.innerHTML = finalHtml; 
        }
    });

    const buttons = document.querySelectorAll('.language-btn button');
    
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const btnLang = btn.getAttribute('data-lang'); 
        if (btnLang === lang) {
            btn.classList.add('active');
        }
    });
}

// ページ読み込み時の処理: 保存された言語を読み込んで適用する (デフォルトは日本語)
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem('selectedLanguage');
    
    const initialLang = savedLang || 'ja'; 
    
    changeLanguage(initialLang);
});

document.addEventListener("DOMContentLoaded", () => {
    const languageButtons = document.querySelectorAll('.language-btn button');
    
    languageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            
            changeLanguage(lang);
            
            localStorage.setItem('selectedLanguage', lang);
        });
    });
});