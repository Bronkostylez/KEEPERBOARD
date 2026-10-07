const {chromium}=require('@playwright/test'),assert=require('node:assert/strict'),fs=require('node:fs'),server=require('./serve.cjs');
(async()=>{await new Promise(r=>server.listen(8765,'127.0.0.1',r));const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});try{
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));

// Generate native raster icons from the source SVG, before testing the offline cache.
for(const size of [192,512]){await page.setViewportSize({width:size,height:size});await page.setContent('<style>body{margin:0}svg{width:100vw;height:100vh}</style>'+fs.readFileSync('icon.svg','utf8'));await page.screenshot({path:`icon-${size}.png`});}
await page.setViewportSize({width:390,height:844});await page.goto('http://localhost:8765');
assert.equal(await page.locator('.card').count(),6);assert.equal(await page.locator('#total').textContent(),'20 MIN');assert.equal(await page.locator('.block').count(),6);
await page.screenshot({path:'/downloads/keeperboard-mobile.png',fullPage:true});
await page.selectOption('#filter','Hechten');assert.equal(await page.locator('.card').count(),2);await page.fill('#search','Matte');assert.equal(await page.locator('.card').count(),2);await page.fill('#search','xxx');assert.equal(await page.locator('.card').count(),0);await page.fill('#search','');await page.selectOption('#filter','Alle Schwerpunkte');
await page.locator('[data-detail="floor"]').click();assert.match(await page.locator('#detailContent').innerText(),/Angst/);await page.locator('#detailDialog .closeDialog').click();
await page.locator('[data-add="ready"]').click();assert.equal(await page.locator('.block').count(),7);await page.locator('[data-remove]').last().click();
await page.locator('.duration').first().fill('4');await page.locator('.duration').first().dispatchEvent('change');assert.equal(await page.locator('#total').textContent(),'22 MIN');
await page.locator('[data-move="1"][data-dir="-1"]').click();assert.match(await page.locator('.block').first().innerText(),/Achterkreise/);
await page.fill('#planName','Mein Technikplan');await page.locator('#planName').dispatchEvent('change');await page.reload();assert.equal(await page.inputValue('#planName'),'Mein Technikplan');
await page.click('#startTimer');assert.equal(await page.locator('#startTimer').textContent(),'Pause');await page.click('#startTimer');assert.equal(await page.locator('#startTimer').textContent(),'Start');await page.click('#nextBlock');assert.match(await page.locator('#timerName').textContent(),/Ballgefühl/);
await page.click('#newPlan');assert.equal(await page.locator('.block').count(),0);await page.locator('[data-add="catch"]').click();assert.equal(await page.locator('#total').textContent(),'4 MIN');
await page.click('#newExercise');await page.fill('#exName','Eigene Fangübung');await page.fill('#exDescription','Langsam zuspielen und sicher fangen.');await page.fill('#exMaterial','Ein Ball');await page.locator('#exerciseForm button[type=submit]').click();assert.equal(await page.locator('.card').count(),7);
await page.click('[data-tab=info]');const dl=page.waitForEvent('download');await page.click('#export');const download=await dl;await download.saveAs('/tmp/keeperboard-backup.json');const data=JSON.parse(fs.readFileSync('/tmp/keeperboard-backup.json'));assert.equal(data.custom.length,1);assert.equal(data.plans.length,2);
fs.writeFileSync('/tmp/invalid.json',JSON.stringify({version:1,plans:[],custom:[]}));await page.setInputFiles('#import','/tmp/invalid.json');assert.match(await page.locator('#status').innerText(),/Import abgelehnt/);
page.once('dialog',d=>d.accept());await page.setInputFiles('#import','/tmp/keeperboard-backup.json');assert.equal(await page.locator('#plans option').count(),2);
await page.click('[data-tab=board]');await page.setViewportSize({width:1280,height:900});await page.screenshot({path:'/downloads/keeperboard-desktop.png',fullPage:true});
// Refresh cache after icons exist. Offline test on a clean context.
const ctx=await browser.newContext();const offline=await ctx.newPage();await offline.goto('http://localhost:8765');await offline.evaluate(async()=>{await navigator.serviceWorker.ready;});await offline.waitForFunction(()=>!!navigator.serviceWorker.controller);await ctx.setOffline(true);await offline.reload();assert.equal(await offline.locator('.card').count(),6);await offline.locator('[data-add="pass"]').click();assert.equal(await offline.locator('.block').count(),7);assert.equal(await offline.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await ctx.close();
assert.deepEqual(errors,[]);console.log('PASS: filters, detail, add/remove/reorder, durations, persistence, timer pause/next, multiple plans, custom exercise, backup export/import/rejection, offline reload. No page errors.');
// Reset screenshot to shipped defaults.
await page.evaluate(()=>localStorage.removeItem('keeperboard-v1'));await page.reload();await page.screenshot({path:'/downloads/keeperboard-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/downloads/keeperboard-mobile.png',fullPage:true});await page.locator('.timer').scrollIntoViewIfNeeded();await page.screenshot({path:'/downloads/keeperboard-timer.png'});
}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
