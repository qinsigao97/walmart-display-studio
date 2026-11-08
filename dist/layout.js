export const defaults={type:'half',width:48,depth:20,height:56,pw:7.5,pd:4.5,ph:10,gap:.25,levels:4,lip:2.5,board:.15,base:5,header:8,rotate:false};
export function guideChecks(s){const notes=[];if(s.type==='half'){if(!((s.width===48&&s.depth===20)||(s.width===20&&s.depth===48)))notes.push('Half-pallet reference footprint is 48 × 20 in (p.20).');if(s.height-s.base-s.header>43)notes.push('Display body exceeds 43 in (p.20).');if(s.header>8)notes.push('Header exceeds 8 in (p.24).');if(s.base!==5)notes.push('Reference pallet height is 5 in (p.20).');}else{if(s.depth>14)notes.push('PDQ tray depth exceeds 14 in (p.27).');if(s.lip<2)notes.push('Front lip is below 2 in (p.28).');if(s.height-s.base<s.ph+s.board)notes.push('Back must reach the full product height (p.28).');if(s.levels!==1)notes.push('High-back preset represents a single tray; stacking requires separate engineering.');}return notes;}
export function calculate(s){
 const keys=['width','depth','height','pw','pd','ph','gap','levels','lip','board','base','header'];
 if(keys.some(k=>!Number.isFinite(s[k]))||['width','depth','height','pw','pd','ph','levels','board'].some(k=>s[k]<=0)||['gap','lip','base','header'].some(k=>s[k]<0)||!Number.isInteger(s.levels)) return {valid:false,error:'Enter positive dimensions and a whole number of tiers.'};
 if(s.width>120||s.depth>80||s.height>120||s.levels>12) return {valid:false,error:'Prototype limits: 120 in W/H, 80 in D, 12 tiers.'};
 const w=s.rotate?s.pd:s.pw,d=s.rotate?s.pw:s.pd;
 const iw=s.width-2*s.board,id=s.depth-2*s.board;
 const cols=Math.max(0,Math.floor((iw+s.gap)/(w+s.gap)+1e-9)),rows=Math.max(0,Math.floor((id+s.gap)/(d+s.gap)+1e-9));
 const usable=s.height-s.base-s.header;
 const pitch=usable/s.levels;
 const fits=pitch>=Math.max(s.ph,s.lip)+s.board;
 const per=cols*rows,total=fits?per*s.levels:0;
 return {valid:true,w,d,iw,id,cols,rows,pitch,usable,fits,per,total,usedW:cols?w*cols+s.gap*(cols-1):0,usedD:rows?d*rows+s.gap*(rows-1):0,util:per?w*d*per/(iw*id)*100:0,error:!fits?'Product or tray lip is taller than the available tier opening.':!per?'Product does not fit the usable tray footprint.':total>600?'More than 600 units: reduce the configuration to preview.':null};
}
