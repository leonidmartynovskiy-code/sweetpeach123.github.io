const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {test} = require('node:test');
const root = __dirname + '/../src/components/';
const script = name => fs.readFileSync(root+name+'.astro','utf8').split('<script is:inline>')[1].split('</script>')[0];
const journey = script('InquiryJourney');
const analytics = fs.readFileSync(__dirname+'/../src/layouts/BaseLayout.astro','utf8').split('<script is:inline>')[1].split('</script>')[0];
const origin = 'https://paversofpalmbeach.com';
function page(path, storage={}, options={}) {
  const listeners={}, calls=[];
  class Element {closest(){return this.link;}}
  const location = new URL(origin+path);
  const document={referrer:options.referrer||'',addEventListener:(name,cb)=>listeners[name]=cb};
  const window={location,sessionStorage:{
    getItem:key=>{if(options.blocked)throw Error('blocked');return storage[key]||null;},
    setItem:(key,value)=>{if(options.blocked)throw Error('blocked');storage[key]=value;},
    removeItem:key=>{if(options.blocked)throw Error('blocked');delete storage[key];}
  },gtag:(...args)=>calls.push(args)};
  const context=vm.createContext({window,document,URL,Date,Number,Element});
  vm.runInContext(journey,context);vm.runInContext(analytics,context);
  return {window,calls,click(href,button=0,mods={}){const target=new Element();target.link={href:new URL(href,origin).href,hasAttribute:()=>false};listeners.click({target,button,...mods});},storage};
}
test('article -> city service -> contact -> receipt preserves origin and service',()=>{
 const storage={}; const a=page('/blog/using-driveway-after-paver-sealing/?email=private@example.com#secret',storage);
 a.click('/services/clean-seal/palm-beach-gardens/');
 assert.equal(a.calls.length,0);
 const arrival=page('/services/clean-seal/palm-beach-gardens/',storage);
 assert.equal(arrival.window.ppPendingServiceEvent.origin_article,'/blog/using-driveway-after-paver-sealing/');
 assert.equal(arrival.window.ppPendingServiceEvent.inquiry_service,'/services/clean-seal/palm-beach-gardens/');
 assert.equal(page('/services/clean-seal/palm-beach-gardens/',storage).window.ppPendingServiceEvent,undefined);
 for(const target of ['/contact/','/thank-you/']){
   const r=page(target,storage);
   assert.equal(r.window.ppInquiryAnalyticsParams.origin_article,'/blog/using-driveway-after-paver-sealing/');
   assert.equal(r.window.ppInquiryAnalyticsParams.inquiry_service,'/services/clean-seal/palm-beach-gardens/');
   assert.equal(r.calls.length,0); // Never manufacture a conversion or second page_view.
   assert(!JSON.stringify(r.window.ppInquiryAnalyticsParams).includes('private'));
 }
});
test('service-only path does not invent an article; later service is latest viewed',()=>{
 const s={};page('/services/clean-seal/',s);page('/services/driveways/',s);
 const r=page('/contact/',s);assert.equal(r.window.ppInquiryAnalyticsParams.inquiry_service,'/services/driveways/');
 assert.equal(r.window.ppInquiryAnalyticsParams.origin_article,undefined);
});
test('stale service/article are discarded at the existing session expiry',()=>{
 const s={pp_inquiry_visit_v1:JSON.stringify({landing:origin+'/blog/old/',article:origin+'/blog/old/',service:origin+'/services/driveways/',lastSeen:Date.now()-1800001})};
 const r=page('/contact/',s);assert.equal(Object.keys(r.window.ppInquiryAnalyticsParams).length,0);
});
test('blocked storage is harmless and uses only same-origin one-step referrer',()=>{
 const r=page('/contact/',{}, {blocked:true,referrer:origin+'/services/clean-seal/?secret=abc'});
 assert.equal(r.window.ppInquiryAnalyticsParams.inquiry_service,'/services/clean-seal/');
 const external=page('/contact/',{}, {blocked:true,referrer:'https://perfectpavers.com/blog/test/'});
 assert.equal(Object.keys(external.window.ppInquiryAnalyticsParams).length,0);
});
test('bad storage and forged external paths cannot leak source data',()=>{
 const r=page('/',{pp_inquiry_visit_v1:JSON.stringify({landing:origin+'/',article:'https://evil.test/blog/private/',service:'https://evil.test/services/foo/',lastSeen:Date.now()})});
 assert.equal(Object.keys(r.window.ppInquiryAnalyticsParams).length,0);
 assert.doesNotThrow(()=>page('/',{pp_inquiry_visit_v1:'{bad'}));
});
test('only service activation is emitted, without navigation hooks',()=>{
 const r=page('/services/clean-seal/');
 for(const href of ['/contact/','tel:+15618348880','https://perfectpavers.com/services/driveways/','/services/clean-seal/#scope','/services/'])r.click(href);
 r.click('/services/driveways/',2);assert.equal(r.calls.length,0);
 r.click('/services/driveways/?utm_source=other#details',0,{metaKey:true});assert.equal(r.calls.length,1);
 assert.equal(r.calls[0][2].inquiry_service,'/services/driveways/');
 assert.equal(r.calls[0][2].send_to,'G-VEPMNPCFF3');
});
test('pending clicks expire and cannot become clicks on unrelated destinations',()=>{
 const old={pp_service_click_v1:JSON.stringify({destination:'/services/driveways/',article:'/blog/test/',at:Date.now()-60001})};
 assert.equal(page('/services/driveways/',old).window.ppPendingServiceEvent,undefined);
 const wrong={pp_service_click_v1:JSON.stringify({destination:'/services/driveways/',at:Date.now()})};
 assert.equal(page('/services/clean-seal/',wrong).window.ppPendingServiceEvent,undefined);
 assert.equal(wrong.pp_service_click_v1,undefined);
});
test('blocked storage retains direct best-effort click without changing navigation',()=>{
 const r=page('/blog/test/',{}, {blocked:true});r.click('/services/clean-seal/');
 assert.equal(r.calls.length,1);assert.equal(r.calls[0][1],'service_click');
});
test('unavailable analytics never blocks a link',()=>{
 const r=page('/');delete r.window.gtag;
 assert.doesNotThrow(()=>r.click('/services/driveways/'));
});
test('oversized/invalid article and service paths are omitted rather than truncated',()=>{
 for(const target of ['/blog/'+ 'a'.repeat(110)+'/', '/blog/private@example.com/']){
  const r=page(target);assert.equal(r.window.ppInquiryAnalyticsParams.origin_article,undefined);
 }
 const r=page('/');r.click('/services/'+ 'a'.repeat(110)+'/');assert.equal(r.calls.length,0);
});
