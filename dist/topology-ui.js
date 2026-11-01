const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function wrap(text,width=22){const lines=[''];for(const word of String(text).split(' ')){if((lines.at(-1)+' '+word).trim().length>width)lines.push(word);else lines[lines.length-1]=(lines.at(-1)+' '+word).trim();}return lines;}

// Locations provide containment; numbered paths expose messages and recipients.
// The complete connection list below is also the narrow-screen/keyboard view.
export function topologyMarkup(topology,selected){
  if(!topology)return '';
  const locations=[...new Set(topology.nodes.map(n=>n.location))],columns=Math.min(3,locations.length),rows=Math.ceil(locations.length/columns),width=960,cell=width/columns;
  const rowHeights=Array.from({length:rows},(_,row)=>Math.max(220,90+Math.max(...locations.slice(row*columns,(row+1)*columns).map(l=>topology.nodes.filter(n=>n.location===l).length))*125));
  const rowTops=rowHeights.map((_,row)=>rowHeights.slice(0,row).reduce((a,b)=>a+b,0)),height=rowHeights.reduce((a,b)=>a+b,0)+15,positions=new Map();
  const groups=locations.map((location,index)=>{const zoneRow=Math.floor(index/columns),col=zoneRow%2?columns-1-index%columns:index%columns,x=col*cell,y=rowTops[zoneRow],rowHeight=rowHeights[zoneRow];
    const nodes=topology.nodes.filter(n=>n.location===location);
    return `<rect class="topology-zone" x="${x+12}" y="${y+12}" width="${cell-24}" height="${rowHeight-20}" rx="3"/><text class="topology-location" x="${x+27}" y="${y+40}">${esc(location)}</text>`+nodes.map((n,i)=>{const at={x:x+35,y:y+60+i*125,w:cell-70,h:100,zoneRow};positions.set(n.id,at);return '';}).join('');
  }).join('');
  const paths=topology.edges.map((e,i)=>{
    const a=positions.get(e.from),b=positions.get(e.to);if(!a||!b)return '';
    const reciprocal=topology.edges.findIndex(x=>x.from===e.to&&x.to===e.from),offset=reciprocal<0?0:i<reciprocal?-15:15;
    let path,mx,my;
    if(a.zoneRow!==b.zoneRow){
      const down=b.zoneRow>a.zoneRow,x1=a.x+a.w/2+offset,x2=b.x+b.w/2+offset,y1=down?a.y+a.h:a.y,y2=down?b.y:b.y+b.h;
      const boundary=down?a.zoneRow:b.zoneRow,lane=rowTops[boundary]+rowHeights[boundary]+offset;
      path=`M ${x1} ${y1} V ${lane} H ${x2} V ${y2}`;mx=(x1+x2)/2;my=lane;
    }else if(a.x===b.x){
      const down=b.y>a.y,x=a.x+a.w/2+offset,y1=down?a.y+a.h:a.y,y2=down?b.y:b.y+b.h;
      path=`M ${x} ${y1} V ${y2}`;mx=x;my=(y1+y2)/2;
    }else if(Math.abs(a.x-b.x)<=cell+1){
      const right=b.x>a.x,x1=right?a.x+a.w:a.x,x2=right?b.x:b.x+b.w,y1=a.y+a.h/2+offset,y2=b.y+b.h/2+offset;
      mx=(x1+x2)/2;my=(y1+y2)/2;path=`M ${x1} ${y1} H ${mx} V ${y2} H ${x2}`;
    }else{
      const y=Math.max(a.y+a.h,b.y+b.h)+18+offset*.4,x1=a.x+a.w/2,x2=b.x+b.w/2;
      path=`M ${x1} ${a.y+a.h} V ${y} H ${x2} V ${b.y+b.h}`;mx=(x1+x2)/2;my=y;
    }
    return `<path class="topology-path ${offset>0?'return-path':''}" d="${path}" marker-end="url(#topology-arrow)" ${e.direction==='both'?'marker-start="url(#topology-arrow)"':''}/><circle class="path-number" cx="${mx}" cy="${my}" r="10"/><text class="path-number-text" x="${mx}" y="${my+4}">${i+1}</text>`;
  }).join('');
  const nodes=topology.nodes.map(n=>{const p=positions.get(n.id);return `<g class="topology-node ${selected===n.component?'selected':''}" data-topology-component="${esc(n.component)}" data-topology-node="${esc(n.id)}" role="button" tabindex="0" aria-label="Inspect ${esc(n.label)}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="3"/>${wrap(n.label,Math.floor(p.w/8.5)).slice(0,2).map((line,i)=>`<text x="${p.x+14}" y="${p.y+26+i*21}">${esc(line)}</text>`).join('')}${n.role?wrap(n.role,Math.floor(p.w/6)).slice(0,2).map((line,i)=>`<text class="node-role" x="${p.x+14}" y="${p.y+p.h-24+i*14}">${esc(line)}</text>`).join(''):''}</g>`;}).join('');
  return `<header class="topology-heading"><p class="eyebrow">Locations & information paths</p><h1>${esc(topology.title)}</h1><p>${esc(topology.description)}</p></header><svg class="topology-diagram" viewBox="0 0 ${width} ${height}" role="group" aria-label="${esc(topology.title)}"><defs><marker id="topology-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs>${groups}${paths}${nodes}</svg><ol class="connection-list">${topology.edges.map(e=>{const from=topology.nodes.find(n=>n.id===e.from),to=topology.nodes.find(n=>n.id===e.to);return `<li><div><span class="connection-endpoint"><button data-connection-node="${esc(from?.id)}" data-component="${esc(from?.component)}">${esc(from?.label)}</button><small>${esc(from?.location)}${from?.role?` · ${esc(from.role)}`:''}</small></span><span aria-label="${e.direction==='both'?'exchanges with':'to'}">${e.direction==='both'?'↔':'→'}</span><span class="connection-endpoint"><button data-connection-node="${esc(to?.id)}" data-component="${esc(to?.component)}">${esc(to?.label)}</button><small>${esc(to?.location)}${to?.role?` · ${esc(to.role)}`:''}</small></span></div><p>${esc(e.label)}</p></li>`;}).join('')}</ol>`;
}
