'use strict';
const canvas = document.querySelector('#board'), ctx = canvas.getContext('2d');
const ui = Object.fromEntries(['score','lines','best','overlay','title','message','start','pause','status'].map(id => [id, document.getElementById(id)]));
const shapes = [ [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]], [[0,1,1],[1,1,0]], [[1,1,0],[0,1,1]], [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]] ];
const colors = ['','#67e8f9','#fde047','#c084fc','#4ade80','#fb7185','#60a5fa','#fb923c'];
let board, piece, score=0, lines=0, best=0, bag=[], state='idle', elapsed=0, previous=0;
try { best=Number(localStorage.getItem('mini-tetris-best'))||0; } catch {}
ui.best.textContent=best;
function collides(p) {
 return p.cells.some((row,y)=>row.some((v,x)=>v && (p.x+x<0 || p.x+x>=10 || p.y+y>=20 || (p.y+y>=0 && board[p.y+y][p.x+x]))));
}
function spawn() {
 if(!bag.length) { bag=[0,1,2,3,4,5,6]; for(let i=6;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]];} }
 const type=bag.pop(), cells=shapes[type].map(r=>r.slice());
 piece={cells,type:type+1,x:Math.floor((10-cells[0].length)/2),y:0};
 if(collides(piece)) {state='over';showOverlay('Spiel vorbei',`${score} Punkte – noch eine Runde?`,'Nochmal spielen');ui.status.textContent='Spiel vorbei';}
}
function stats(){ui.score.textContent=score;ui.lines.textContent=lines;if(score>best){best=score;ui.best.textContent=best;try{localStorage.setItem('mini-tetris-best',String(best));}catch{}}}
function lock(){
 for(let y=0;y<piece.cells.length;y++)for(let x=0;x<piece.cells[y].length;x++)if(piece.cells[y][x])board[piece.y+y][piece.x+x]=piece.type;
 const remaining=board.filter(row=>row.some(v=>!v)), cleared=20-remaining.length;
 while(remaining.length<20)remaining.unshift(Array(10).fill(0));
 board=remaining;lines+=cleared;score += [0,100,300,500,800][cleared];stats();elapsed=0;spawn();
}
function move(dx,dy){const next={...piece,x:piece.x+dx,y:piece.y+dy};if(!collides(next)){piece=next;return true;}return false;}
function rotate(){const cells=piece.cells[0].map((_,x)=>piece.cells.map(row=>row[x]).reverse());for(const offset of [0,-1,1,-2,2]){const next={...piece,cells,x:piece.x+offset};if(!collides(next)){piece=next;break;}}}
function action(name){if(state!=='playing')return;if(name==='left')move(-1,0);if(name==='right')move(1,0);if(name==='rotate')rotate();if(name==='down'){if(move(0,1)){score++;stats();}else lock();elapsed=0;}if(name==='drop'){while(move(0,1))score+=2;lock();}draw();}
function showOverlay(title,message,label){ui.title.textContent=title;ui.message.textContent=message;ui.start.textContent=label;ui.overlay.hidden=false;}
function start(){board=Array.from({length:20},()=>Array(10).fill(0));score=lines=elapsed=0;bag=[];state='playing';ui.overlay.hidden=true;ui.pause.textContent='Pause';ui.status.textContent='Viel Spaß!';stats();spawn();draw();}
function pause(){if(state==='playing'){state='paused';showOverlay('Pause','Kurz durchatmen.','Weiter spielen');ui.pause.textContent='Weiter';ui.status.textContent='Spiel pausiert';}else if(state==='paused'){state='playing';elapsed=0;ui.overlay.hidden=true;ui.pause.textContent='Pause';ui.status.textContent='Spiel läuft';}}
function cell(x,y,color,ghost=false){ctx.fillStyle=color;ctx.globalAlpha=ghost?.22:1;ctx.fillRect(x*30+1,y*30+1,28,28);ctx.fillStyle='#ffffff30';ctx.fillRect(x*30+3,y*30+3,24,3);ctx.globalAlpha=1;}
function draw(){ctx.clearRect(0,0,300,600);ctx.strokeStyle='#172136';for(let x=0;x<=10;x++){ctx.beginPath();ctx.moveTo(x*30,0);ctx.lineTo(x*30,600);ctx.stroke();}for(let y=0;y<=20;y++){ctx.beginPath();ctx.moveTo(0,y*30);ctx.lineTo(300,y*30);ctx.stroke();}if(!board)return;board.forEach((row,y)=>row.forEach((v,x)=>{if(v)cell(x,y,colors[v]);}));if(piece){let ghost={...piece};while(!collides({...ghost,y:ghost.y+1}))ghost.y++;for(const p of [ghost,piece])p.cells.forEach((row,y)=>row.forEach((v,x)=>{if(v)cell(p.x+x,p.y+y,colors[p.type],p===ghost);}));}}
ui.start.onclick=()=>state==='paused'?pause():start();ui.pause.onclick=pause;
document.querySelector('#restart').onclick=()=>{if((state==='playing'||state==='paused')&&!confirm('Aktuelles Spiel beenden und neu starten?'))return;start();};
document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>action(button.dataset.action)));
window.addEventListener('keydown',event=>{const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'rotate',ArrowDown:'down',' ':'drop'};if(event.target instanceof HTMLButtonElement && (event.key===' '||event.key==='Enter'))return;if(keys[event.key]){event.preventDefault();action(keys[event.key]);}if(event.key.toLowerCase()==='p'&&!event.repeat)pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&state==='playing')pause();});
function frame(time){const delta=Math.min(time-previous,100);previous=time;if(state==='playing'){elapsed+=delta;if(elapsed>=Math.max(100,750-Math.floor(lines/10)*70)){elapsed=0;if(!move(0,1))lock();}draw();}requestAnimationFrame(frame);}
draw();requestAnimationFrame(frame);
