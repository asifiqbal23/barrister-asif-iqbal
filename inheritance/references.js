(function(root){
'use strict';
const sources={
 siraj:{name:'Al-Sirajiyyah — Arabic inheritance text (grandfather and distant-kindred chapters)',url:'https://freeislamicwill.com/index.php/al-sirajiyyah-arabic-text-translation-alsrajyt'},
 mughni:{name:'Ibn Qudamah, al-Mughni — Kitab al-Fara’id (Arabic)',url:'https://ar.wikisource.org/wiki/المغني_-_كتاب_الفرائض'},
 unborn:{name:'Al-Mughni — pregnancy and conditional inheritance (Arabic)',url:'https://ar.wikisource.org/wiki/المغني_-_كتاب_الفرائض'},
 adoption:{name:'Qur’an 33:4–5 — lineage and adoption',url:'https://quran.com/33/5'},
 religion:{name:'Sahih al-Bukhari 6764 — inheritance and religion',url:'https://sunnah.com/bukhari:6764'},
 homicide:{name:'Sunan Ibn Majah 2645 — killing and inheritance',url:'https://sunnah.com/ibnmajah:2645'},
 q411:{name:'Qur’an 4:11 — children and parents',url:'https://quran.com/4/11'},
 q412:{name:'Qur’an 4:12 — spouses and maternal siblings',url:'https://quran.com/4/12'},
 q4176:{name:'Qur’an 4:176 — siblings',url:'https://quran.com/4/176'},
 residue:{name:'Sahih al-Bukhari 6732 — prescribed shares, then residue',url:'https://sunnah.com/bukhari:6732'},
 completion:{name:'Sahih al-Bukhari 6736 — daughter, son’s daughter and sister',url:'https://sunnah.com/bukhari:6736'},
 grandmother:{name:'Sunan Abi Dawud 2894 — grandmother’s one-sixth',url:'https://sunnah.com/abudawud:2894'},
 will:{name:'Sahih al-Bukhari 2744 — the one-third bequest limit',url:'https://sunnah.com/bukhari:2744'},
 willHeir:{name:'Islamic Portal — bequests and grandchildren',url:'https://islamicportal.co.uk/wasiyyah-and-inheritance-query-grandchildrens-inheritance/'},
 umariyyah:{name:'Islamweb, Fatwa 88267 — spouse and both parents',url:'https://www.islamweb.net/en/fatwa/88267/inheritance-of-a-childless-man-with-other-survivors'},
 grandfather:{name:'Darul Ifta Birmingham — Hanafi grandfather and siblings',url:'https://daruliftabirmingham.co.uk/inheritance-case-involving-a-sister-with-the-grandfather/'},
 zayd:{name:'IslamQA, answer 240582 — grandfather, mu‘addah and Akdariyyah',url:'https://islamqa.info/ar/answers/240582'},
 radd:{name:'Islamweb, Fatwa 259390 — reversion excluding a spouse',url:'https://www.islamweb.net/en/fatwa/259390/dividing-inheritance-among-a-mother-and-a-wife'},
 motherSiblings:{name:'IslamQA, answer 13632 — siblings and the mother’s share',url:'https://islamqa.info/en/answers/13632/'},
 awlCase:{name:'Islamic Portal — Mirath Shares (awl example)',url:'https://islamicportal.co.uk/mirath-shares/'},
 study:{name:'S. A. Cheema (2021), JITC 11(1), pp. 118–120 — worked cases and school differences',url:'https://journals.umt.edu.pk/index.php/JITC/article/download/1228/619/'},
 soleDistant:{name:'IslamQA, answer 85495 — sole distant-kindred heir',url:'https://islamqa.info/ar/answers/85495'},
 siblingsCase:{name:'Islamic Portal — inheritance questions and equal maternal-sibling shares',url:'https://islamicportal.co.uk/inheritance-questions/'},
 bd:{name:'Bangladesh: Muslim Family Laws Ordinance, 1961, section 4',url:'https://bdlaws.minlaw.gov.bd/act-print-305/section-print-13528.html'},
 scope:{name:'Calculation policy and supported cases',url:'METHODOLOGY.md'}
};
function windowSafeDistant(key){return ['ds','dd','sds','sdd','dss','dsd','dds','ddd','ssds','ssdd','mf','fmf','mff','mmf','mfm','fbd','fss','fsd','mbs','mbd','mss','msd','pbd','pss','psd','fa','fpa','fma','fmu','mu','ma','mpu','mpa','mmu','mma'].includes(key);}
function forRow(row,result){
 const key=row.baseKey||row.key.split('#')[0],refs=new Set();
 if(['husband','wives','ms'].includes(key))refs.add('q412');
 if(['mother','father','son','daughter','ss','sd','sss','ssd'].includes(key))refs.add('q411');
 if(['fb','fs','pb','ps'].includes(key))refs.add('q4176');
 if(['pgf','pggf'].includes(key)||row.kind==='excluded'&&['fb','fs','pb','ps'].includes(key)&&result.method==='hanafi'&&!result.heirs.father&&(result.heirs.pgf||result.heirs.pggf))refs.add('grandfather');
 if(['pgm','mgm','ffm','fmm','mmm'].includes(key)){refs.add('grandmother');refs.add('siraj');refs.add('mughni');}
 if(['sd','ssd'].includes(key)||['fs','ps'].includes(key)&&row.kind.includes('residue'))refs.add('completion');
 if(row.kind.includes('residue')||row.kind==='excluded')refs.add('residue');
 if(row.kind.includes('radd')){refs.add('radd');if(result.raddPolicy==='include')refs.add('scope');}
 if(key==='mother'&&(result.heirs.fb+result.heirs.fs+result.heirs.pb+result.heirs.ps+result.heirs.ms>=2))refs.add('motherSiblings');
 if(result.umariyyah&&['mother','father','pgf','pggf'].includes(key)){refs.add('umariyyah');if(result.method==='yusuf')refs.add('study');}
 if(result.awl&&row.fixed.n){refs.add('awlCase');refs.add('study');}
 if(result.akdariyyah||result.grandfatherSiblings&&['pgf','pggf','fb','fs','pb','ps'].includes(key)){refs.add('zayd');refs.add('siraj');refs.add('mughni');}
 if(result.mushtaraka&&['fb','fs','ms'].includes(key))refs.add('study');
 if(windowSafeDistant(key)){refs.add('siraj');refs.add('mughni');}if(!refs.size)refs.add('scope');
 return [...refs];
}
const api={sources,forRow};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FaraidReferences=api;
})(typeof globalThis==='undefined'?this:globalThis);
