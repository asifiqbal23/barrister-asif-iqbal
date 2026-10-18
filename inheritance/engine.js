/* Independent educational faraid engine, v1.0. Exact rational arithmetic.
 * No source code or requests from inheritance-calculator.com are used.
 * Coverage and review boundaries are documented in METHODOLOGY.md.
 */
(function(root){
'use strict';
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a||1n;};
class Fraction{
 constructor(n=0,d=1){n=BigInt(n);d=BigInt(d);if(!d)throw Error('Zero denominator');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);this.n=n/g;this.d=d/g;}
 add(b){b=F(b);return new Fraction(this.n*b.d+b.n*this.d,this.d*b.d);}
 sub(b){b=F(b);return new Fraction(this.n*b.d-b.n*this.d,this.d*b.d);}
 mul(b){b=F(b);return new Fraction(this.n*b.n,this.d*b.d);}
 div(b){b=F(b);return new Fraction(this.n*b.d,this.d*b.n);}
 cmp(b){b=F(b);const v=this.n*b.d-b.n*this.d;return v<0n?-1:v>0n?1:0;}
 str(){return this.d===1n?String(this.n):`${this.n}/${this.d}`;}
 num(){return Number(this.n)/Number(this.d);}
}
const F=(n,d)=>n instanceof Fraction?n:new Fraction(n,d),Z=()=>F(0),O=()=>F(1);
const normalise=s=>String(s??'').trim().replace(/[০-৯]/g,c=>String('০১২৩৪৫৬৭৮৯'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c)));
function decimal(value,maxDigits=6){let s=normalise(value);if(!s)s='0';if(!/^\d+(\.\d+)?$/.test(s))throw Error('Use a non-negative number without commas.');const [a,b='']=s.split('.');if(b.length>maxDigits||a.length>15)throw Error('Number is too large or has too many decimal places.');return F(BigInt(a+b),10n**BigInt(b.length));}
function fraction(value){let s=normalise(value);if(!s)return Z();if(s.includes('/')){if(!/^\d+\s*\/\s*\d+$/.test(s))throw Error('Enter a fraction such as 1/3.');const [n,d]=s.split('/').map(x=>BigInt(x.trim()));if(!d)throw Error('A fraction cannot have zero as its denominator.');return F(n,d);}return decimal(s);}
const SINGLE=['father','mother','husband','pgf','pggf','pgm','mgm','ffm','fmm','mmm','mf','fmf','mff','mmf','mfm'];
const AGNATES=['fbs','pbs','fbss','pbss','fu','pu','fus','pus','fuss','puss'];
const DISTANT=['ds','dd','sds','sdd','dss','dsd','dds','ddd','ssds','ssdd','mf','fmf','mff','mmf','mfm','fbd','fss','fsd','mbs','mbd','mss','msd','pbd','pss','psd','fa','fpa','fma','fmu','mu','ma','mpu','mpa','mmu','mma'];
const CORE=['father','mother','husband','wives','son','daughter','pgf','pggf','pgm','mgm','ffm','fmm','mmm','ss','sd','sss','ssd','fb','fs','ms','pb','ps',...AGNATES];
const KEYS=[...CORE,...DISTANT];
const METHODS=['hanafi','maliki','shafii','hanbali','yusuf','muhammad'];
const SPECIAL={unborn:'An unborn child may require reserved shares and alternative calculations.',adopted:'Adoption does not by itself define a blood-heir entitlement. The family and any bequest need review.',parentage:'Disputed or legally unestablished parentage needs individual review.',foster:'Foster or adoptive relationships must be distinguished from inheriting blood relationships.',prisoner:'Detention and the person’s survival or legal status need individual assessment.',religion:'A difference or change of religion may affect eligibility; no automatic disqualification is applied.',missing:'A missing person’s status and reserved estate require individual review.',homicide:'A possible disqualification arising from a killing requires a legal and factual assessment.',orphan:'Bangladesh section 4 / statutory representation may apply to descendants of a predeceased child. This version does not calculate that statutory adjustment.',multiple:'One person connected through multiple family paths requires a family-tree review.',willHeir:'A bequest benefiting an heir requires review of validity and any required consent.',deathOrder:'Uncertain or successive deaths must be assessed as separate estates with a verified order of death.'};
function review(messages,estate){return {status:'review',messages,estate};}
function estate(input){
 const cash=decimal(input.cash||0,2),funeral=decimal(input.funeral||0,2),dower=decimal(input.dower||0,2),debt1=decimal(input.debt1||0,2),debt2=decimal(input.debt2||0,2),otherDebt=decimal(input.otherDebt||0,2);
 const debts=debt1.add(debt2).add(otherDebt),deductions=funeral.add(dower).add(debts),after=cash.sub(deductions);
 const will=fraction(input.will||0);if(will.cmp(F(1,3))>0)throw Error('This model accepts a bequest of at most one-third after expenses and debts. Larger bequests need individual review.');
 if(will.cmp(0)<0)throw Error('The bequest cannot be negative.');
 const exactBequest=after.cmp(0)>0?after.mul(will):Z();
 const bequest=F(exactBequest.n*100n/exactBequest.d,100),net=after.cmp(0)>0?after.sub(bequest):Z();
 return {cash,funeral,dower,debt1,debt2,otherDebt,debts,deductions,after,will,bequest,exactBequest,net,insolvent:after.cmp(0)<0};
}
function calculate(input={}){
 let e;try{e=estate(input);}catch(err){return {status:'invalid',messages:[err.message]};}
 const h={},raw=input.heirs||{};
 for(const key of Object.keys(raw))if(!KEYS.includes(key))return {status:'invalid',messages:[`Unknown heir category: ${key}`]};
 for(const key of KEYS){const v=normalise(raw[key]||0);if(!/^\d+$/.test(v)||Number(v)>(input._projection?10000:99))return {status:'invalid',messages:['Heir counts must be whole numbers from 0 to 99.']};h[key]=Number(v);if(SINGLE.includes(key)&&h[key]>1)return {status:'invalid',messages:['A parent, grandparent or husband field cannot exceed one.']};}
 if(h.wives>4||h.husband&&h.wives)return {status:'invalid',messages:['Enter either one surviving husband or up to four surviving wives.']};
 if(input.sex==='male'&&h.husband||input.sex==='female'&&h.wives)return {status:'invalid',messages:['The selected spouse does not match the deceased’s sex.']};
 if(!KEYS.some(k=>h[k]))return {status:'invalid',messages:['Enter at least one surviving relative.']};
 const method=input.method||'hanafi';if(!METHODS.includes(method))return review(['Choose a school or juristic method. “No school” is not a single agreed inheritance ruleset.'],e);
 const special=Object.keys(SPECIAL).filter(k=>input.special?.[k]).map(k=>SPECIAL[k]);
 if(special.length)return review(special,e);
 if(e.insolvent)return review(['Expenses and liabilities exceed the entered monetary estate. Debt priority, other estate assets and creditor rights require review; there is no monetary remainder calculated for heirs.'],e);
 const hanafi=['hanafi','yusuf','muhammad'].includes(method);
 const grand=h.father?'father':h.pgf?'pgf':h.pggf?'pggf':null;
 const maleLevels=['son','ss','sss'],femaleLevels=['daughter','sd','ssd'];
 const maleLevel=maleLevels.findIndex(k=>h[k]);
 const male=maleLevel!==-1,desc=[...maleLevels,...femaleLevels].some(k=>h[k]);
 const sibs=h.fb+h.fs+h.pb+h.ps+h.ms;
 const greatGranny=h.ffm||h.fmm||h.mmm;
 const prelim=[];
 const grandfatherSiblings=method!=='hanafi'&&grand&&grand!=='father'&&!male&&(h.fb||h.fs||h.pb||h.ps);
 if(prelim.length)return review(prelim,e);
 const rows=KEYS.filter(k=>h[k]).map(key=>({key,count:h[key],fixed:Z(),share:Z(),reason:'A closer eligible heir takes priority, or no residue remains.',kind:'excluded'}));
 const row=k=>rows.find(r=>r.key===k);
 const fixed=(k,share,reason)=>{const r=row(k);if(!r)return;r.fixed=share;r.share=share;r.reason=reason;r.kind='fixed';};
 const add=(k,share,reason)=>{const r=row(k);if(!r)return;r.share=r.share.add(share);r.reason=(r.fixed.cmp(0)>0?r.reason+' ':'')+reason;r.kind=r.fixed.cmp(0)>0?'fixed + residue':'residue';};
 const notes=[],res=[];
 if(e.exactBequest.cmp(e.bequest)!==0)notes.push('The bequest is rounded down to the nearest minor currency unit; the rounding balance remains in the heirs’ estate.');
 const resid=(k,weight=1)=>{if(h[k])res.push({key:k,weight:h[k]*weight});};
 if(h.husband)fixed('husband',desc?F(1,4):F(1,2),desc?'The husband receives one-quarter because an inheriting child or descendant through sons is present.':'The husband receives one-half because no inheriting child or descendant through sons is present.');
 if(h.wives)fixed('wives',desc?F(1,8):F(1,4),(desc?'The wife or wives receive one-eighth collectively because an inheriting child or descendant through sons is present.':'The wife or wives receive one-quarter collectively because no inheriting child or descendant through sons is present.')+' Multiple wives divide this portion equally.');
 const spouse= h.husband?'husband':h.wives?'wives':null;
 if(h.mother){const umariyya=!desc&&(h.father||method==='yusuf'&&grand)&&sibs<2&&spouse;
  fixed('mother',umariyya?O().sub(row(spouse).share).div(3):(desc||sibs>=2?F(1,6):F(1,3)),umariyya?'Umariyyah: one-third of the remainder after the spouse.':desc?'The mother receives one-sixth because an inheriting descendant is present.':sibs>=2?`The mother receives one-sixth because ${sibs} siblings are entered, including siblings who may themselves be excluded.`:'The mother receives one-third because no inheriting descendant and fewer than two siblings are present.');if(umariyya)notes.push('Umariyyah applied.');}
 if(grand&&desc)fixed(grand,F(1,6),'The nearest eligible male ascendant receives one-sixth with inheriting descendants, and may also receive residue when there is no male descendant.');
 if(!h.mother){
  const hb=method==='hanbali',maternalPreference=['maliki','shafii'].includes(method);
  let gs=[['pgm',2,!hb&&!!h.father],['mgm',2,false],['ffm',3,method==='maliki'||!hb&&!!(h.father||h.pgf)],['fmm',3,!hb&&!!h.father],['mmm',3,false]].filter(([k,,blocked])=>h[k]&&!blocked);
  if(gs.length){const degree=Math.min(...gs.map(g=>g[1]));gs=gs.filter(g=>g[1]===degree||maternalPreference&&g[0]==='mmm'&&!h.mgm);gs.forEach(([k])=>fixed(k,F(1,6*gs.length),'Eligible grandmothers share one-sixth equally. The selected school determines eligible lines, exclusion by a father and priority between different degrees.'));}
 }
 // Female descendants may complete the two-thirds ceiling or join an eligible male.
 let femaleFixed=Z();
 for(let level=0;level<3;level++){
  const k=femaleLevels[level];if(!h[k]||male&&(level>maleLevel))continue;
  if(maleLevel===level){resid(k,1);continue;}
  let f=Z();
  if(femaleFixed.cmp(0)===0)f=h[k]===1?F(1,2):F(2,3);
  else if(femaleFixed.cmp(F(1,2))===0)f=F(1,6);
  if(f.cmp(0)>0){fixed(k,f,level===0?'Daughters without a son receive one-half singly or two-thirds collectively.':'Eligible female descendants through sons receive their prescribed portion, including completion of the two-thirds ceiling.');femaleFixed=femaleFixed.add(f);}
  else if(level>0&&male&&maleLevel>level)resid(k,1);
 }
 if(male)resid(maleLevels[maleLevel],2);
 if(h.ms&&!desc&&!grand)fixed('ms',h.ms===1?F(1,6):F(1,3),'Maternal half-siblings divide their collective portion equally, irrespective of sex.');
 const blockedSiblings=male||!!grand;
 if(!blockedSiblings){
  if(h.fb){resid('fb',2);resid('fs',1);}
  else if(h.fs){if(desc)resid('fs');else fixed('fs',h.fs===1?F(1,2):F(2,3),'Full sisters without a full brother receive one-half singly or two-thirds collectively when the fixed-share conditions are met.');}
  const fullRes=h.fb||(h.fs&&desc);
  if(!fullRes){
   if(h.pb){resid('pb',2);resid('ps',1);}
   else if(h.ps){
    if(h.fs===1&&!desc)fixed('ps',F(1,6),'Paternal half-sisters collectively complete two-thirds alongside one full sister.');
    else if(!h.fs){if(desc)resid('ps');else fixed('ps',h.ps===1?F(1,2):F(2,3),'Paternal half-sisters receive a prescribed share when no closer sibling excludes them.');}
   }
  }
 }
 if(grand&&!male)resid(grand);
 if(!res.length){const first=AGNATES.find(k=>h[k]);if(first&&!male&&!grand&&!h.fb&&!(h.fs&&desc)&&!h.pb&&!(h.ps&&desc))resid(first);}
 // Mushtarakah under Maliki and Shafi'i: full and maternal siblings share one-third equally.
 const mushtaraka=['maliki','shafii'].includes(method)&&h.husband&&!desc&&!grand&&h.ms>=2&&h.fb>0&&rows.some(r=>['mother','pgm','mgm'].includes(r.key)&&r.fixed.cmp(F(1,6))===0);
 if(mushtaraka){const total=h.ms+h.fb+h.fs;['ms','fb','fs'].forEach(k=>{if(h[k])fixed(k,F(h[k],3*total),'Mushtarakah: eligible full and maternal siblings share one-third equally per person.');});res.length=0;notes.push('Mushtarakah applied for the selected school.');}
 let akdariyyah=false;
 if(grandfatherSiblings){
  res.length=0;
  const sister=h.fs?'fs':'ps';
  akdariyyah=!!(h.husband&&h.mother&&!desc&&!h.fb&&!h.pb&&h.fs+h.ps===1&&!h.ms);
  if(akdariyyah){
   fixed('husband',F(9,27),'Akdariyyah: the husband’s final portion after awl and the recombination of the grandfather’s and sister’s shares.');
   fixed('mother',F(6,27),'Akdariyyah: the mother’s final portion after the special adjustment.');
   fixed(grand,F(8,27),'Akdariyyah: grandfather and sister share their combined portion at two to one.');
   fixed(sister,F(4,27),'Akdariyyah: grandfather and sister share their combined portion at two to one.');
   notes.push('Akdariyyah: original denominator 6 rises to 9; grandfather and sister portions are combined and split 2:1, yielding 9:6:8:4 out of 27.');
  }else{
   const others=rows.filter(r=>r.key!==grand).reduce((a,r)=>a.add(r.fixed),Z());
   const left=O().sub(others),units=h.fb*2+h.fs+h.pb*2+h.ps;
   const candidates=others.cmp(0)===0?[F(1,3),left.mul(F(2,2+units))]:[F(1,6),left.div(3),left.mul(F(2,2+units))];
   const best=candidates.reduce((a,b)=>a.cmp(b)>=0?a:b);
   fixed(grand,best,`Grandfather with siblings: compare ${candidates.map(c=>c.str()).join(', ')} of the whole estate under the selected Zayd rule. The greatest eligible portion is ${best.str()}. Sibling sharing uses ${units} sibling weighting units plus 2 for the grandfather.`);
   if(h.fb){resid('fb',2);resid('fs',1);}else if(h.fs&&(h.pb||h.ps)){
    const available=left.sub(best),cap=h.fs===1?F(1,2):F(2,3);
    if(available.cmp(0)>0){fixed('fs',available.cmp(cap)<0?available:cap,'Mu‘addah: paternal siblings count when determining the grandfather’s portion; full sisters then take the available balance up to their prescribed ceiling.');resid('pb',2);resid('ps',1);}
   }else if(h.fs){resid('fs');}else{resid('pb',2);resid('ps',1);}
   notes.push('Grandfather–siblings calculation applied using Zayd’s approach. Mu‘addah counts paternal siblings before assigning the full siblings’ priority.');
  }
 }
 const fixedTotal=rows.reduce((a,r)=>a.add(r.fixed),Z());
 let remainder=O().sub(fixedTotal),awl=false,radd=false;
 if(remainder.cmp(0)<0){awl=true;rows.forEach(r=>{r.share=r.fixed.div(fixedTotal);if(r.fixed.cmp(0)>0)r.reason+=' Awl proportionally reduces this share.';});remainder=Z();notes.push('Awl: prescribed shares exceeded the whole and were reduced proportionately.');}
 else if(res.length&&remainder.cmp(0)>0){const units=res.reduce((a,r)=>a+r.weight,0);res.forEach(r=>add(r.key,remainder.mul(F(r.weight,units)),`After fixed portions, ${remainder.str()} remains. There are ${units} total weighting units; this group has ${h[r.key]} person(s) and ${r.weight} units (${r.weight/h[r.key]} each). Its group share is ${remainder.str()} × ${r.weight}/${units} = ${remainder.mul(F(r.weight,units)).str()}.`));remainder=Z();}
 const raddPolicy=input.radd||'auto';if(!['auto','exclude','include','off'].includes(raddPolicy))return {status:'invalid',messages:['Unknown reversion policy.']};
 const applyRadd=raddPolicy==='include'||raddPolicy==='exclude'||raddPolicy==='auto'&&(hanafi||method==='hanbali');
 if(remainder.cmp(0)>0&&!res.length&&applyRadd){
  const receivers=rows.filter(r=>r.fixed.cmp(0)>0&&(raddPolicy==='include'||!['husband','wives'].includes(r.key)));
  const base=receivers.reduce((a,r)=>a.add(r.fixed),Z());
  if(base.cmp(0)>0){receivers.forEach(r=>{r.share=r.share.add(remainder.mul(r.fixed.div(base)));r.kind='fixed + radd';r.reason+=' Reversion returns the surplus in proportion to eligible fixed shares.';});remainder=Z();radd=true;notes.push(raddPolicy==='include'?'Custom reversion policy includes spouses. This is an explicit user-selected assumption.':'Radd: surplus returned to eligible non-spouse fixed sharers.');}
 }
 const distant=DISTANT.filter(k=>h[k]);
 const nonSpouseFixed=rows.some(r=>r.fixed.cmp(0)>0&&!['husband','wives'].includes(r.key));
 if(remainder.cmp(0)>0&&distant.length&&!res.length&&!nonSpouseFixed){
  if(hanafi||method==='hanbali'){
   const D=typeof module!=='undefined'&&module.exports?require('./distant.js'):root.FaraidDistant;
   const dr=D.solve({h,method,input,F,calculate});
   if(dr.status!=='ok')return review(dr.messages,e);
   for(const item of dr.rows){add(item.key,remainder.mul(item.share),item.reason);row(item.key).kind='distant kindred';if(item.individual)row(item.key).individual=item.individual.map(v=>remainder.mul(v));}
   notes.push(...dr.notes);remainder=Z();
  }else notes.push('Under the selected classical Maliki/Shafi’i policy, distant kindred do not receive an automatic allocation. Later juristic policies may differ.');
 }
 if(remainder.cmp(0)>0)notes.push('An unallocated balance remains. Its destination requires review; it is not automatically redistributed to the listed heirs.');
 if(['maliki','shafii'].includes(method)&&raddPolicy==='auto')notes.push('Classical Maliki/Shafi’i policy is selected: no automatic reversion. Other accepted approaches require an explicit policy choice.');
 if(['yusuf','muhammad'].includes(method))notes.push('This juristic profile uses Zayd’s grandfather–siblings rule and its own distant-kindred allocation method.');
 // Branch members can have unequal entitlements. Never report their mean as an individual share.
 for(let i=rows.length-1;i>=0;i--){const r=rows[i];if(r.individual?.some(v=>v.cmp(r.individual[0])!==0)){rows.splice(i,1,...r.individual.map((v,j)=>({...r,key:r.key+'#'+(j+1),baseKey:r.key,count:1,share:v,individual:undefined,reason:r.reason+' Person '+(j+1)+' follows the corresponding entered branch ID.'})));}}
 rows.forEach(r=>{r.each=r.share.div(r.count);if(!r.share.n){r.kind='excluded';
  if(res.some(x=>x.key===r.key))r.reason='The prescribed portions exhaust the estate, leaving no residue for this group.';
  else if(['pgf','pggf'].includes(r.key)&&grand)r.reason=`A nearer male ascendant (${grand}) excludes this ascendant.`;
  else if(['pgm','mgm','ffm','fmm','mmm'].includes(r.key))r.reason=h.mother?'The surviving mother excludes the grandmothers.':'A nearer eligible grandmother or an intervening father/grandfather excludes this grandmother under the selected rules.';
  else if(['ss','sd','sss','ssd'].includes(r.key))r.reason=male&&maleLevels.indexOf(r.key)!==maleLevel&&(['ss','sss'].includes(r.key)||femaleLevels.indexOf(r.key)>maleLevel)?'A nearer surviving male descendant excludes this more remote descendant.':'The female descendants’ two-thirds ceiling is already filled, and no eligible male descendant makes this group residuary.';
  else if(r.key==='ms')r.reason='Inheriting descendants or a father/paternal grandfather exclude maternal half-siblings.';
  else if(['fb','fs','pb','ps'].includes(r.key))r.reason=male?'An inheriting male descendant excludes siblings.':grand&&(method==='hanafi'||grand==='father')?'The nearest male ascendant excludes siblings under the selected school.':grandfatherSiblings?'The grandfather’s selected entitlement and the full siblings’ priority leave no allocation for this sibling group.':h.fb?'A full brother excludes paternal half-siblings.':h.fs&&desc?'Full sisters inheriting as residuaries with female descendants exclude paternal siblings.':'The full sisters’ prescribed portion excludes paternal sisters unless an eligible paternal brother makes them residuary.';
  else if(DISTANT.includes(r.key))r.reason='Prior sharers/residuaries or the selected distant-kindred policy leave no allocation to this relative.';
  else if(AGNATES.includes(r.key))r.reason='A nearer eligible residuary group takes priority over this more distant male relative.';
 }});
 const total=rows.reduce((a,r)=>a.add(r.share),remainder);if(total.cmp(1)!==0)throw Error('Share conservation failed.');
 return {status:'ok',method,rows,remainder,estate:e,notes,awl,radd,fixedTotal,raddPolicy,akdariyyah,grandfatherSiblings:!!grandfatherSiblings,mushtaraka:!!mushtaraka,umariyyah:!!(!desc&&(h.father||method==='yusuf'&&grand)&&h.mother&&sibs<2&&spouse),heirs:h};
}
// Cash allocations use two-decimal minor units and reconcile every displayed group.
function allocateMoney(result){
 const net=result.estate.net,minor=(net.n*100n)/net.d,subcent=net.sub(F(minor,100));
 const entries=result.rows.filter(r=>r.share.n).map(r=>({key:r.key,count:r.count,share:r.share}));
 if(result.remainder.n)entries.push({key:'unallocated',count:1,share:result.remainder});
 let used=0n;
 const groups=entries.map((r,index)=>{const per=r.share.div(r.count),n=minor*per.n,base=n/per.d,remainder=n%per.d;used+=base*BigInt(r.count);return {...r,index,base,remainder,den:per.d,extra:0};});
 let left=minor-used;
 const order=[...groups].sort((a,b)=>{const v=a.remainder*b.den-b.remainder*a.den;return v>0n?-1:v<0n?1:a.index-b.index;});
 for(const g of order){const give=left>BigInt(g.count)?BigInt(g.count):left;g.extra=Number(give);left-=give;if(!left)break;}
 groups.forEach(g=>{g.total=g.base*BigInt(g.count)+BigInt(g.extra);});
 if(groups.reduce((a,g)=>a+g.total,0n)!==minor)throw Error('Currency reconciliation failed.');
 return {minor,subcent,groups};
}
const units={sqft:F(1),sqyd:F(9),sqm:F(1562500,145161),sqin:F(1,144),sqcm:F(625,580644),acre:F(43560),pole:F(1089,4),marla:F(1089,4),kanal:F(5445),decimal:F(2178,5)};
function land(area,unit,customFactor=1){if(!units[unit]&&unit!=='custom')throw Error('Select an area unit.');const factor=unit==='custom'?decimal(customFactor):units[unit];if(factor.cmp(0)<=0)throw Error('Custom unit size must be greater than zero.');return decimal(area).mul(factor);}
function converted(areaSqft,share,unit,customFactor=1){const factor=unit==='custom'?decimal(customFactor):units[unit];if(!factor)throw Error('Unknown output unit');return areaSqft.mul(share).div(factor);}
const api={Fraction,F,decimal,fraction,normalise,calculate,estate,allocateMoney,units,land,converted,KEYS,DISTANT,AGNATES,SPECIAL};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Faraid=api;
})(typeof globalThis==='undefined'?this:globalThis);
