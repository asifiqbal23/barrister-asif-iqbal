'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine'),BD=require('../bangladesh'),S=require('../scenarios'),REF=require('../references');
const branch=(parent,boys,girls)=>({parent,boys,girls});
function calc(heirs,branches,extra={}){return BD.calculate({method:'hanafi',radd:'auto',cash:'120000',heirs,bd:{orphans:branches.length?'yes':'no',era:'after',branches},...extra},E);}
const shares=r=>Object.fromEntries(r.rows.map(x=>[x.key,x.share.str()]));
function conserved(r){assert.equal(r.status,'ok',JSON.stringify(r.messages));assert.equal(r.rows.reduce((a,x)=>a.add(x.share),r.remainder).str(),'1');const m=E.allocateMoney(r);assert.equal(m.groups.reduce((a,x)=>a+x.total,0n),m.minor);}
test('s4: surviving son and one predeceased-son branch divide by parent, not grandchildren',()=>{
 const r=calc({son:1},[branch('son',2,1)]);conserved(r);assert.deepEqual(shares(r),{son:'1/2','bd-branch-1':'1/2'});const b=r.rows[1];assert.equal(b.beneficiaryCount,3);assert.equal(b.each,null);assert.equal(b.collective,true);
});
test('two predeceased sons with unequal family sizes get equal branch totals',()=>{
 const r=calc({},[branch('son',3,0),branch('son',1,0)]);conserved(r);assert.deepEqual(shares(r),{'bd-branch-1':'1/2','bd-branch-2':'1/2'});assert.equal(r.rows[1].each.str(),'1/2');
});
test('predeceased daughter is represented alongside a living son',()=>{
 const r=calc({son:1},[branch('daughter',0,1)]);conserved(r);assert.deepEqual(shares(r),{son:'2/3','bd-branch-1':'1/3'});
});
test('living daughter and sole daughter of a predeceased son',()=>{
 const r=calc({daughter:1},[branch('son',0,1)]);conserved(r);assert.deepEqual(shares(r),{daughter:'1/3','bd-branch-1':'2/3'});
});
test('multiple son and daughter branches conserve individual living-child entitlements',()=>{
 const r=calc({son:2,daughter:1},[branch('son',1,1),branch('daughter',2,0)]);conserved(r);assert.deepEqual(shares(r),{son:'1/2',daughter:'1/8','bd-branch-1':'1/4','bd-branch-2':'1/8'});assert.equal(r.rows.find(x=>x.key==='son').each.str(),'1/4');
});
test('represented child changes wife and parent shares',()=>{
 const r=calc({wives:1,mother:1,father:1},[branch('son',1,1)]);conserved(r);assert.deepEqual(shares(r),{father:'1/6',mother:'1/6',wives:'1/8','bd-branch-1':'13/24'});
});
test('awl applies to notional daughters then passes adjusted shares to branches',()=>{
 const r=calc({husband:1,mother:1,father:1},[branch('daughter',1,0),branch('daughter',0,1)],{sex:'female'});conserved(r);assert.equal(r.awl,true);assert.deepEqual(shares(r),{father:'2/15',mother:'2/15',husband:'1/5','bd-branch-1':'4/15','bd-branch-2':'4/15'});
});
test('radd and husband are handled in same notional family',()=>{
 const r=calc({husband:1},[branch('daughter',0,1)],{sex:'female'});conserved(r);assert.deepEqual(shares(r),{husband:'1/4','bd-branch-1':'3/4'});
});
test('estate debts/dower and bequest are deducted once before statutory allocation',()=>{
 const r=calc({wives:1,son:1},[branch('son',1,1)],{cash:'100000',dower:'10000',otherDebt:'10000',funeral:'5000',will:'1/3'});conserved(r);assert.equal(r.estate.net.str(),'50000');assert.equal(shares(r)['bd-branch-1'],'7/16');assert.ok(r.legalRefs.includes('bdDower'));
});
test('small money and land preserve branch rather than inventing per-person shares',()=>{
 const r=calc({son:1},[branch('son',1,1)],{cash:'0.01'});conserved(r);const b=r.rows.find(x=>x.collective);assert.equal(E.converted(E.land('12','decimal'),b.share,'decimal').str(),'6');assert.equal(b.each,null);
});
test('ordinary Bangladesh case has no s4 override',()=>{
 const r=calc({wives:1,son:2,daughter:1},[]);conserved(r);assert.equal(r.section4,undefined);assert.deepEqual(shares(r),shares(E.calculate({heirs:{wives:1,son:2,daughter:1},method:'hanafi'})));
});
test('duplicate grandchild entries, deeper descendants and empty branches do not allocate',()=>{
 for(const h of [{son:1,ss:1},{son:1,dd:1},{sss:1}])assert.equal(calc(h,[branch('son',1,0)]).status,'review');
 assert.equal(calc({son:1},[branch('son',0,0)]).status,'review');
 assert.equal(calc({son:1},[branch('husband',1,0)]).status,'review');
});
test('requires explicit s4 answer, timing and coherent branch data',()=>{
 for(const bd of [{},{orphans:'unknown'},{orphans:'yes',era:'earlier',branches:[branch('son',1,0)]},{orphans:'yes',era:'after',branches:[]},{orphans:'no',branches:[branch('son',1,0)]}])assert.equal(calc({son:1},[],{bd}).status,'review');
});
test('Bangla numerals and malformed counts are handled before arithmetic',()=>{
 conserved(calc({son:'১'},[branch('daughter','১','২')]));
 for(const v of ['-1','1.5','abc','100'])assert.notEqual(calc({son:1},[branch('son',v,0)]).status,'ok');
});
test('specific legal gates return the relevant Bangladesh source',()=>{
 for(const [extra,ref] of [[{bd:{orphans:'no',divorce:true}},'bdDivorce'],[{bd:{orphans:'no',specialAssets:true}},'bdFund'],[{special:{missing:true}},'bdMissing'],[{special:{willHeir:true}},'bdWills']]){const r=calc({son:1},[],extra);assert.equal(r.status,'review');assert.ok(r.refs.includes(ref));}
});
test('unknown, non-Hanafi and radd override assumptions are not labelled Bangladesh',()=>{
 for(const extra of [{method:'none'},{method:'maliki'},{radd:'include'}])assert.equal(calc({son:1},[],extra).status,'review');
});
test('scenario entry point cannot bypass Bangladesh gates',()=>{
 const r=S.run({jurisdiction:'bangladesh',method:'hanafi',heirs:{son:1},bd:{orphans:'no'},special:{missing:true}},E);assert.equal(r.kind,'ordinary');assert.equal(r.result.status,'review');assert.ok(r.result.refs.includes('bdMissing'));
});
test('statutory row cites both parent-share principle and statute',()=>{
 const r=calc({son:1},[branch('daughter',1,1)]),ids=REF.forRow(r.rows.find(x=>x.collective),r);assert.ok(ids.includes('q411'));assert.ok(ids.includes('bd'));assert.ok(ids.includes('bdOverride'));assert.ok(ids.includes('bdGuide'));for(const id of r.legalRefs)assert.ok(REF.sources[id]?.url);
});
test('bounded family matrix conserves share totals and monetary rounding',()=>{
 for(let sons=0;sons<3;sons++)for(let daughters=0;daughters<3;daughters++)for(const parent of ['son','daughter'])for(const withParents of [false,true]){const r=calc({son:sons,daughter:daughters,wives:1,...(withParents?{father:1,mother:1}:{})},[branch(parent,2,1)],{cash:'1000.01'});conserved(r);assert.ok(r.rows.every(x=>x.share.cmp(0)>=0));assert.equal(r.rows.filter(x=>x.collective).length,1);}
});
