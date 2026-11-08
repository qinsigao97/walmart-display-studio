// Local commercial estimates. MSRP is an assumed selling price, not verified retailer IMU.
export const pricingFields=['firstCost','msrp','additional','freight','duty','other'];
export function pricing(sku){return sku.economics??{firstCost:sku.cost??null,msrp:sku.price??null,additional:null,freight:null,duty:null,other:null,mode:'direct'};}
export function validateEconomics(sku){const p=pricing(sku);if(!['direct','separate'].includes(p.mode)||pricingFields.some(k=>p[k]!==null&&(!Number.isFinite(p[k])||p[k]<0)))throw Error(`${sku.sku}: economics must be blank or finite, nonnegative values.`);return p;}
// Decimal additions/products avoid binary-cent drift without rounding unit inputs.
function parts(n){const [mantissa,exp='0']=String(n).split(/e/i),fraction=mantissa.split('.')[1]?.length??0;let scale=fraction-Number(exp),integer=BigInt(mantissa.replace('.',''));if(scale<0){integer*=10n**BigInt(-scale);scale=0;}return {integer,scale};}
function add(...values){if(values.some(n=>!Number.isFinite(n)))return values.reduce((a,b)=>a+b,0);const p=values.map(parts),scale=Math.max(...p.map(p=>p.scale)),integer=p.reduce((n,p)=>n+p.integer*10n**BigInt(scale-p.scale),0n);return Number(`${integer}e-${scale}`);}
function multiply(a,b){if(!Number.isFinite(a)||!Number.isFinite(b))return a*b;const x=parts(a),y=parts(b);return Number(`${x.integer*y.integer}e-${x.scale+y.scale}`);}
const valid=v=>Number.isFinite(v)&&v>=0;
const safe=v=>Number.isFinite(v)?v:null;
export const money=v=>v===null||!Number.isFinite(v)?'—':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(v);
const roundText=v=>new Intl.NumberFormat('en-US',{useGrouping:false,minimumFractionDigits:2,maximumFractionDigits:2}).format(v);
export const percent=v=>v===null||!Number.isFinite(v)?'—':`${roundText(v)}%`;
export function unitEconomics(sku,basis='first'){
 const p=pricing(sku),issues=[];
 for(const k of pricingFields)if(p[k]!==null&&!valid(p[k]))issues.push(`${k}: enter a nonnegative number`);
 const first=valid(p.firstCost)?p.firstCost:null,msrp=valid(p.msrp)&&p.msrp>0?p.msrp:null;
 if(msrp===null)issues.push(p.msrp===0?'MSRP must be greater than zero':'MSRP missing or invalid');
 if(first===null)issues.push('First Cost missing or invalid');
 const extra=p.mode==='direct'?(valid(p.additional)?p.additional:null):['freight','duty','other'].every(k=>valid(p[k]))?safe(add(p.freight,p.duty,p.other)):null;
 if(extra===null)issues.push(p.mode==='separate'?'Enter Freight, Duty and Other (explicit 0 allowed)':'Additional Unit Cost missing or invalid');
 const landed=first!==null&&extra!==null?safe(add(first,extra)):null,cost=basis==='landed'?landed:first;
 const firstIMU=msrp!==null&&first!==null?safe(add(msrp,-first)/msrp*100):null,landedIMU=msrp!==null&&landed!==null?safe(add(msrp,-landed)/msrp*100):null;
 const profit=msrp!==null&&cost!==null?safe(add(msrp,-cost)):null;
 if(first!==null&&extra!==null&&landed===null)issues.push('Landed cost exceeds the supported numeric range');
 if(msrp!==null&&first!==null&&firstIMU===null)issues.push('First Cost margin exceeds the supported numeric range');if(msrp!==null&&landed!==null&&landedIMU===null)issues.push('Landed margin exceeds the supported numeric range');
 return {enteredMSRP:valid(p.msrp)?p.msrp:null,first,msrp,extra,landed,firstIMU,landedIMU,profit,cost,basis,issues,complete:issues.length===0};
}
export function displayEconomics(result,catalog,basis='first'){
 const rows=catalog.map(p=>({...unitEconomics(p,basis),id:p.id,sku:p.sku,name:p.name,quantity:result.counts[p.id]??0})).filter(p=>p.quantity>0);
 for(const row of rows)for(const [key,unit] of Object.entries({retail:row.msrp,firstTotal:row.first,landedTotal:row.landed}))row[key]=unit===null?null:safe(multiply(unit,row.quantity));
 const sum=key=>{let value=0,missingUnits=0,missingSKUs=[];for(const row of rows){if(row[key]===null){missingUnits+=row.quantity;missingSKUs.push(row.sku);}else value=add(value,row[key]);}const unitKey={retail:'msrp',firstTotal:'first',landedTotal:'landed'}[key],overflow=!Number.isFinite(value)||rows.some(row=>row[key]===null&&row[unitKey]!==null);return {value:overflow?null:value,complete:!overflow&&!missingUnits,missingUnits,missingSKUs,overflow};};
 const retail=sum('retail'),first=sum('firstTotal'),landed=sum('landedTotal'),selected=basis==='landed'?landed:first,layoutValid=!!result.valid;
 let complete=layoutValid&&retail.complete&&selected.complete;
 const profit=complete?safe(add(retail.value,-selected.value)):null,imu=complete&&retail.value>0?safe(add(retail.value,-selected.value)/retail.value*100):null;
 const numericRange=complete&&(profit===null||retail.value>0&&imu===null);if(numericRange)complete=false;
 return {numericRange,rows,units:result.total,basis,retail,first,landed,selected,profit,imu,complete,layoutValid};
}
const cell=v=>{let s=v===null||v===undefined?'':String(v);if(typeof v==='string'&&/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
const decimal=v=>v===null||!Number.isFinite(v)?null:Number(roundText(v));
export function economicsCSV(project,result,displayType,date=new Date()){
 const basis=project.economicsBasis??'first',r=displayEconomics(result,project.catalog,basis),s=project.templates[project.type];
 const header=['Record','Project Name','Display Type','Width in','Depth in','Height in','Export Date','Currency','Cost Basis','Item Number','Product Description','Display Quantity','First Cost','MSRP','Additional Unit Cost','Landed Cost','First Cost IMU %','Landed Cost IMU %','Gross Profit per Unit','Total Retail Value','Total First Cost','Total Landed Cost','Estimated Gross Profit','Weighted Display IMU %','Data Status'];
 const meta=[project.name,displayType,s.width,s.depth,s.height,date.toISOString(),'USD',basis==='landed'?'Estimated Landed Cost':'First Cost'];
 const rows=r.rows.map(p=>['SKU',...meta,p.sku,p.name,p.quantity,decimal(p.first),decimal(p.enteredMSRP),decimal(p.extra),decimal(p.landed),decimal(p.firstIMU),decimal(p.landedIMU),decimal(p.profit),decimal(p.retail),decimal(p.firstTotal),decimal(p.landedTotal),p.profit===null?null:decimal(multiply(p.profit,p.quantity)),p.msrp===null||p.cost===null?null:decimal(basis==='landed'?p.landedIMU:p.firstIMU),p.issues.length?'Incomplete: '+p.issues.join('; '):p.retail===null||p.firstTotal===null||p.landedTotal===null?'Incomplete: numeric range exceeded':'Complete']);
 const status=!r.layoutValid?'INVALID LAYOUT':r.complete?'Complete for selected basis':'INCOMPLETE — known subtotals only';
 rows.push(['TOTAL',...meta,'','',r.units,null,null,null,null,null,null,null,decimal(r.retail.value),decimal(r.first.value),decimal(r.landed.value),decimal(r.profit),decimal(r.imu),`${status}; retail missing ${r.retail.missingUnits} units; first cost missing ${r.first.missingUnits}; landed missing ${r.landed.missingUnits}`]);
 return '\ufeff'+[header,...rows].map(row=>row.map(cell).join(',')).join('\r\n')+'\r\n';
}
