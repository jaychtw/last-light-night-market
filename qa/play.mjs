import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try {
 for(const viewport of [{width:1280,height:800},{width:390,height:844}]){
  const page=await browser.newPage({viewport});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.BASE_URL || 'http://127.0.0.1:4180');
  await page.waitForFunction(()=>window.__dioramaReady);
  const solves=await page.evaluate(()=>{
   const d=window.__diorama,wins=[];
   for(let w=0;w<3;w++)for(let s=0;s<3;s++){d.setState(w,s);if(d.state.lit.every(Boolean))wins.push([w,s]);}
   d.setState(0,0);return wins;
  });
  assert.deepEqual(solves,[[1,2]]);
  const camera=()=>page.evaluate(()=>window.__diorama.camera.position.toArray());
  const initial=await camera();await page.locator('canvas').focus();await page.keyboard.press('ArrowRight');
  assert.notDeepEqual(await camera(),initial);await page.locator('#reset').click();assert.deepEqual(await camera(),initial);
  await page.locator('#wide').focus();await page.keyboard.press('Enter');
  await page.locator('#spot').click({clickCount:1});await page.locator('#spot').click();
  assert.equal(await page.locator('#again').isVisible(),true);
  const frame=async t=>{await page.evaluate(t=>window.__diorama.freeze(t),t);return page.locator('canvas').screenshot()};
  const mid=await frame(1.5);assert.notDeepEqual(await frame(3),mid);assert.deepEqual(await frame(1.5),mid);
  await page.locator('#lang').click();assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hant');
  await page.locator('#again').click();assert.equal(await page.locator('#wide').isEnabled(),true);
  assert.deepEqual(errors,[]);await page.close();
 }
} finally {await browser.close()}
