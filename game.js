import * as T from 'three';
import {createDioramaOrbit} from './vendor/orbit.js';
const $ = id => document.getElementById(id);
const canvas = $('scene'), scene = new T.Scene(), camera = new T.PerspectiveCamera(34,1,.1,80);
const renderer = new T.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
scene.add(new T.HemisphereLight(0xdde6ff,0x885744,1.12));
const fill=new T.DirectionalLight(0xffddb3,1.45);
fill.position.set(-4,8,5);scene.add(fill);
function part(geom,color,x,y,z,parent=scene){
 const obj=new T.Mesh(geom,new T.MeshStandardMaterial({color,roughness:.82}));
 obj.position.set(x,y,z);obj.castShadow=obj.receiveShadow=true;parent.add(obj);return obj;
}
function box(x,y,z,w,h,d,c,p){return part(new T.BoxGeometry(w,h,d),c,x,y,z,p)}
function cyl(x,y,z,rt,rb,h,c,p){return part(new T.CylinderGeometry(rt,rb,h,16),c,x,y,z,p)}
function group(x,y,z,p=scene){const g=new T.Group();g.position.set(x,y,z);p.add(g);return g}
function sign(label,bg,fg,x,y,z,w,h,p=scene){
 const c=document.createElement('canvas');c.width=768;c.height=192;
 const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,768,192);
 ctx.strokeStyle=fg;ctx.lineWidth=4;ctx.strokeRect(12,12,744,168);
 ctx.fillStyle=fg;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 104px serif';ctx.fillText(label,384,98,712);
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;
 const obj=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map}));obj.position.set(x,y,z);p.add(obj);return obj;
}
const jade=0x32736a, cream=0xf3ce8f, wood=0x8f4c31, brass=0xcba266, iron=0x303b40;
box(0,-.24,0,7.9,.34,4.3,0x39434b);box(0,-.03,0,7.6,.14,4,0x9c8771);
for(let x=-3.4;x<=3.5;x+=.58)box(x,.05,1.61,.48,.035,.25,0x6b7777);
box(0,.60,.53,6.55,1.1,1.62,jade);
for(let x=-3;x<=3;x+=.5)box(x,.59,1.35,.025,.90,.025,0x26524e);
box(0,1.19,.5,6.8,.14,1.9,0x9b826c);box(0,1.11,1.45,6.81,.10,.075,brass);
sign('深 夜 食 堂','#853f30','#ffdf9d',0,.62,1.37,2.1,.52);
for(const x of [-3.15,3.15])box(x,1.78,-1.05,.12,3.45,.12,wood);
box(0,2,-1.28,6.38,3.5,.13,0x754c38);
for(let i=0;i<16;i++)box(-3+i*.40,2,-1.17,.022,3.35,.035,wood);
box(0,2.14,-.99,5.8,.09,.38,wood);
for(let i=0;i<7;i++){const x=-2.65+i*.3;cyl(x,2.33,-.96,.10,.12,.28,[cream,jade,0xb24b37][i%3]);cyl(x,2.49,-.96,.105,.105,.04,iron)}
const shutter=group(0,3.38,-.78);
for(let i=0;i<15;i++)box(0,-.077-i*.15,0,5.95,.145,.095,0x637778,shutter);
// Sewn canvas follows a curved frame. The scallops share the roof's stripe spacing.
function oval(x,y,z,w,h,d,color,parent=scene){
 const mesh=part(new T.SphereGeometry(1,16,12),color,x,y,z,parent);
 mesh.scale.set(w,h,d);return mesh;
}
function rod(a,b,r,color,parent=scene){
 const v=new T.Vector3(...a),u=new T.Vector3(...b),axis=u.clone().sub(v);
 const mid=v.addScaledVector(axis,.5);
 const obj=cyl(mid.x,mid.y,mid.z,r,r,axis.length(),color,parent);
 obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),axis.normalize());return obj;
}
for(let i=0;i<15;i++){
 const w=.47,x=-3.525+i*w,c=i%2?0xe4b778:0xa94735;
 const vertices=[],indices=[];
 for(let j=0;j<=10;j++){
  const a=j*Math.PI/20, y=3.40+.52*Math.cos(a), z=-1.44+1.64*Math.sin(a);
  vertices.push(x,y,z,x+w,y,z);if(j){const k=j*2;indices.push(k-2,k-1,k,k,k-1,k+1)}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setIndex(indices);g.computeVertexNormals();
 const stripe=part(g,c,0,0,0);stripe.material.side=T.DoubleSide;
 const hem=new T.Shape();hem.moveTo(0,0);hem.lineTo(w,0);hem.lineTo(w,-.13);hem.quadraticCurveTo(w*.5,-.33,0,-.13);hem.closePath();
 const fringe=part(new T.ShapeGeometry(hem),c,x,3.4,.204);fringe.material.side=T.DoubleSide;
}
box(0,4.10,-1.02,3.56,.65,.16,wood);
sign('阿月麵攤','#234d48','#ffe9ab',0,4.10,-.927,3.48,.60);
for(const x of [-3.32,3.32]){
 rod([x,3.42,.18],[x,3.13,.18],.022,iron);
 const paper=oval(x,2.84,.18,.285,.36,.265,0xe66c3c);
 paper.material.emissive.setHex(0xae3117);paper.material.emissiveIntensity=.65;
 for(let i=-3;i<=3;i++){
  const y=i*.085,r=.287*Math.sqrt(1-(y/.36)**2);
  cyl(x,2.84+y,.18,r,r,.015,0xb14828)
 }
 for(const y of [2.49,3.18])cyl(x,y,.18,.12,.12,.05,brass);
 for(let i=-1;i<=1;i++)rod([x,2.46,.18],[x+.032*i,2.27,.18],.013,0xb94129);
}
// The three work surfaces sit at the same height so the lamp aim points double as test probes.
const points=[-2,0,2].map(x=>new T.Vector3(x,1.33,.66));
box(-2,1.30,.66,1.23,.09,.84,0xd09352);
box(-2.1,1.37,.67,.52,.035,.20,0xb5c9c9);box(-1.71,1.37,.67,.27,.05,.075,wood);
box(0,1.29,.66,1.23,.07,.88,0xb6c6c3);box(0,1.335,.66,.98,.02,.65,0x526b72);
cyl(.49,1.53,.26,.045,.045,.52,0xc1c9c2);box(.36,1.77,.26,.34,.07,.075,0xc1c9c2);
box(2,1.30,.66,1.1,.12,.72,iron);box(2,1.37,.66,.93,.025,.57,0x9f5a36);
for(let i=0;i<5;i++)cyl(1.73+i*.12,1.40,.64+(i%2)*.09,.067,.067,.028,brass);
const vendor=group(-1.0,.68,-.53);
oval(0,.70,0,.29,.47,.19,0xc7ad89,vendor);
box(0,.63,.145,.43,.57,.10,0x315e60,vendor);
box(0,.49,.205,.25,.14,.022,0x537b70,vendor);
for(const x of [-.15,.15])rod([x,1.07,.09],[x*.82,.82,.21],.031,0x315e60,vendor);
oval(0,1.26,.015,.226,.26,.205,0xc58c65,vendor);
oval(0,1.37,-.046,.235,.19,.19,0x414041,vendor);
oval(0,1.48,0,.24,.115,.202,cream,vendor);
box(0,1.43,.014,.45,.065,.34,0xb65340,vendor);
for(const x of [-.09,.09]){
 oval(x,1.29,.201,.021,.018,.016,iron,vendor);
 rod([x-.045,1.326,.193],[x+.036,1.337,.195],.012,iron,vendor);
}
oval(0,1.246,.211,.041,.050,.04,0xd29a6c,vendor);
rod([-.052,1.171,.182],[.036,1.166,.182],.009,wood,vendor);
rod([-.23,.96,0],[-.31,.75,.05],.093,cream,vendor);
oval(-.31,.69,.09,.068,.093,.075,0xc58c65,vendor);
const arm=group(.25,.95,.02,vendor);rod([0,0,0],[.025,-.25,.055],.094,cream,arm);
oval(.025,-.31,.065,.071,.10,.075,0xc58c65,arm);
const cloth=box(.3,1.25,-.40,.26,.38,.035,0xf2e1ae);
// Stacks of bowls, a bamboo steamer, a chopstick tin and a gas bottle describe the stall's trade.
function rim(x,y,z,r,t,color){
 const mesh=part(new T.TorusGeometry(r,t,8,28),color,x,y,z);mesh.rotation.x=Math.PI/2;return mesh;
}
for(let i=0;i<4;i++){
 const y=1.31+i*.071;
 cyl(-2.84,y,-.06,.22,.14,.14,0xe7d5af);rim(-2.84,y+.073,-.06,.216,.015,jade);
}
cyl(-2.38,1.45,-.08,.105,.095,.36,0x944632);
for(let i=0;i<9;i++){
 const a=i*2.4;rod([-2.38+.042*Math.cos(a),1.5,-.08+.042*Math.sin(a)],
 [-2.38+.12*Math.cos(a),1.9+(i%3)*.035,-.08+.10*Math.sin(a)],.013,cream);
}
for(let i=0;i<2;i++){
 const y=1.40+i*.18;cyl(2.92,y,-.02,.31,.31,.19,0xc89354);
 rim(2.92,y+.087,-.02,.307,.019,0x85522e);
}
for(let i=-3;i<=3;i++){
 const len=2*Math.sqrt(.28**2-(i*.074)**2);
 box(2.92,1.69,-.02+i*.074,len,.025,.059,0xe4bb78);
}
for(const [x,label] of [[1.2,'陽春麵'],[1.8,'餛飩湯'],[2.4,'滷蛋']]){
 box(x,2.72,-1.105,.50,.61,.06,cream);
 sign(label,'#edd4a2','#703c2a',x,2.72,-1.069,.48,.51);
}
const tankX=-3.46;
cyl(tankX,.48,.54,.203,.203,.65,0x72968b);
oval(tankX,.80,.54,.203,.11,.203,0x72968b);
cyl(tankX,.93,.54,.054,.054,.15,brass);
rim(tankX,.97,.54,.104,.02,wood);
for(const x of [-2.75,-1.88,1.85,2.72]){
 const panel=box(x,.61,1.358,.72,.77,.045,0x275951);
 box(x,.61,1.39,.61,.64,.025,0x396d63);
 for(const dx of [-.25,.25])for(const dy of [-.26,.26])oval(x+dx,.61+dy,1.411,.017,.017,.009,brass);
}
const menu=box(.30,2.14,.63,.69,.55,.09,wood);
sign('今日麵','#5a3329','#ffe5a2',.30,2.14,.682,.66,.51);
for(const x of [.04,.56])box(x,2.92,.63,.018,1.02,.018,iron);
box(.30,3.43,.22,.75,.05,1.05,wood);
const lamps=[], ray=new T.Raycaster();
function lamp(x,color,angle){
 const pivot=group(x,3.16,.63);box(x,3.31,.02,.065,.065,1.26,iron);box(x,3.24,.63,.07,.19,.07,iron);
 const shade=cyl(0,-.10,0,.12,.27,.28,color,pivot);
 const bulb=cyl(0,-.25,0,.245,.245,.024,0xffe4a0,pivot);bulb.material.emissive.setHex(0xffbe67);
 shade.castShadow=false;bulb.castShadow=false;
 const light=new T.SpotLight(0xffce81,75,8,angle,.21,1.6);
 light.position.copy(pivot.position);light.castShadow=true;light.shadow.mapSize.set(512,512);light.shadow.bias=-.001;
 scene.add(light,light.target);lamps.push({pivot,shade,bulb,light});
}
lamp(-2.55,0xc97648,.56);lamp(2.55,0x50998e,.115);
const indicators=points.map(p=>{const obj=cyl(p.x,1.22,1.45,.083,.083,.04,iron);obj.rotation.x=Math.PI/2;return obj});
const wideAims=[-2.65,-1,1], narrowAims=[-2,0,2];
let wide=0,spot=0,lit=[],blocked=false,closing=null,frozen=null,zh=navigator.language.startsWith('zh');
const words=(en,tc)=>zh?tc:en;
function aim(){
 const targets=[wideAims[wide],narrowAims[spot]];
 lamps.forEach(({light,pivot},i)=>{
 light.target.position.set(targets[i],1.33,.66);
 const axis=light.target.position.clone().sub(pivot.position).normalize();
 pivot.quaternion.setFromUnitVectors(new T.Vector3(0,-1,0),axis);
 });
 scene.updateMatrixWorld(true);
 function reaches(i,p){
 const {light}=lamps[i],v=p.clone().sub(light.position),dir=light.target.position.clone().sub(light.position);
 if(v.angleTo(dir)>light.angle)return false;
 ray.set(light.position,v.clone().normalize());ray.far=v.length();
 return !ray.intersectObject(menu).length;
 }
 blocked=!reaches(1,points[spot]);lit=points.map(p=>reaches(0,p)||reaches(1,p));
 indicators.forEach((s,i)=>{s.material.color.setHex(lit[i]?0xffe493:0x333d41);s.material.emissive.setHex(lit[i]?0xd78228:0)});
}
function ui(){
 document.documentElement.lang=zh?'zh-Hant':'en';$('title').textContent=words('Last Light at the Night Market','夜市最後一盞燈');
 $('lang').textContent=words('繁中','EN');$('lang').lang=words('zh-Hant','en');
 $('goal').textContent=words('Light the cutting board, sink, and cash tray so the vendor can close.','照亮砧板、水槽和錢盤，讓老闆收攤。');
 const names=zh?['砧板','水槽','錢盤']:['Cutting board','Sink','Cash tray'];
 for(const [id,name,n] of [['wide',words('Turn wide lamp','轉動廣角燈'),wide],['spot',words('Turn spot lamp','轉動聚光燈'),spot]]){
 $(id).innerHTML=name+' ↻<small>'+words('Position ','位置 ')+(n+1)+' / 3</small>';$(id).disabled=closing!==null;}
 $('status').textContent=closing!==null?words('All three lit. The vendor hangs the cloth and closes for the night.','三處都亮了。老闆掛起抹布，拉下鐵門。'):
 names.map((n,i)=>n+' '+(lit[i]?words('lit','亮'):words('dark','暗'))).join(' · ');
 $('hint').textContent=words('Drag to orbit and inspect the hanging menu. Tap a lamp to turn it. Keyboard: focus the scene and use the arrow keys.','拖曳旋轉視角，觀察吊掛的菜單。點選燈具即可轉動。鍵盤：將焦點移到場景後按方向鍵。');
 canvas.setAttribute('aria-label',$('hint').textContent);$('reset').textContent=words('Reset view','重設視角');
 $('again').textContent=words('Open again','重新開攤');$('again').hidden=closing===null;
}
function turn(i){if(closing!==null)return;if(i===0)wide=(wide+1)%3;else spot=(spot+1)%3;
 aim();if(lit.every(Boolean))closing=performance.now()/1000;ui();draw();}
function pose(t){
 const p=Math.min(1,Math.max(0,t)), slide=Math.min(1,Math.max(0,(t-1)/1.8));
 arm.rotation.x=-.5-p*1.6;cloth.position.set(-.7+p*.45,1.23+p*.75,-.31);shutter.scale.y=.06+.94*slide;
}
function draw(){pose(closing===null?0:(frozen??(performance.now()/1000-closing)));renderer.render(scene,camera)}
camera.position.set(4.2,4.65,9.4);const focus=new T.Vector3(0,1.78,0);
const orbit=createDioramaOrbit(camera,canvas,{target:focus,minDistance:6,maxDistance:22,minPolarAngle:.5,maxPolarAngle:1.47,onChange:draw,onSelect(e){
 const rect=canvas.getBoundingClientRect();ray.far=Infinity;ray.setFromCamera(new T.Vector2(2*(e.clientX-rect.left)/rect.width-1,1-2*(e.clientY-rect.top)/rect.height),camera);
 const hit=ray.intersectObjects(lamps.flatMap(l=>[l.shade,l.bulb]))[0];if(hit)turn(lamps.findIndex(l=>l.pivot===hit.object.parent));
}});
function resize(){const w=canvas.clientWidth,h=canvas.clientHeight;camera.aspect=w/h;camera.fov=T.MathUtils.radToDeg(2*Math.atan(Math.max(.355,.44/camera.aspect)));camera.updateProjectionMatrix();renderer.setSize(w,h,false);draw()}
$('wide').onclick=()=>turn(0);$('spot').onclick=()=>turn(1);$('reset').onclick=()=>orbit.reset();
$('lang').onclick=()=>{zh=!zh;ui()};$('again').onclick=()=>{setState(0,0);orbit.reset();$('wide').focus()};
function setState(w,s){wide=w;spot=s;frozen=null;aim();closing=lit.every(Boolean)?performance.now()/1000:null;ui();draw()}
setState(0,0);new ResizeObserver(resize).observe(canvas);resize();
function animate(){if(closing!==null&&frozen===null){draw();if(performance.now()/1000-closing>=3)frozen=3}requestAnimationFrame(animate)}animate();
window.__diorama={scene,camera,renderer,setState,freeze(t){frozen=t;draw()},get state(){return {wide,spot,lit:[...lit],blocked}}};
window.__dioramaReady=true;
