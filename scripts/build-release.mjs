#!/usr/bin/env node
// One deterministic, cache-consistent artifact for Pages and GPT Sites.
// dist/ remains the authored, dependency-free source; build/ is disposable.
import {readFile,readdir,mkdir,rm,cp,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(repo,'dist'),output=path.join(repo,'build');
async function filesBelow(directory,prefix=''){
 const result=[];
 for(const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){
  const relative=prefix+entry.name;
  if(entry.isDirectory())result.push(...await filesBelow(path.join(directory,entry.name),relative+'/'));
  else if(entry.isFile())result.push(relative);
 }
 return result;
}
const files=await filesBelow(source),hash=createHash('sha256');
const pkg=JSON.parse(await readFile(path.join(repo,'package.json'),'utf8'));
hash.update(pkg.version);hash.update(await readFile(fileURLToPath(import.meta.url)));
for(const file of files){const bytes=await readFile(path.join(source,file));hash.update(file+'\0'+bytes.length+'\0');hash.update(bytes);}
const build=hash.digest('hex').slice(0,16);
function versioned(value){
 if(!/^\.{1,2}\//.test(value)||value.startsWith('data:'))return value;
 const [base,fragment]=value.split('#'),index=base.indexOf('?'),pathname=index<0?base:base.slice(0,index),query=new URLSearchParams(index<0?'':base.slice(index+1));
 query.set('v',build);return pathname+'?'+query.toString()+(fragment?'#'+fragment:'');
}
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});await cp(source,output,{recursive:true});
for(const file of files){
 if(!/\.(?:m?js|html|css)$/.test(file))continue;
 let text=await readFile(path.join(source,file),'utf8');
 if(/\.m?js$/.test(file))text=text.replace(/(\b(?:from|import)\s*(?:\(\s*)?['"])(\.{1,2}\/[^'"]+)(['"])/g,(_,prefix,url,suffix)=>prefix+versioned(url)+suffix);
 if(file.endsWith('.html')){
  text=text.replace(/((?:src|href)\s*=\s*['"])(\.{1,2}\/[^'"]+\.(?:m?js|css|svg|png|woff2?)(?:\?[^'"]*)?)(['"])/g,(_,prefix,url,suffix)=>prefix+versioned(url)+suffix);
  text=text.replace(/(<script\s+type=['"]importmap['"][^>]*>)([\s\S]*?)(<\/script>)/g,(_,open,json,close)=>{const map=JSON.parse(json);for(const imports of [map.imports,...Object.values(map.scopes||{})])for(const [key,url]of Object.entries(imports||{}))if(typeof url==='string'&&!url.endsWith('/'))imports[key]=versioned(url);return open+JSON.stringify(map)+close;});
  text=text.replace('</head>',`<meta name="build" content="${build}"><meta name="application-version" content="${pkg.version}"></head>`);
 }
 if(file.endsWith('.css'))text=text.replace(/url\((['"]?)(\.{1,2}\/[^)'"\s]+)\1\)/g,(_,quote,url)=>`url(${quote}${versioned(url)}${quote})`);
 await writeFile(path.join(output,file),text);
}
await writeFile(path.join(output,'.nojekyll'),'');
await writeFile(path.join(output,'release.json'),JSON.stringify({project:pkg.name,version:pkg.version,build},null,2)+'\n');
console.log(`Built Railway Anatomy ${pkg.version} (${build}) in build/`);
