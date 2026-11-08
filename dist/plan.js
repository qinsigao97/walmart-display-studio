import {calculate,defaults} from './layout.js';
import {newStyles,isNewStyle,phase3Preset,phase3Surfaces,phase3Notes,splitWidth} from './phase3-layout.js';
export const styles={half:'Half Pallet · Shelf',waterfall:'Half Pallet · Waterfall',single:'Single-Height Tray',tray:'High Back / Stadium Tray',...newStyles};
export const pallet=t=>['half','waterfall','full','stack'].includes(t);
export const shelves=t=>['half','full','stack','end36','end48'].includes(t);
export function preset(type){if(isNewStyle(type))return phase3Preset(type,defaults);return {...defaults,type,color:'#e7e4dc',dividers:false,compartments:2,dividerPositions:[],shelfDepths:[],removalClearance:0,guideWarnings:true,sign:false,risers:0,tierHeights:[],tierDepths:[],slots:{},...(type==='waterfall'?{levels:4}:{}),...(!pallet(type)?{width:29.5,depth:14,height:12,base:0,header:0,levels:1,lip:2,ph:10,pw:5,pd:3}:{} )};}
export function newSku(id='sku-1'){return {id,sku:id.toUpperCase(),name:'Untitled product',w:7.5,d:4.5,h:10,price:null,cost:null,color:'#ddd9cf',representation:'box',rotate:false,stackable:false,stackCount:1,art:null,original:null,model:null,crop:{x:0,y:0,w:100,h:100,mask:false,tolerance:25}};}
export function surfaces(s){
 if(isNewStyle(s.type))return phase3Surfaces(s);
 const issues=[];const vals=['width','depth','height','base','header','board','lip','gap','levels'];
 if(vals.some(k=>!Number.isFinite(s[k]))||['width','depth','height','board'].some(k=>s[k]<=0)||['base','header','lip','gap'].some(k=>s[k]<0)||!Number.isInteger(s.levels)||s.levels<1||s.levels>12||s.width>120||s.depth>80||s.height>120||!styles[s.type])return {issues:['Enter valid dimensions: W/H ≤120 in, D ≤80 in, and 1–12 whole tiers.'],surfaces:[]};
 if(!pallet(s.type)&&(s.base!==0||s.header!==0||s.levels!==1))issues.push('Tray formats require one tray, no pallet, and no header. Use stadium risers for supported steps.');
 const B=s.board,iw=s.width-2*B,id=s.depth-2*B,body=s.height-s.base-s.header;
 if(iw<=0||id<=0||body<=B||s.lip>=body) return {issues:[...issues,'Board, base, header, or lip leaves no usable merchandise space.'],surfaces:[]};
 const stepped=s.type==='waterfall'||(s.type==='tray'&&s.risers>0),n=stepped?(s.type==='tray'?s.risers+1:s.levels):(s.type==='half'?s.levels:1);
 if(!Number.isInteger(n)||n<1||n>12)return {issues:['Use 1–12 whole steps.'],surfaces:[]};
 const result=[];let rise=0,zFront=s.depth/2-B;
 for(let i=0;i<n;i++){
  let floor,clear,depth,z;
  if(stepped){const step=s.tierHeights?.[i]??(i===0?0:body/n);if(!Number.isFinite(step)||step<0)issues.push(`Tier ${i+1}: rise must be nonnegative.`);rise+=step;floor=s.base+rise+B;clear=body-rise-B;depth=s.tierDepths?.[i]??id/n;z=zFront-depth/2;zFront-=depth;if(!Number.isFinite(depth)||depth<=B)issues.push(`Tier ${i+1}: enter a positive usable depth.`);}
  else{const pitch=s.tierHeights?.[i]??body/n;floor=s.base+rise+B;clear=pitch-B-(s.type==='half'&&i<n-1?.6:0);depth=id;z=0;rise+=pitch;if(!Number.isFinite(pitch)||pitch<=B)issues.push(`Tier ${i+1}: shelf pitch must exceed board thickness.`);}
  if(clear<=s.lip||floor+clear>s.height-s.header+.001)issues.push(`Tier ${i+1}: no valid clear opening.`);
  const count=s.dividers?(s.compartments??2):1;if(!Number.isInteger(count)||count<1||count>6){issues.push('Use 1–6 whole compartments.');return {issues,surfaces:[]};}let parts;try{parts=splitWidth(iw,B,count,s.dividers?s.dividerPositions:[]);}catch(e){return {issues:[e.message],surfaces:[]};}
  if(s.type==='half'&&s.shelfDepths?.[i]!==undefined){const d=s.shelfDepths[i];if(!Number.isFinite(d)||d<=B||d>id)issues.push(`Shelf ${i+1}: usable depth must be within ${id.toFixed(2)} in.`);else{depth=d;z=(id-d)/2;}}
  for(let c=0;c<count;c++)result.push({id:`${i}:${c}`,tier:i,comp:c,w:parts[c].w,d:depth,x:parts[c].x,z,y:floor,clear,lip:s.lip});
 }
 if(!stepped&&Math.abs(rise-body)>.01)issues.push(`Shelf pitches must sum to ${body.toFixed(2)} in (currently ${rise.toFixed(2)}).`);
 if(stepped&&Math.abs(zFront-(-s.depth/2+B))>.01)issues.push(`Step depths must sum to ${id.toFixed(2)} in.`);
 return {issues,surfaces:result,body,iw,id,stepped};
}
export function plan(s,catalog){
 const structure=surfaces(s),issues=[...structure.issues],placements=[],groups=[],counts={};let capacity=0,area=0,occupied=0;
 const codes=new Set();for(const p of catalog){if(typeof p.sku!=='string'||!p.sku.trim()||codes.has(p.sku.trim()))issues.push('Each SKU needs a nonempty, unique code.');else codes.add(p.sku.trim());if(p.cost!=null&&(!Number.isFinite(p.cost)||p.cost<0))issues.push(`${p.sku}: cost must be blank or nonnegative.`);if(p.price!==null&&(!Number.isFinite(p.price)||p.price<0))issues.push(`${p.sku}: price must be blank or a nonnegative number.`);}
 if(issues.length)return {...structure,valid:false,previewable:false,issues,placements,groups,total:0,capacity:0,unused:0,counts,util:0};
 const products=new Map(catalog.map(p=>[p.id,p]));
 for(const surf of structure.surfaces){area+=surf.w*surf.d;const slot=s.slots?.[surf.id];const p=products.get(slot?.sku);const fail=(message,extra={})=>{issues.push(message);groups.push({...surf,product:p??null,cols:0,rows:0,stacks:1,capacity:0,total:0,...extra,issue:message});};if(!p){if(slot?.sku)fail(`${surf.id}: assigned SKU no longer exists.`);else groups.push({...surf,product:null,capacity:0,total:0});continue;}
  if(['w','h','d'].some(k=>!Number.isFinite(p[k])||p[k]<.05)||!Number.isFinite(p.stackCount)||!Number.isInteger(p.stackCount)||p.stackCount<1||p.stackCount>12){fail(`${p.sku}: enter dimensions ≥0.05 in and a whole stack count of 1–12.`);continue;}
  if(p.representation==='model'&&!p.model){fail(`${p.sku}: upload a model or select another representation.`);continue;}
  if(p.representation==='reference'&&!p.art){fail(`${p.sku}: the reference kit needs its calibrated photograph.`);continue;}
  if(s.lip>=p.h){fail(`${p.sku}: the front lip hides the full product height. Reduce lip height or change the product.`);continue;}
  const stacks=p.stackable&&p.representation==='box'?p.stackCount:1;
  const r=calculate({...defaults,width:surf.w+2*s.board,depth:surf.d+2*s.board,height:surf.clear+s.board-(s.removalClearance??0),base:0,header:0,levels:1,board:s.board,lip:s.lip,pw:p.w,pd:p.d,ph:p.h*stacks,gap:s.gap,rotate:p.rotate});
  if(r.error){const available=surf.clear-(s.removalClearance??0),height=p.h*stacks;const detail=!r.fits?`needs ${height.toFixed(2)} in product height, but this opening allows ${available.toFixed(2)} in after ${(s.removalClearance??0).toFixed(2)} in removal clearance. Reduce tiers / increase shelf spacing, or correct the SKU dimensions.`:!r.cols||!r.rows?`product footprint ${r.w.toFixed(2)} × ${r.d.toFixed(2)} in exceeds this ${surf.w.toFixed(2)} × ${surf.d.toFixed(2)} in zone. Check dimensions or rotate the footprint.`:r.error;fail(`${p.sku}, ${surf.face??'shelf'} · tier ${surf.tier+1}${s.dividers?`, compartment ${surf.comp+1}`:''}: ${detail}`);continue;}
  let cols=r.cols;if(slot.facings!==undefined&&slot.facings!==null&&slot.facings!==''){if(!Number.isInteger(slot.facings)||slot.facings<1||slot.facings>r.cols){fail(`${p.sku}: facings must be 1–${r.cols}.`,{kind:'limits',cols:r.cols,rows:r.rows,stacks,capacity:r.cols*r.rows*stacks});continue;}cols=slot.facings;}
  let rows=r.rows;if(slot.rows!=null&&slot.rows!==''){if(!Number.isInteger(slot.rows)||slot.rows<1||slot.rows>r.rows){fail(`${p.sku}: units deep must be 1–${r.rows}.`,{kind:'limits',cols:r.cols,rows:r.rows,stacks,capacity:r.cols*r.rows*stacks});continue;}rows=slot.rows;}
  const cap=cols*rows*stacks;let qty=slot.qty===null||slot.qty===undefined||slot.qty===''?cap:slot.qty;
  if(!Number.isInteger(qty)||qty<0||qty>cap){fail(`${p.sku}: quantity must be 0–${cap}.`,{cols,rows,stacks,capacity:cap,kind:'limits'});continue;}
  capacity+=cap;
  const group={...surf,product:p,cols,rows,stacks,capacity:cap,total:qty};groups.push(group);counts[p.id]=(counts[p.id]||0)+qty;
  // Front-most positions fill first, then back; each stack is physically supported.
  let left=qty;const usedW=cols*r.w+(cols-1)*s.gap;
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++)for(let v=0;v<stacks&&left>0;v++,left--){const lx=-usedW/2+r.w/2+col*(r.w+s.gap),lz=surf.d/2-r.d/2-row*(r.d+s.gap),angle=surf.angle||0,c=Math.cos(angle),n=Math.sin(angle),side=Math.abs(n)>.5;placements.push({sku:p.id,slot:surf.id,x:surf.x+lx*c+lz*n,y:surf.y+v*p.h,z:surf.z-lx*n+lz*c,w:side?r.d:r.w,h:p.h,d:side?r.w:r.d,rotation:angle+(p.rotate?Math.PI/2:0)});occupied+=r.w*r.d/stacks;}
 }
 if(placements.length>2400)issues.push('Preview limit is 2,400 units. Reduce quantities before rendering/exporting.');
 return {...structure,valid:issues.length===0,previewable:placements.length<=2400,issues,placements,groups,total:placements.length,capacity,unused:capacity-placements.length,counts,util:area?occupied/area*100:0};
}
export function referenceNotes(s){if(s.guideWarnings===false)return ['Historical dimension warnings are hidden. Geometry checks remain active.'];if(isNewStyle(s.type))return phase3Notes(s);const a=[];if(pallet(s.type)){if(s.width!==48||s.depth!==20)a.push('Reference footprint: 48 × 20 in.');if(s.height-s.base-s.header>(s.guideBodyMax??43))a.push('Body exceeds the 43 in reference.');if(s.header>8)a.push('Header exceeds the 8 in reference.');if(s.base!==5)a.push('Reference pallet is 5 in tall.');}else{if(s.depth>(s.guideTrayMax??14))a.push('Tray depth exceeds the 14 in reference.');if(s.lip<2)a.push('Front lip is below the 2 in reference.');if(![29.5,35.5,47.5].includes(s.width))a.push('Select a shelf class or confirm combined tray width is ½ in below shelf width.');}return a;}

export function totals(result,catalog){let cost=0,retail=0,missingCost=0,missingPrice=0;for(const p of catalog){const n=result.counts[p.id]||0;if(p.cost==null)missingCost+=n;else cost+=n*p.cost;if(p.price==null)missingPrice+=n;else retail+=n*p.price;}return {cost,retail,missingCost,missingPrice};}

// Suggestions are explicit UI actions; SKU dimensions and saved allocations stay intact.
export function fitTierCount(s,catalog){if(!['full','stack'].includes(s.type)||!Number.isInteger(s.levels)||s.levels<2)return null;const current=plan(s,catalog);if(!current.groups.some(g=>g.issue&&g.product&&g.product.h*(g.product.stackable&&g.product.representation==='box'?g.product.stackCount:1)>g.clear-(s.removalClearance??0)+1e-8))return null;const active=new Set(current.surfaces.map(g=>g.id)),assigned=new Set(Object.entries(s.slots??{}).filter(([id,a])=>active.has(id)&&a.sku).map(([,a])=>a.sku));if(!assigned.size)return null;const slots=Object.fromEntries(Object.entries(s.slots??{}).map(([id,a])=>[id,{...a,facings:null,rows:null,qty:null}]));for(let n=s.levels-1;n>=1;n--){const r=plan({...s,slots,levels:n,tierHeights:[]},catalog);const retained=new Set(r.groups.map(g=>g.product?.id).filter(Boolean));if(r.valid&&[...assigned].every(id=>retained.has(id)))return n;}return null;}
