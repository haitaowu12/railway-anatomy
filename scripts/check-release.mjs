import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),root=path.join(repo,'build');
const release=JSON.parse(await readFile(path.join(root,'release.json'),'utf8'));
assert.match(release.build,/^[a-f0-9]{16}$/);assert.equal(release.project,'railway-anatomy');
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())files.push(...await walk(p));else files.push(p);}return files;}
let links=0;
for(const file of await walk(root)){
 if(!/\.(?:m?js|html|css)$/.test(file))continue;const text=await readFile(file,'utf8');let urls=[];
 if(/\.m?js$/.test(file))urls=[...text.matchAll(/\b(?:from|import)\s*(?:\(\s*)?['"](\.{1,2}\/[^'"]+)['"]/g)].map(m=>m[1]);
 if(file.endsWith('.html')){assert(text.includes(`<meta name="build" content="${release.build}">`),file+': missing release identity');urls=[...text.matchAll(/(?:src|href)\s*=\s*['"](\.{1,2}\/[^'"]+\.(?:m?js|css|svg|png|woff2?)(?:\?[^'"]*)?)['"]/g)].map(m=>m[1]);for(const match of text.matchAll(/<script\s+type=['"]importmap['"][^>]*>([\s\S]*?)<\/script>/g)){const map=JSON.parse(match[1]);for(const imports of [map.imports,...Object.values(map.scopes||{})])urls.push(...Object.values(imports||{}).filter(url=>url.startsWith('.')&&!url.endsWith('/')));}}
 if(file.endsWith('.css'))urls=[...text.matchAll(/url\(['"]?(\.{1,2}\/[^)'"\s]+)['"]?\)/g)].map(m=>m[1]);
 for(const value of urls){const url=new URL(value,'https://example.test/'),relative=decodeURIComponent(value.split(/[?#]/)[0]),target=path.resolve(path.dirname(file),relative);assert.equal(url.searchParams.get('v'),release.build,file+': stale dependency '+value);assert(target.startsWith(root+path.sep),'Release asset escaped its directory');assert((await stat(target)).isFile(),'Missing release dependency '+target);links++;}
}
assert(links>60,'Release dependency scan missed the application graph');
console.log(`PASS release artifact ${release.build}: ${links} version-consistent local dependencies and identity metadata`);
