const copy=document.getElementById('copy-link');
copy.addEventListener('click',async()=>{const url=document.querySelector('link[rel="canonical"]').href;try{await navigator.clipboard.writeText(url);copy.textContent='Link copied ✓';document.getElementById('copy-status').textContent='Article link copied.';}catch{document.getElementById('copy-status').textContent='Please copy the article address from your browser.';copy.textContent='Copy address from browser';}});
document.getElementById('print-guide').addEventListener('click',()=>window.print());
const words=document.querySelector('.prose').textContent.trim().split(/\s+/).length;
document.getElementById('reading-time').textContent=Math.ceil(words/220)+' min read';
