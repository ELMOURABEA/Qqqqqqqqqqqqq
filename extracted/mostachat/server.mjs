import http from 'node:http';import {readFile} from 'node:fs/promises';import {join,extname} from 'node:path';import {randomUUID} from 'node:crypto';import {health as sqlHealth} from './src/db.mjs';import {state} from './src/seed.mjs';import {normalize,waPayload,verifySignature} from './src/meta.mjs';
const PORT=Number(process.env.PORT||3000),PUBLIC=join(process.cwd(),'public'),seen=new Set();
const send=(r,s,d,h={})=>{r.writeHead(s,{'content-type':'application/json; charset=utf-8',...h});r.end(typeof d==='string'?d:JSON.stringify(d))};
const body=async q=>{let x='';for await(let c of q){x+=c;if(x.length>5e6)throw Error('too_large')}return{x, json:x?JSON.parse(x):{}}};
const route=(p,t)=>{let a=p.split('/').filter(Boolean),b=t.split('/').filter(Boolean),o={};if(a.length!==b.length)return null;for(let i=0;i<a.length;i++)if(b[i][0]===':')o[b[i].slice(1)]=a[i];else if(a[i]!==b[i])return null;return o};
async function api(req,res,u){let p=u.pathname,m=req.method,x;
if(p==='/api/health'){let started=Date.now(),sql=await sqlHealth(),checks={application:{status:'up'},sqlServer:sql,meta:{status:process.env.META_APP_ID&&process.env.META_APP_SECRET&&process.env.META_VERIFY_TOKEN?'configured':'not_configured'},whatsapp:{status:process.env.WHATSAPP_PHONE_NUMBER_ID&&process.env.WHATSAPP_BUSINESS_ACCOUNT_ID&&process.env.META_ACCESS_TOKEN?'configured':'not_configured'},payments:{status:process.env.STRIPE_SECRET_KEY||process.env.PAYPAL_CLIENT_ID||process.env.PAYMENT_QR_IMAGE_URL?'configured':'not_configured'}};let ok=process.env.REQUIRE_SQL_HEALTH!=='true'||sql.status==='up';return send(res,ok?200:503,{status:ok?'healthy':'unhealthy',service:'MoSTaa-ChaT',version:process.env.APP_VERSION||'1.0.0',environment:process.env.NODE_ENV||'development',mode:process.env.DEMO_MODE!=='false'?'demo':'production',timestamp:new Date().toISOString(),uptimeSeconds:Math.round(process.uptime()),responseTimeMs:Date.now()-started,checks})}
if(p==='/api/health/live')return send(res,200,{status:'alive',uptimeSeconds:Math.round(process.uptime())});
if(p==='/api/health/ready'){let sql=await sqlHealth(),ok=process.env.REQUIRE_SQL_HEALTH!=='true'||sql.status==='up';return send(res,ok?200:503,{status:ok?'ready':'not_ready',checks:{sqlServer:sql}})}
if(p==='/api/state'&&m==='GET')return send(res,200,state);
if(p==='/api/auth/login'&&m==='POST')return send(res,200,{token:'demo-token',user:{id:'u1',name:'Mostafa Admin'}});
if(p==='/api/conversations'&&m==='GET')return send(res,200,{items:state.conversations});
x=route(p,'/api/conversations/:id/claim');if(x&&m==='POST'){let c=state.conversations.find(v=>v.id===x.id);if(c.lockedBy)return send(res,409,{error:'already_claimed'});c.lockedBy='u1';c.assignee='Mostafa Admin';return send(res,200,c)}
x=route(p,'/api/conversations/:id/messages');if(x&&m==='POST'){let b=await body(req),key=req.headers['idempotency-key']||randomUUID();if(seen.has(key))return send(res,200,{deduplicated:true});seen.add(key);let c=state.conversations.find(v=>v.id===x.id),msg={id:randomUUID(),direction:'outbound',text:b.json.text,sender:'Mostafa Admin',at:new Date().toISOString()};c.messages.push(msg);return send(res,201,msg)}
if(p==='/api/channels'&&m==='GET')return send(res,200,{items:state.channels});
x=route(p,'/api/channels/:id/toggle');if(x&&m==='POST'){let c=state.channels.find(v=>v.id===x.id);c.enabled=!c.enabled;return send(res,200,c)}
x=route(p,'/api/channels/:id');if(x&&m==='DELETE'){state.channels=state.channels.filter(v=>v.id!==x.id);return send(res,200,{deleted:true})}
if(p==='/api/meta/webhook'&&m==='GET')return u.searchParams.get('hub.verify_token')===(process.env.META_VERIFY_TOKEN||'replace-me')?(res.writeHead(200),res.end(u.searchParams.get('hub.challenge')||'')):send(res,403,{error:'verification_failed'});
if(p==='/api/meta/webhook'&&m==='POST'){let b=await body(req);if(process.env.NODE_ENV==='production'&&!verifySignature(b.x,req.headers['x-hub-signature-256']))return send(res,401,{error:'invalid_signature'});let ev=normalize(b.json);return send(res,200,{received:true,normalized:ev.length})}
if(p==='/api/whatsapp/send'&&m==='POST'){let b=await body(req);return send(res,200,{mock:process.env.DEMO_MODE!=='false',payload:waPayload(b.json)})}
if(p==='/api/payments'&&m==='GET')return send(res,200,{items:state.payments});
if(p==='/api/payments/receipt'&&m==='POST'){let b=await body(req),pay={id:'PAY-'+Date.now(),...b.json,status:'pending_verification'};state.payments.push(pay);return send(res,201,pay)}
x=route(p,'/api/payments/:id/:action');if(x&&m==='POST'){let pay=state.payments.find(v=>v.id===x.id);pay.status=x.action==='approve'?'approved':'rejected';return send(res,200,pay)}
if(p==='/api/data/export'){let data=JSON.stringify(state,null,2);return send(res,200,data,{'content-disposition':'attachment; filename="mostaa-chat-export.json"'})}
return send(res,404,{error:'not_found',path:p})}
const pages=new Set(['/','/customer/login','/customer/conversations','/employee/login','/ops','/ops/inbox','/ops/channels','/ops/payments','/ops/reports','/ops/data','/ops/settings']);
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'};
const server=http.createServer(async(req,res)=>{try{let u=new URL(req.url,`http://${req.headers.host}`);if(u.pathname.startsWith('/api/'))return await api(req,res,u);let file=pages.has(u.pathname)?'index.html':u.pathname.slice(1),d=await readFile(join(PUBLIC,file));res.writeHead(200,{'content-type':mime[extname(file)]||'application/octet-stream'});res.end(d)}catch(e){send(res,e.code==='ENOENT'?404:500,{error:e.message})}});
if(!process.env.VERCEL)server.listen(PORT,()=>console.log(`http://localhost:${PORT}`));export default server;
