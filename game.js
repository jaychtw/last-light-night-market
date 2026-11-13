import * as T from 'three';
import {createDioramaOrbit} from './vendor/orbit.js';
const $ = id => document.getElementById(id);
const canvas = $('scene'), scene = new T.Scene(), camera = new T.PerspectiveCamera(34,1,.1,80);
const renderer = new T.WebGLRenderer({canvas,antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=T.PCFSoftShadowMap;
scene.add(new T.HemisphereLight(0xffe4c7,0xa2abc2,1.45));
const fill=new T.DirectionalLight(0xffdfbe,1.9);
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
for(let i=0;i<13;i++){const x=-3.24+i*.54,c=i%2?0xf0c387:0xaf5038;
 const aw=box(x,3.71,-.85,.54,.11,1.57,c);aw.rotation.x=.11;
 box(x,3.53,-.07,.535,.25,.075,c)}
sign('夜 市 小 吃','#214f49','#ffe7a8',0,3.91,-.77,2.9,.54);
for(const x of [-3.33,3.33]){
 box(x,3.07,-.16,.025,.63,.025,iron);cyl(x,2.76,-.16,.23,.22,.43,0xd36346);
 for(const y of [2.52,2.66,2.85,3.0])cyl(x,y,-.16,.217,.217,.032,wood);
 cyl(x,2.45,-.16,.032,.032,.16,brass)}
// The three work surfaces sit at the same height so the lamp aim points double as test probes.
const points=[-2,0,2].map(x=>new T.Vector3(x,1.33,.66));
box(-2,1.30,.66,1.23,.09,.84,0xd09352);
box(-2.1,1.37,.67,.52,.035,.20,0xb5c9c9);box(-1.71,1.37,.67,.27,.05,.075,wood);
box(0,1.29,.66,1.23,.07,.88,0xb6c6c3);box(0,1.335,.66,.98,.02,.65,0x526b72);
cyl(.49,1.53,.26,.045,.045,.52,0xc1c9c2);box(.36,1.77,.26,.34,.07,.075,0xc1c9c2);
box(2,1.30,.66,1.1,.12,.72,iron);box(2,1.37,.66,.93,.025,.57,0x9f5a36);
for(let i=0;i<5;i++)cyl(1.73+i*.12,1.40,.64+(i%2)*.09,.067,.067,.028,brass);
const vendor=group(-1.0,.68,-.53);
box(0,.64,0,.53,.79,.36,0xe3ba83,vendor);box(0,.56,.2,.44,.61,.03,jade,vendor);
const head=box(0,1.26,0,.39,.44,.37,0xc98b5d,vendor);
box(0,1.5,0,.50,.10,.43,cream,vendor);
for(const x of [-.105,.105])box(x,1.29,.195,.043,.042,.02,iron,vendor);
const arm=group(.28,.94,.02,vendor);box(0,-.18,.04,.16,.39,.18,cream,arm);
const cloth=box(.3,1.25,-.40,.26,.38,.035,0xf2e1ae);
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
