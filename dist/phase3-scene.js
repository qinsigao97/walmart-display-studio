import * as T from 'three';
import {isNewStyle,isEndcap} from './phase3-layout.js';

// Structure consumes the same zones, levels and modules as the placement engine.
export async function buildPhase3(e,s,r,branding){
 if(!isNewStyle(s.type))return false;
 const B=s.board,top=s.height-s.header,steel=e.material(new T.MeshStandardMaterial({color:'#e2e3df',roughness:.62,metalness:.25})),dark=e.material(new T.MeshStandardMaterial({color:'#626967',roughness:.8}));
 const localBox=(zone,w,h,d,x,y,z,mat=e.paper)=>{const a=zone.angle||0,c=Math.cos(a),n=Math.sin(a);const m=e.box(w,h,d,zone.x+x*c+z*n,y,zone.z-x*n+z*c,mat);if(m)m.rotation.y=a;return m;};
 const partitions=(zone,height)=>{if(!s.dividers)return;const a=r.surfaces.filter(x=>x.key===zone.key);for(const p of a.slice(0,-1)){const angle=zone.angle||0,dx=p.x-zone.x,dz=p.z-zone.z,x=dx*Math.cos(angle)-dz*Math.sin(angle)+p.w/2+B/2;localBox(zone,B,height,zone.d,x,zone.y+height/2,0,e.inside);}};
 const lip=(zone,w=zone.w,offset=0,mat=e.paper)=>{localBox(zone,w,s.lip,B,0,zone.y+s.lip/2,zone.d/2+B/2+offset,mat);localBox(zone,w,B*.45,B,0,zone.y+s.lip-B*.225,zone.d/2+B/2+offset,mat);};
 if(s.type==='full'){
  e.woodPallet({...s,width:s.palletWidth,depth:s.palletDepth});
  for(const x of [-s.width/2+.3,s.width/2-.3])for(const z of [-s.depth/2+.3,s.depth/2-.3]){e.box(.55,r.body,.55,x,s.base+r.body/2,z,e.paper);e.box(.16,r.body,.75,x,s.base+r.body/2,z,e.inside);}
  for(const l of r.levels){e.box(s.width-1.2,l.deck,s.depth-1.2,0,l.y-l.deck/2,0,e.inside);for(const z of [-s.depth/2+.7,s.depth/2-.7])e.box(s.width-1.2,.55,.25,0,l.y-l.deck-.275,z,e.support);}
  if(s.faces===2){for(const x of [-s.width/2+B/2,s.width/2-B/2])e.box(B,r.body,s.depth,x,s.base+r.body/2,0);e.box(r.iw,r.body,B,0,s.base+r.body/2,0);}
  else{for(const z of [-r.id/4,r.id/4])e.box(r.iw,r.body,B,0,s.base+r.body/2,z);e.box(B,r.body,r.id/2,0,s.base+r.body/2,0);}
  for(const z of r.zones){lip(z);partitions(z,z.clear);}
  if(s.header>0){e.box(s.width,s.header,B,0,s.height-s.header/2,0);for(const sign of [1,-1]){const a=e.artwork(await e.assets.image(branding.header),s.width-.4,s.header-.4,0,s.height-s.header/2,sign*(B/2+.008));if(a&&sign<0)a.rotation.y=Math.PI;}}
 }else if(s.type==='stack'){
  e.woodPallet({...s,width:s.palletWidth,depth:s.palletDepth});
  for(const m of r.modules){localBox(m,m.w,B,m.d,0,m.bottom+B/2,0,e.inside);const postH=m.pitch-B;
   for(const x of [-m.w/2+m.post/2,m.w/2-m.post/2])for(const z of [-m.d/2+m.post/2,m.d/2-m.post/2]){localBox(m,m.post,postH,m.post,x,m.bottom+B+postH/2,z);localBox(m,.12,.28,.26,x,m.bottom+m.pitch+.1,z,e.inside);localBox(m,.22,.035,.31,x,m.bottom+.02,z,dark);}
   for(const x of [-m.w/2+B/2,m.w/2-B/2]){localBox(m,B,s.lip,m.d,x,m.y+s.lip/2,0);localBox(m,B,.4,m.d,x,m.bottom+m.pitch-.2,0);}
   for(const z of [-m.d/2+B/2,m.d/2-B/2])localBox(m,m.w,s.lip,B,0,m.y+s.lip/2,z);
   // Folded side shoulders and the rear compression panel make each module a tray,
   // with its upper deck supported by board rather than a floating shelf.
   localBox(m,m.w,m.pitch-B,B,0,m.y+(m.pitch-B)/2,-m.d/2+B/2);
   for(const side of [-1,1]){const sh=new T.Shape();sh.moveTo(-m.d/2,0);sh.lineTo(m.d/2,0);sh.lineTo(m.d/2,m.pitch-B);sh.lineTo(-m.d/2,Math.min(m.pitch-B,s.lip+1));sh.closePath();const geo=e.geometry(new T.ExtrudeGeometry(sh,{depth:B,bevelEnabled:false}));geo.rotateY(Math.PI/2);const panel=new T.Mesh(geo,e.paper),group=new T.Group();panel.position.set(side<0?-m.w/2:m.w/2-B,m.y,0);panel.castShadow=true;panel.receiveShadow=true;group.position.set(m.x,0,m.z);group.rotation.y=m.angle;group.add(panel);e.root.add(group);}
   const zone=r.zones.find(z=>z.tier===m.tier&&z.module===m.module);partitions(zone,Math.min(zone.clear,4));
  }
 }else if(s.type==='flange'){
  const w=s.width-2*s.flangeExtent;
  e.box(w,B,s.depth,0,B/2,0,e.inside);e.box(w,s.lip,B,0,B+s.lip/2,s.depth/2-B/2);e.foldedEdge(w,B+s.lip,s.depth/2-B/2,B);e.box(w,s.rearHeight,B,0,B+s.rearHeight/2,-s.depth/2+B/2);
  for(const side of [-1,1]){const x=side*(w/2-B/2);e.box(B,s.flangeHeight,s.depth,x,B+s.flangeHeight/2,0);const shape=new T.Shape(),D=s.depth,R=Math.min(.8,s.flangeExtent/2),F=s.flangeExtent;shape.moveTo(0,-D/2);shape.lineTo(F-R,-D/2);shape.quadraticCurveTo(F,-D/2,F,-D/2+R);shape.lineTo(F,D/2-R);shape.quadraticCurveTo(F,D/2,F-R,D/2);shape.lineTo(0,D/2);shape.closePath();const geo=e.geometry(new T.ExtrudeGeometry(shape,{depth:B,bevelEnabled:false}));geo.rotateX(Math.PI/2);const wing=new T.Mesh(geo,e.paper);wing.scale.x=side;wing.position.set(side*w/2,B+s.flangeHeight,0);wing.castShadow=true;wing.receiveShadow=true;e.root.add(wing);e.box(B,.6,s.depth-.5,side*(w/2+F-.1),B+s.flangeHeight-.3,0,e.inside);if(s.retention)for(const z of [-s.depth/4,s.depth/4])e.box(.3,1,.5,side*(w/2-.15),B+.5,z,e.paper);}
  partitions(r.zones[0],Math.min(s.rearHeight,s.height-B));
 }else if(isEndcap(s.type)){
  const W=s.fixtureWidth,D=s.fixtureDepth,H=s.fixtureHeight,rear=-D/2;
  e.box(W,.3,D,0,s.base-.15,0,steel);e.box(W,s.base-.3,.2,0,(s.base-.3)/2,D/2-.1,steel);for(const x of [-W/2+.55,W/2-.55]){e.box(.9,H,1.25,x,H/2,rear+.6,steel);e.box(.5,1.5,D,x,.75,0,steel);}
  e.box(W-1.5,H-s.base-.3,.14,0,(H+s.base)/2,rear+.72,steel);
  const holes=[];for(let y=s.base+1;y<H-1;y+=1.5)for(let x=-W/2+1.8;x<W/2-1.8;x+=1.5)holes.push([x,y]);const mesh=new T.InstancedMesh(e.geometry(new T.CircleGeometry(.055,8)),dark,holes.length),matrix=new T.Matrix4();holes.forEach(([x,y],i)=>{matrix.makeTranslation(x,y,rear+.801);mesh.setMatrixAt(i,matrix);});e.root.add(mesh);
  const corr=s.endcapMode==='corrugated',mat=corr?e.paper:steel;
  if(corr){e.box(s.width,top-s.base,B,0,(top+s.base)/2,(D-s.depth)/2-s.depth/2+B/2);for(const side of [-1,1])e.box(B*2,top-s.base,s.depth,side*(s.width/2-B),(top+s.base)/2,(D-s.depth)/2);for(const y of [s.base+3,top-3])for(const side of [-1,1]){e.box(.35,.6,Math.max(.2,D-s.depth+.5),side*(s.width/2-.6),y,rear+(D-s.depth)/2+.5,dark);}}
  for(const z of r.zones){e.box(s.width,z.deck,z.outerDepth,0,z.y-z.deck/2,z.z,corr?e.inside:steel);lip(z,s.width-2*B,0,mat);for(const side of [-1,1]){const x=side*(s.width/2-.7);e.box(.18,.6,z.outerDepth-.25,x,z.y-z.deck-.3,z.z,steel);e.box(.18,1.4,.35,x,z.y-z.deck-.7,z.z-z.outerDepth/2+.3,steel);}partitions(z,Math.min(z.clear,corr?4:2));}
  if(s.header>0){e.box(s.width,s.header,B,0,s.height-s.header/2,D/2-s.depth+B);e.artwork(await e.assets.image(branding.header),s.width-.4,s.header-.4,0,s.height-s.header/2,D/2-s.depth+B*1.6);}
 }
 const fascia=await e.assets.image(branding.fascia);for(const z of r.zones){const a=z.angle||0;const mesh=e.artwork(fascia,z.w-.2,s.lip-.1,z.x+Math.sin(a)*(z.d/2+B+.01),z.y+s.lip/2,z.z+Math.cos(a)*(z.d/2+B+.01));if(mesh)mesh.rotation.y=a;}
 const closedSides=s.type==='full'&&s.faces===2||s.type==='flange'||isEndcap(s.type)&&s.endcapMode==='corrugated';
 if(closedSides){const w=s.type==='flange'?s.width-2*s.flangeExtent:s.width,h=s.type==='flange'?s.flangeHeight:top-s.base,y=s.type==='flange'?B+h/2:s.base+h/2,z=isEndcap(s.type)?(s.fixtureDepth-s.depth)/2:0;for(const side of [-1,1])e.artwork(await e.assets.image(branding[side>0?'side':'left']),s.depth-.4,h-.4,side*(w/2+.01),y,z,side>0?'side':'left');}
 if(s.type==='stack')for(const m of r.modules)for(const side of [-1,1]){const x=side*(m.w/2+.01),a=m.angle,mesh=e.artwork(await e.assets.image(branding[side>0?'side':'left']),m.d-.4,s.lip-.2,m.x+x*Math.cos(a),m.y+s.lip/2,m.z-x*Math.sin(a));if(mesh)mesh.rotation.y=a+side*Math.PI/2;}
 if(s.sign&&s.type==='full'){for(const x of [-s.width*.3,s.width*.3])e.box(.22,12,.22,x,s.height+2,0,steel);e.box(s.width*.72,5,.25,0,s.height+6,0,steel);}
 return true;
}

export function setEnvironment(e,mode='studio'){
 if(mode==='store'&&!e.store){const g=new T.Group(),steel=new T.MeshStandardMaterial({color:'#a4aaa7',roughness:.8}),floor=new T.MeshStandardMaterial({color:'#bcbdb7',roughness:.94}),light=new T.MeshStandardMaterial({color:'#ffffff',emissive:'#fff8dc',emissiveIntensity:1.2});const add=(w,h,d,x,y,z,m)=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;g.add(o);};add(1800,.2,1800,0,-.15,0,floor);for(const x of [-140,140]){add(.3,70,320,x,35,-60,steel);for(const z of [-210,-158,-106,-54,-2,50,98])add(.6,72,.6,x,36,z,steel);for(let y=12;y<75;y+=14){add(42,.4,320,x,y,-60,steel);for(let z=-200;z<100;z+=18)for(const side of [-1,1])add(10,8,13,x+side*12,y+4.2,z,steel);}}for(const x of [-100,100])for(const z of [-150,0,150])add(5,.4,100,x,190,z,light);e.store=g;e.scene.add(g);}
 e.environmentMode=mode;if(e.store)e.store.visible=mode==='store';e.scene.background=new T.Color(mode==='store'?'#d9dcd8':'#ffffff');e.scene.fog=mode==='store'?new T.Fog('#d9dcd8',220,650):null;
}
