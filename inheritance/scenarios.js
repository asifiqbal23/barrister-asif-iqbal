/* Conditional scenarios are illustrations, never determinations of disputed eligibility. */
(function(root){
'use strict';
function run(input,E){
 const base=JSON.parse(JSON.stringify(input)),flags=Object.keys(base.special||{}).filter(k=>base.special[k]);
 const clone=()=>JSON.parse(JSON.stringify(base));
 if(input.method==='none')return {kind:'schools',title:'Comparison of juristic methods',explanation:'No single “no-school” result is asserted. Each column applies the method named above it.',refs:['siraj','mughni'],cases:['hanafi','maliki','shafii','hanbali','yusuf','muhammad'].map(method=>{const i=clone();i.method=method;return {label:method,input:i,result:E.calculate(i)};})};
 const plainFlags=flags.filter(k=>!['adopted','foster'].includes(k));
 base.special={...base.special,adopted:false,foster:false};
 if(!plainFlags.length){const result=E.calculate(base);if(result.status==='ok'&&flags.length)result.notes.push('Adoption or fosterage alone does not create a blood-heir share. Unrelated adopted/foster family members are not added to the heir counts. An independently established blood relationship or valid bequest is considered separately.');return {kind:'ordinary',result,input:base,refs:flags.length?['adoption']:[]};}
 if(plainFlags.length===1&&plainFlags[0]==='unborn'){
  const max=Number(E.normalise(input.unbornCount||1));if(!Number.isInteger(max)||max<1||max>4)return {kind:'ordinary',result:{status:'invalid',messages:['Enter a maximum of 1–4 unborn children for the scenario explorer.']}};
  const cases=[];
  for(let live=max;live>=0;live--)for(let boys=live;boys>=0;boys--){const i=clone();i.special={};i.heirs.son=Number(E.normalise(i.heirs.son||0))+boys;i.heirs.daughter=Number(E.normalise(i.heirs.daughter||0))+live-boys;cases.push({label:live?`${boys} boy(s), ${live-boys} girl(s) born alive`:'No child survives birth',input:i,result:E.calculate(i),newChildren:{boys,girls:live-boys}});}
  return {kind:'unborn',title:'Unborn-child scenarios — provisional',explanation:`These are alternative illustrations for up to ${max} child(ren), assuming the pregnancy qualifies for inheritance. They do not establish live birth, parentage, gestation or a legally sufficient reserve. Do not distribute the estate from one assumed outcome.`,refs:['unborn','siraj','mughni'],cases};
 }
 const uncertain=['missing','prisoner','religion','parentage','homicide'];
 if(plainFlags.every(k=>uncertain.includes(k))){
  const key=input.uncertainHeir,count=Number(E.normalise(input.uncertainCount||1));
  if(!E.KEYS.includes(key)||!Number.isInteger(count)||count<1||count>Number(E.normalise(input.heirs[key]||0)))return {kind:'ordinary',result:{status:'invalid',messages:['Select the uncertain relative and a count no greater than that entered under surviving relatives. Count the questioned person in the family above.']}};
  const yes=clone(),no=clone();yes.special={};no.special={};no.heirs[key]=Number(E.normalise(no.heirs[key]))-count;
  return {kind:'eligibility',title:'Alternative eligibility scenarios',explanation:'The tool does not decide survival, parentage, religion or homicide-related eligibility. These two calculations show the consequences of including or excluding the identified person(s). A competent adviser must establish which facts and legal rule apply.',refs:['siraj','mughni',...(plainFlags.includes('religion')?['religion']:[]),...(plainFlags.includes('homicide')?['homicide']:[])],cases:[{label:'Included as eligible',input:yes,result:E.calculate(yes)},{label:'Excluded from this estate',input:no,result:E.calculate(no)}]};
 }
 return {kind:'ordinary',result:E.calculate(base),input:base};
}
const api={run};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FaraidScenarios=api;
})(typeof globalThis==='undefined'?this:globalThis);
