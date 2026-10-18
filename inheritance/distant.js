/* Original implementation of the relationship rules in al-Sirajiyyah and
 * al-Mughni, Kitab al-Fara'id. See METHODOLOGY.md for the selected opinions.
 * Counts cannot establish family branches: Tanzil requests branch IDs where needed.
 */
(function(root){
'use strict';
const classes=[['ds','dd','sds','sdd','dss','dsd','dds','ddd','ssds','ssdd'],['mf','fmf','mff','mmf','mfm'],['fbd','fss','fsd','mbs','mbd','mss','msd','pbd','pss','psd'],['fa','fpa','fma','fmu','mu','ma','mpu','mpa','mmu','mma']];
const paths={ds:'FM',dd:'FF',sds:'MFM',sdd:'MFF',dss:'FMM',dsd:'FMF',dds:'FFM',ddd:'FFF',ssds:'MMFM',ssdd:'MMFF',mf:'FM',fmf:'MFM',mff:'FMM',mmf:'FFM',mfm:'FMF'};
// [projected heir, direction, steps to heir, family prefix, roles below that heir]
const meta={
 ds:['daughter','child',1,'D',['son']],dd:['daughter','child',1,'D',['daughter']],
 sds:['sd','child',1,'SD',['son']],sdd:['sd','child',1,'SD',['daughter']],
 ssds:['ssd','child',1,'SSD',['son']],ssdd:['ssd','child',1,'SSD',['daughter']],
 dss:['daughter','child',2,'D',['son','son']],dsd:['daughter','child',2,'D',['son','daughter']],
 dds:['daughter','child',2,'D',['daughter','son']],ddd:['daughter','child',2,'D',['daughter','daughter']],
 mf:['mother','mother',1,'M',['father']],fmf:['pgm','father',1,'PGM',['father']],
 mff:['mother','mother',2,'M',['father','father']],mfm:['mother','mother',2,'M',['father','mother']],mmf:['mgm','mother',1,'MGM',['father']],
 fbd:['fb','father',1,'FB',['daughter']],fss:['fs','father',1,'FS',['son']],fsd:['fs','father',1,'FS',['daughter']],
 mbs:['ms','father',1,'MB',['son']],mbd:['ms','father',1,'MB',['daughter']],mss:['ms','father',1,'MS',['son']],msd:['ms','father',1,'MS',['daughter']],
 pbd:['pb','father',1,'PB',['daughter']],pss:['ps','father',1,'PS',['son']],psd:['ps','father',1,'PS',['daughter']],
 fa:['father','father',1,'F',['fs']],fpa:['father','father',1,'F',['ps']],fma:['father','father',1,'F',['ms']],fmu:['father','father',1,'F',['ms']],
 mu:['mother','mother',1,'M',['fb']],ma:['mother','mother',1,'M',['fs']],mpu:['mother','mother',1,'M',['pb']],mpa:['mother','mother',1,'M',['ps']],mmu:['mother','mother',1,'M',['ms']],mma:['mother','mother',1,'M',['ms']]
};
const sibRoot={fbd:'fb',fss:'fs',fsd:'fs',mbs:'ms',mbd:'ms',mss:'ms',msd:'ms',pbd:'pb',pss:'ps',psd:'ps'};
const maleKeys=new Set(['ds','sds','dss','dds','ssds','mf','fmf','mff','mmf','fss','mbs','mss','pss','fmu','mu','mpu','mmu']);
function solve({h,method,input,F,calculate}){
 const answer=new Map(),notes=[],present=classes.flat().filter(k=>h[k]);
 const add=(key,share,reason,individual)=>{const old=answer.get(key);answer.set(key,{key,share:(old?.share||F(0)).add(share),reason,individual});};
 const proportional=(keys,share,weight,reason)=>{const denominator=keys.reduce((n,k)=>n+weight(k),0);keys.forEach(k=>add(k,share.mul(F(weight(k),denominator)),reason));};
 const core=heirs=>{const r=calculate({method:'hanbali',heirs,radd:'exclude',_projection:true});if(r.status!=='ok')throw Error('A projected family could not be resolved: '+r.messages.join(' '));return Object.fromEntries(r.rows.map(r=>[r.key,r.share]));};
 if(method!=='hanbali'){
  // The accepted Hanafi class order; Abu Yusuf's reported order places siblings' offspring before maternal ascendants.
  const order=method==='yusuf'?[classes[0],classes[2],classes[1],classes[3]]:classes;
  let keys=order.find(c=>c.some(k=>h[k])).filter(k=>h[k]);const ci=classes.findIndex(c=>c.includes(keys[0]));
  const reason='Distant kindred: apply class priority, degree and the selected jurist’s distribution rule (al-Sirajiyyah, Distant Kindred).';
  notes.push('Distant kindred receive the balance after the spouse, with earlier classes excluding later classes. '+(method==='yusuf'?'Abu Yusuf: per-person distribution and the reported sibling-descendant priority.':'Hanafi / Imam Muhammad: the transmitted Muhammad method considers the sex and number of connecting roots.'));
  function byGenerations(ks,amount,level=0){
   const depth=paths[ks[0]].length;if(level>=depth-1){proportional(ks,amount,k=>h[k]*(maleKeys.has(k)?2:1),reason);return;}
   const males=ks.filter(k=>paths[k][level]==='M'),females=ks.filter(k=>paths[k][level]==='F');
   if(!males.length||!females.length){byGenerations(ks,amount,level+1);return;}
   const m=males.reduce((s,k)=>s+h[k],0),f=females.reduce((s,k)=>s+h[k],0),den=m*2+f;
   byGenerations(males,amount.mul(F(m*2,den)),level+1);byGenerations(females,amount.mul(F(f,den)),level+1);
  }
  if(ci===0){const degree=Math.min(...keys.map(k=>paths[k].length));keys=keys.filter(k=>paths[k].length===degree);const throughHeir=keys.filter(k=>['ds','dd','sds','sdd','ssds','ssdd'].includes(k));if(throughHeir.length)keys=throughHeir;
   if(method==='yusuf')proportional(keys,F(1),k=>h[k]*(maleKeys.has(k)?2:1),reason);else byGenerations(keys,F(1));
  }else if(ci===1){const degree=Math.min(...keys.map(k=>paths[k].length));keys=keys.filter(k=>paths[k].length===degree);const throughHeir=keys.filter(k=>['mf','fmf','mmf'].includes(k));if(throughHeir.length)keys=throughHeir;
   notes.push('Ascendant tie rule: a connection through an inheriting relative is preferred, following the view recorded for al-Khassaf and others in al-Sirajiyyah.');
   byGenerations(keys,F(1));
  }else if(ci===2){
   if(method==='yusuf'){const full=keys.filter(k=>['fbd','fss','fsd'].includes(k)),pat=keys.filter(k=>['pbd','pss','psd'].includes(k));keys=full.length?full:pat.length?pat:keys;proportional(keys,F(1),k=>h[k]*(maleKeys.has(k)?2:1),reason);}
   else{const projected={};keys.forEach(k=>projected[sibRoot[k]]=(projected[sibRoot[k]]||0)+h[k]);const shares=core(projected);
    for(const parent of ['fb','fs','pb','ps','ms']){const children=keys.filter(k=>sibRoot[k]===parent);if(!children.length)continue;proportional(children,shares[parent]||F(0),k=>h[k]*(parent==='ms'?1:maleKeys.has(k)?2:1),reason);}
   }
  }else{
   const pat=keys.filter(k=>['fa','fpa','fma','fmu'].includes(k)),mat=keys.filter(k=>!pat.includes(k));
   for(const side of [pat,mat]){if(!side.length)continue;let eligible=side;const full=side.filter(k=>['fa','mu','ma'].includes(k)),paternal=side.filter(k=>['fpa','mpu','mpa'].includes(k));eligible=full.length?full:paternal.length?paternal:side;
    const portion=pat.length&&mat.length?(side===pat?F(2,3):F(1,3)):F(1);proportional(eligible,portion,k=>h[k]*(maleKeys.has(k)?2:1),reason);
   }
  }
 }else{
  // Three-direction Tanzil: first reach an inheriting root within each direction.
  const depth={};present.forEach(k=>depth[meta[k][1]]=Math.min(depth[meta[k][1]]||Infinity,meta[k][2]));
  const eligible=present.filter(k=>meta[k][2]===depth[meta[k][1]]),roots=new Map(),allocations={};
  for(const key of present)allocations[key]=Array.from({length:h[key]},()=>F(0));
  const messages=[];
  for(const key of eligible){const [role,,steps,prefix,roles]=meta[key];const supplied=String(input.branches?.[key]||'').trim();
   const requires=['D','SD','SSD','FB','FS','MB','MS','PB','PS'].includes(prefix);
   let ids=supplied?supplied.split(',').map(v=>v.trim()):[];
   if(requires&&!ids.length){const siblings=eligible.filter(k=>meta[k][3]===prefix).reduce((n,k)=>n+h[k],0);
    if(siblings>1){messages.push('Enter the connecting family branch for each '+key+' heir in the Tanzil branch fields.');continue;}
   }
   if(!ids.length)ids=Array.from({length:h[key]},()=>prefix+'1'+(steps===2?'/P1':''));
   if(ids.length!==h[key]||ids.some(id=>!/^[-A-Za-z0-9]+(?:\/[-A-Za-z0-9]+)?$/.test(id)||id.split('/').length!==steps)){messages.push('Branch IDs for '+key+' must match the entered count and use '+steps+' level(s), separated by commas.');continue;}
   ids.forEach((id,i)=>{const parts=id.split('/'),rootId=prefix+':'+parts[0];if(!roots.has(rootId))roots.set(rootId,{role,children:[]});const r=roots.get(rootId);
    if(steps===1)r.children.push({role:roles[0],leaf:{key,index:i}});
    else{let child=r.children.find(c=>c.id===parts[1]);if(child&&child.role!==roles[0]){messages.push('The branch '+id+' has conflicting connecting relationships.');return;}if(!child){child={id:parts[1],role:roles[0],children:[]};r.children.push(child);}child.children.push({role:roles[1],leaf:{key,index:i}});}
   });
  }
  if(messages.length)return {status:'review',messages:[...new Set(messages)]};
  const rootHeirs={};for(const r of roots.values())rootHeirs[r.role]=(rootHeirs[r.role]||0)+1;
  const rootShares=core(rootHeirs);
  function divide(nodes,amount){
   const roles=nodes.map(n=>n.role),family=r=>['son','daughter'].includes(r)?'children':['fb','fs'].includes(r)?'full':['pb','ps'].includes(r)?'paternal':r;
   const equal=roles.every(r=>family(r)===family(roles[0]));let shares;
   if(equal)shares=nodes.map(()=>amount.div(nodes.length));
   else{const counts={};roles.forEach(r=>counts[r]=(counts[r]||0)+1);const s=core(counts);
    // Selected Hanbali equality opinion applies to equally related males/females.
    for(const pair of [['fb','fs'],['pb','ps']]){const n=pair.reduce((a,r)=>a+(counts[r]||0),0);if(n&&pair.every(r=>counts[r])){const sum=(s[pair[0]]||F(0)).add(s[pair[1]]||F(0));pair.forEach(r=>s[r]=sum.mul(F(counts[r],n)));}}
    shares=roles.map(r=>amount.mul(s[r]||F(0)).div(counts[r]));
   }
   nodes.forEach((node,i)=>{if(node.leaf)allocations[node.leaf.key][node.leaf.index]=allocations[node.leaf.key][node.leaf.index].add(shares[i]);else divide(node.children,shares[i]);});
  }
  for(const r of roots.values())divide(r.children,(rootShares[r.role]||F(0)).div(rootHeirs[r.role]));
  for(const key of eligible){const individual=allocations[key],share=individual.reduce((a,b)=>a.add(b),F(0));add(key,share,'Tanzil: represent the connecting heir, divide between the entered family branches, and pass each branch’s portion to its descendants. Equally related males and females share equally in the selected Hanbali opinion.',individual);}
  notes.push('Hanbali Tanzil uses the entered connecting branches and the equality opinion. Different branch assignments can change an individual’s share. The spouse keeps the unreduced spouse portion before this separate distant-kindred calculation.');
 }
 const rows=[...answer.values()];if(rows.reduce((a,r)=>a.add(r.share),F(0)).cmp(1)!==0)throw Error('Distant-kindred share reconciliation failed.');
 return {status:'ok',rows,notes};
}
const api={solve,meta,classes};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FaraidDistant=api;
})(typeof globalThis==='undefined'?this:globalThis);
