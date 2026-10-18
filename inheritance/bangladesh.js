/* Bangladesh statutory overlay. No foreign judgment is treated as Bangladesh law.
 * Section 4 determines a branch total. A multi-child branch is deliberately not
 * reported as an equal per-person award or as an unverified 2:1 statutory award.
 */
(function(root){
'use strict';
const DESCENDANTS=['ss','sd','ds','dd','sss','ssd','sds','sdd','dss','dsd','dds','ddd','ssds','ssdd'];
function calculate(input,E){
 const fail=(en,bn,refs=['bd'])=>({status:'review',messages:[en+' / '+bn],refs});
 if(input.method!=='hanafi'||!['auto',undefined].includes(input.radd))return fail('The Bangladesh profile uses the stated Hanafi base with automatic surplus policy. Use the classical profile for other juristic assumptions.','বাংলাদেশ প্রোফাইলে হানাফি ভিত্তি ও স্বাভাবিক রদ্দ নীতি ব্যবহৃত হয়। অন্য অনুমানের জন্য ফিকহি তুলনার প্রোফাইল নিন।',['bdPersonal','scope']);
 const legal=input.bd||{};
 if(!['yes','no'].includes(legal.orphans))return fail('Did a son or daughter die before the estate owner, leaving children alive when the owner died? Answer the section 4 question.','মৃত ব্যক্তির আগে তাঁর কোনো ছেলে বা মেয়ে মারা গিয়ে জীবিত সন্তান রেখে গেছেন কি না—ধারা ৪-এর প্রশ্নটির উত্তর দিন।');
 if(legal.divorce)return fail('Confirm whether the marriage still subsisted at death. MFLO sections 7–8 affect when a divorce becomes effective; pronouncement alone is not enough to decide the spouse count.','মৃত্যুর সময় বিবাহ বহাল ছিল কি না যাচাই করুন। ধারা ৭–৮ অনুযায়ী তালাক কার্যকর হওয়ার সময় গুরুত্বপূর্ণ; শুধু উচ্চারণের ভিত্তিতে স্বামী/স্ত্রী বাদ দেওয়া যাবে না।',['bdDivorce']);
 if(legal.specialAssets)return fail('Separate any disputed fund, nominee, insurance, pension, waqf or gift property from the ordinary estate after checking its governing law and documents. No automatic transfer to the nominee or heirs is assumed.','তহবিল, নমিনি, বীমা, পেনশন, ওয়াক্‌ফ বা হেবা সম্পত্তির মালিকানা অনিশ্চিত হলে সংশ্লিষ্ট আইন ও দলিল দেখে সাধারণ সম্পত্তি থেকে পৃথক করুন। নমিনি বা ওয়ারিশের মালিকানা অনুমান করা হয়নি।',['bdFund','bdPersonal','scope']);
 if(input.special?.missing)return fail('A missing person’s survival and relevant death date must be established. Evidence Act section 108 shifts the burden of proof in the stated seven-year circumstances; this calculator does not invent a date of death.','নিখোঁজ ব্যক্তির জীবিত থাকা ও প্রাসঙ্গিক মৃত্যুর সময় নির্ধারণ করতে হবে। সাক্ষ্য আইনের ১০৮ ধারায় নির্দিষ্ট সাত বছরের পরিস্থিতিতে প্রমাণের দায় বদলায়; এখানে মৃত্যুর তারিখ অনুমান করা হয় না।',['bdMissing']);
 const h={...(input.heirs||{})};
 if(DESCENDANTS.some(k=>Number(E.normalise(h[k]||0))))return fail('For Bangladesh, enter grandchildren only under their predeceased parent’s section 4 branch, not again in the ordinary relative fields. More remote descendants need a verified family-tree review.','বাংলাদেশের ক্ষেত্রে নাতি-নাতনিকে শুধু আগে মৃত বাবা/মায়ের শাখায় দিন; সাধারণ আত্মীয়ের ঘরে আবার নয়। আরও দূরবর্তী বংশধরের জন্য পারিবারিক বৃক্ষ যাচাই প্রয়োজন।');
 if(legal.orphans==='no'&&(legal.branches||[]).length)return fail('Remove the earlier branch entries or change the section 4 answer to Yes.','আগের শাখার তথ্য মুছুন অথবা ধারা ৪-এর উত্তরে হ্যাঁ দিন।');
 const branches=legal.orphans==='yes'?legal.branches||[]:[];
 if(legal.orphans==='yes'){
  if(legal.era!=='after')return fail('This section 4 model is for succession opening after the Ordinance came into force. An earlier or uncertain death date needs historical-law review.','এই ধারা ৪ মডেল অধ্যাদেশ কার্যকর হওয়ার পরে সৃষ্ট উত্তরাধিকারের জন্য। আগের বা অনিশ্চিত মৃত্যুর তারিখে তৎকালীন আইন যাচাই প্রয়োজন।',['bd','bdTiming']);
  if(!branches.length||branches.length>20)return fail('Add one separate branch for each predeceased son or daughter (up to 20 branches).','আগে মৃত প্রতিটি ছেলে বা মেয়ের জন্য আলাদা শাখা দিন (সর্বোচ্চ ২০টি)।');
 }
 const n=v=>{const s=E.normalise(v??0);return /^\d+$/.test(s)&&Number(s)<=99?Number(s):NaN;};
 const live={son:n(h.son),daughter:n(h.daughter)};
 if(Object.values(live).some(Number.isNaN))return {status:'invalid',messages:['Heir counts must be whole numbers from 0 to 99.']};
 const parsed=[];
 for(let i=0;i<branches.length;i++){
  const b=branches[i],boys=n(b.boys),girls=n(b.girls);
  if(!['son','daughter'].includes(b.parent)||!Number.isInteger(boys)||!Number.isInteger(girls)||boys+girls<1||boys+girls>99)return fail('Each branch needs a son/daughter parent and 1–99 children living when the estate owner died. Do not add spouses or later generations here.','প্রতি শাখায় আগে মৃত ছেলে/মেয়ে এবং মূল ব্যক্তির মৃত্যুর সময় জীবিত ১–৯৯ জন সন্তান দিন। এখানে স্বামী/স্ত্রী বা পরের প্রজন্ম যোগ করবেন না।');
  parsed.push({...b,boys,girls,index:i+1});
 }
 for(const k of ['son','daughter'])h[k]=live[k]+parsed.filter(b=>b.parent===k).length;
 const special={...input.special,orphan:false,adopted:false,foster:false};
 const result=E.calculate({...input,heirs:h,special});
 if(result.status!=='ok')return {...result,refs:[...(result.refs||[]),'bdPersonal',...(input.special?.willHeir?['bdWills']:[])]};
 result.jurisdiction='bangladesh';result.legalRefs=['bdPersonal','bdIntestate',...(result.estate.dower.n?['bdDower']:[]),...(result.estate.will.n?['bdWills']:[])];
 if(input.special?.adopted||input.special?.foster){result.notes.push('Adoption or fosterage alone does not create a blood-heir share. Enter only independently established inheriting blood relationships.');result.legalRefs.push('adoption');}
 result.statutoryBranches=[];
 if(!parsed.length)return result;
 const originalRows=result.rows;
 result.rows=originalRows.filter(r=>!['son','daughter'].includes(r.key)).map(r=>({...r,reason:r.reason+' Section 4: the calculation includes each represented predeceased child in the notional family.'}));
 for(const key of ['son','daughter']){
  const r=originalRows.find(r=>r.key===key);if(!r)continue;
  if(live[key])result.rows.push({...r,count:live[key],share:r.each.mul(live[key]),fixed:r.fixed.div(r.count).mul(live[key]),reason:r.reason+' This is the allocation to surviving children after including the section 4 branches.'});
 }
 for(const b of parsed){
  const parent=originalRows.find(r=>r.key===b.parent),share=parent.each,count=b.boys+b.girls;
  const en=`Branch ${b.index}: children of predeceased ${b.parent}`;
  const bn=`শাখা ${b.index}: আগে মৃত ${b.parent==='son'?'ছেলের':'মেয়ের'} সন্তান`;
  const reason=`MFLO 1961, section 4: this predeceased ${b.parent} would receive ${share.str()} if alive in the notional family. That total passes to this branch’s ${count} living child(ren), not to the predeceased parent’s spouse or other heirs. ${count>1?'This is a collective branch award. The division within the branch has not been determined.':'This branch has one living child, who receives the whole branch share.'}`;
  const reasonBn=`মুসলিম পারিবারিক আইন অধ্যাদেশ, ১৯৬১-এর ধারা ৪: আগে মৃত ${b.parent==='son'?'ছেলে':'মেয়ে'} জীবিত ধরা হলে তাঁর অংশ হতো ${share.str()}। এই মোট অংশ শাখার ${count} জন জীবিত সন্তানের জন্য; আগে মৃত ব্যক্তির স্বামী/স্ত্রী বা অন্য ওয়ারিশের জন্য নয়। ${count>1?'এটি শাখার সম্মিলিত বরাদ্দ। শাখার ভেতরে ব্যক্তিগত ভাগ নির্ধারণ করা হয়নি।':'এই শাখায় একজন জীবিত সন্তান থাকায় তিনিই শাখার সম্পূর্ণ অংশ পাবেন।'}`;
  result.rows.push({key:'bd-branch-'+b.index,baseKey:b.parent,labelEn:en,labelBn:bn,count:1,beneficiaryCount:count,collective:count>1,share,each:count>1?null:share,fixed:parent.fixed.div(parent.count),kind:'statutory branch',reason,reasonBn});
  result.statutoryBranches.push({index:b.index,parent:b.parent,boys:b.boys,girls:b.girls,share});
 }
 result.legalRefs.push('bd','bdOverride','bdTiming');
 result.section4=true;result.notionalRows=originalRows;
 result.notes.push('Section 4 branch totals are calculated by representing each eligible predeceased son or daughter once. Branches are not pooled by the number of grandchildren. Multi-child branch totals are not per-person awards.');
 if(result.rows.reduce((s,r)=>s.add(r.share),result.remainder).cmp(1)!==0)throw Error('Section 4 share conservation failed.');
 return result;
}
const api={calculate,DESCENDANTS};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BangladeshInheritance=api;
})(typeof globalThis==='undefined'?this:globalThis);
