'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),E=require('../engine');
// External worked problems: Cheema (2021), JITC 11(1), pp.118–120, cases 1–20.
// Cases are numerical facts; the independent implementation does not copy calculator source.
const cases=[
 ['C1',{husband:1,father:1,mother:1,son:1},{husband:'1/4',father:'1/6',mother:'1/6',son:'5/12'}],
 ['C2',{wives:1,ms:1,fb:1},{wives:'1/4',ms:'1/6',fb:'7/12'}],
 ['C3',{father:1,mother:1,wives:1,daughter:1},{father:'5/24',mother:'1/6',wives:'1/8',daughter:'1/2'}],
 ['C4',{father:1,daughter:1,sd:1},{father:'1/3',daughter:'1/2',sd:'1/6'}],
 ['C5',{husband:1,ms:2,fs:2},{husband:'1/3',ms:'2/9',fs:'4/9'}],
 ['C6',{wives:1,mother:1,fs:1,ps:1,ms:1},{wives:'1/5',mother:'2/15',fs:'2/5',ps:'2/15',ms:'2/15'}],
 ['C7',{father:1,mother:1,wives:1,daughter:1,sd:1},{father:'4/27',mother:'4/27',wives:'1/9',daughter:'4/9',sd:'4/27'}],
 ['C8',{father:1,son:1,pgf:1,fb:1,ms:1},{father:'1/6',son:'5/6',pgf:'0',fb:'0',ms:'0'}],
 ['C9',{wives:1,daughter:1,fs:1,fus:1},{wives:'1/8',daughter:'1/2',fs:'3/8',fus:'0'}],
 ['C10',{daughter:1,sd:1,mother:1,ps:1,fu:1},{daughter:'1/2',sd:'1/6',mother:'1/6',ps:'1/6',fu:'0'}],
 ['C11',{mgm:1,daughter:1,sd:1},{mgm:'1/5',daughter:'3/5',sd:'1/5'}],
 ['C12',{husband:1,daughter:2},{husband:'1/4',daughter:'3/4'}],
 ['C13',{husband:1,mu:1},{husband:'1/2',mu:'1/2'}],
 ['C14',{ds:1,fss:1},{ds:'1',fss:'0'}],
 ['C15',{wives:1,father:1,mother:1},{wives:'1/4',father:'1/2',mother:'1/4'}],
 ['C16',{husband:1,father:1,mother:1},{husband:'1/2',father:'1/3',mother:'1/6'}],
 ['C17',{husband:1,mother:1,pgf:1},{husband:'1/2',mother:'1/3',pgf:'1/6'}],
 ['C18',{husband:1,mother:1,ms:2,fb:2},{husband:'1/2',mother:'1/6',ms:'1/3',fb:'0'}],
 ['C19',{mother:1,fs:1,pgf:1},{mother:'1/3',fs:'0',pgf:'2/3'}],
 ['C20',{husband:1,mother:1,fs:1,pgf:1},{husband:'1/2',mother:'1/3',fs:'0',pgf:'1/6'}]
];
function check(title,heirs,expected,extra={}){test(title,()=>{const r=E.calculate({heirs,method:'hanafi',cash:'600000',...extra});assert.equal(r.status,'ok',JSON.stringify(r.messages));for(const [k,v]of Object.entries(expected))assert.equal(r.rows.find(x=>x.key===k)?.share.str(),v,k);assert.equal(r.rows.reduce((s,x)=>s.add(x.share),r.remainder).str(),'1');const cash=E.allocateMoney(r);assert.equal(cash.groups.reduce((s,x)=>s+x.total,0n),cash.minor);});}
cases.forEach(c=>check(...c));
check('C14 Hanbali Tanzil',{ds:1,fss:1},{ds:'1/2',fss:'1/2'},{method:'hanbali'});
check('C17 Abu Yusuf',{husband:1,mother:1,pgf:1},{husband:'1/2',mother:'1/6',pgf:'1/3'},{method:'yusuf'});
for(const method of ['maliki','shafii'])check('C18 Mushtarakah '+method,{husband:1,mother:1,ms:2,fb:2},{husband:'1/2',mother:'1/6',ms:'1/6',fb:'1/6'},{method});
for(const method of ['maliki','shafii','hanbali','yusuf','muhammad']){
 check('C19 Zayd '+method,{mother:1,fs:1,pgf:1},{mother:'1/3',fs:'2/9',pgf:'4/9'},{method});
 check('C20 Akdariyyah '+method,{husband:1,mother:1,fs:1,pgf:1},{husband:'1/3',mother:'2/9',fs:'4/27',pgf:'8/27'},{method});
}
// Al-Sirajiyyah: grandfather-sharing chapter, worked mu'addah example.
check('Muaddah: grandfather, full sister, two paternal sisters',{pgf:1,fs:1,ps:2},{pgf:'2/5',fs:'1/2',ps:'1/10'},{method:'shafii'});
check('Muaddah: grandfather, full sister, paternal sister',{pgf:1,fs:1,ps:1},{pgf:'1/2',fs:'1/2',ps:'0'},{method:'hanbali'});
// Al-Sirajiyyah distant-kindred chapters: contrasting Muhammad / Yusuf methods.
check('Muhammad roots: daughter of daughter’s son vs son of daughter’s daughter',{dsd:1,dds:1},{dsd:'2/3',dds:'1/3'},{method:'muhammad'});
check('Yusuf bodies: same two claimants',{dsd:1,dds:1},{dsd:'1/3',dds:'2/3'},{method:'yusuf'});
check('Hanafi: nearer daughter’s descendant',{dd:1,sdd:1},{dd:'1',sdd:'0'});
check('Hanafi: child of an inheriting descendant preferred at equal degree',{sdd:1,dds:1},{sdd:'1',dds:'0'});
check('Muhammad: siblings’ descendant example in Sirajiyyah',{fbd:1,fss:1,fsd:1,mbd:1,mss:1,msd:1,pbd:1,pss:1,psd:1},{fbd:'1/3',fss:'2/9',fsd:'1/9',mbd:'1/9',mss:'1/9',msd:'1/9',pbd:'0',pss:'0',psd:'0'});
check('Yusuf: same sibling-descendant example',{fbd:1,fss:1,fsd:1,mbd:1,mss:1,msd:1,pbd:1,pss:1,psd:1},{fbd:'1/4',fss:'1/2',fsd:'1/4',mbd:'0',mss:'0',msd:'0',pbd:'0',pss:'0',psd:'0'},{method:'yusuf'});
check('Hanafi: paternal and maternal aunts with strength priority',{fa:1,fpa:1,fma:1,ma:1,mpa:1,mma:1},{fa:'2/3',ma:'1/3',fpa:'0',fma:'0',mpa:'0',mma:'0'});
// Al-Mughni: six aunts; 15-part allocation.
check('Hanbali: six aunts',{fa:1,fpa:1,fma:1,ma:1,mpa:1,mma:1},{fa:'2/5',fpa:'2/15',fma:'2/15',ma:'1/5',mpa:'1/15',mma:'1/15'},{method:'hanbali'});
check('Tanzil: daughter’s daughter and son’s daughter’s son',{dd:1,sds:1},{dd:'3/4',sds:'1/4'},{method:'hanbali'});
check('Tanzil spouse unaffected by represented daughter',{husband:1,dd:1,fsd:1},{husband:'1/2',dd:'1/4',fsd:'1/4'},{method:'hanbali'});
check('Hanbali grandmother inherits with her son',{father:1,pgm:1},{father:'5/6',pgm:'1/6'},{method:'hanbali'});
check('Hanafi paternal grandmother blocked by father',{father:1,pgm:1},{father:'1',pgm:'0'});
check('Shafii maternal great-grandmother alongside closer paternal grandmother',{pgm:1,mmm:1},{pgm:'1/12',mmm:'1/12'},{method:'shafii'});
check('Maliki excludes paternal grandfather’s mother',{ffm:1,mmm:1},{ffm:'0',mmm:'1/6'},{method:'maliki'});
test('Tanzil unequal branches require details',()=>assert.equal(E.calculate({heirs:{ds:1,dd:2},method:'hanbali'}).status,'review'));
test('Bengali counts, exact money and debts',()=>{const r=E.calculate({heirs:{son:'২',daughter:'১'},cash:'১০০০',funeral:'100',dower:'100',debt1:'100',debt2:'100',will:'1/3'});assert.equal(r.status,'ok');assert.equal(r.estate.net.str(),'400');assert.equal(r.rows.find(x=>x.key==='son').each.str(),'2/5');});
test('Insolvency does not issue negative shares',()=>assert.equal(E.calculate({heirs:{son:1},cash:10,debt1:11}).status,'review'));
test('Conflicting spouse inputs rejected',()=>assert.equal(E.calculate({heirs:{husband:1,wives:1}}).status,'invalid'));
test('Exact customary and SI land conversion',()=>{assert.equal(E.land('1','acre').str(),'43560');assert.equal(E.converted(E.land('1','sqm'),E.F(1),'sqcm').str(),'10000');});
const S=require('../scenarios');
check('Tanzil unequal sibling-descendant branches',{fss:1,fsd:2},{fss:'1/4','fsd#1':'1/4','fsd#2':'1/2'},{method:'hanbali',branches:{fss:'FS1',fsd:'FS1,FS2'}});
check('Observed reference: wife, two sons, daughter',{wives:1,son:2,daughter:1},{wives:'1/8',son:'7/10',daughter:'7/40'});
test('Unborn explorer includes boy, girl and no-live-birth outcomes',()=>{const p=S.run({method:'hanafi',heirs:{wives:1,son:1},cash:'600000',special:{unborn:true},unbornCount:1},E);assert.equal(p.kind,'unborn');assert.equal(p.cases.length,3);const boy=p.cases[0].result;assert.equal(boy.rows.find(r=>r.key==='son').each.str(),'7/16');const girl=p.cases[1].result;assert.equal(girl.rows.find(r=>r.key==='son').share.str(),'7/12');assert.equal(girl.rows.find(r=>r.key==='daughter').share.str(),'7/24');assert.equal(p.cases[2].result.rows.find(r=>r.key==='son').share.str(),'7/8');});
test('Twins explorer has six alternatives and exact distributions',()=>{const p=S.run({method:'hanafi',heirs:{wives:1,son:1},special:{unborn:true},unbornCount:2},E);assert.equal(p.cases.length,6);p.cases.forEach(({result:r})=>assert.equal(r.rows.reduce((a,x)=>a.add(x.share),r.remainder).str(),'1'));});
test('Uncertain heir alternatives preserve the original family',()=>{const input={method:'hanafi',heirs:{son:1,daughter:1},special:{missing:true},uncertainHeir:'son',uncertainCount:1};const p=S.run(input,E);assert.equal(p.kind,'eligibility');assert.equal(p.cases[0].result.rows.find(r=>r.key==='daughter').share.str(),'1/3');assert.equal(p.cases[1].result.rows.find(r=>r.key==='daughter').share.str(),'1');assert.equal(input.heirs.son,1);});
test('Uncertain count cannot exceed the family input',()=>assert.equal(S.run({method:'hanafi',heirs:{son:1},special:{missing:true},uncertainHeir:'son',uncertainCount:2},E).result.status,'invalid'));
test('No-school selection returns six named methods',()=>{const p=S.run({method:'none',heirs:{pgf:1,fs:1}},E);assert.equal(p.cases.length,6);assert.equal(p.cases[0].result.rows.find(r=>r.key==='fs').share.str(),'0');assert.equal(p.cases[1].result.rows.find(r=>r.key==='fs').share.str(),'1/3');});
test('Adoption alone does not create an extra blood heir',()=>{const p=S.run({method:'hanafi',heirs:{son:1},special:{adopted:true}},E);assert.equal(p.result.status,'ok');assert.match(p.result.notes.join(' '),/Adoption/);assert.equal(p.result.rows.length,1);});
test('Statutory representation remains a visible review boundary',()=>assert.equal(S.run({method:'hanafi',heirs:{son:1},special:{orphan:true}},E).result.status,'review'));
