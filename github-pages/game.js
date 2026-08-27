const rounds = [
  {name:"elephants", label:"Elephant", answer:1, sprite:0},
  {name:"giraffes", label:"Giraffe", answer:2, sprite:1},
  {name:"bears", label:"Bear", answer:3, sprite:2},
  {name:"crocodiles", label:"Crocodile", answer:4, sprite:3},
  {name:"tigers", label:"Tiger", answer:5, sprite:4},
  {name:"kangaroos", label:"Kangaroo", answer:6, sprite:5},
  {name:"lions", label:"Lion", answer:7, sprite:6},
  {name:"zebras", label:"Zebra", answer:8, sprite:7},
  {name:"monkeys", label:"Monkey", answer:9, sprite:8},
  {name:"pandas", label:"Panda", answer:10, sprite:9},
  {name:"foxes", label:"Fox", answer:11, sprite:10},
  {name:"hippos", label:"Hippopotamus", answer:3, sprite:11},
  {name:"macaws", label:"Macaw", answer:6, sprite:12},
  {name:"wolves", label:"Wolf", answer:9, sprite:13}
];
const words=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven"];
let screen="start", index=0, score=0, counted=0, wrong=[], sound=true;
const root=document.getElementById("game");

function voice(text){
  if(!sound || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text), voices=speechSynthesis.getVoices();
  u.voice=voices.find(v=>v.lang==="en-GB" && /natural|enhanced|premium|serena|sonia|daniel/i.test(v.name)) || voices.find(v=>v.lang==="en-GB") || null;
  u.lang="en-GB"; u.rate=.86; u.pitch=1.02; speechSynthesis.speak(u);
}
function shell(content){return '<header><div class="brand"><span class="brand-star">✦</span><span><small>Учимся с</small><b>Ларисой Коротаевой</b></span></div><button id="sound" class="sound" aria-label="Toggle sound">'+(sound?'Sound on':'Sound off')+'</button></header>'+content;}
function options(answer){const v=[answer-1,answer,answer+1].map(n=>Math.max(1,Math.min(11,n)));return new Set(v).size<3?(answer===1?[1,2,3]:[9,10,11]):v;}
function render(){
  if(screen==="start") root.innerHTML=shell('<section class="start-card"><div class="eyebrow">COUNT 1–11</div><h1>Wild Animal<br><span>Counting Adventure</span></h1><p>Meet friendly animals, count them in order and choose the right number.</p><div class="hero-animal sprite s6"></div><button class="primary" id="start">START <span>→</span></button><small>14 fun rounds · British English</small></section>');
  else if(screen==="finish") {root.innerHTML=shell('<section class="finish-card"><div class="medal"><span>★</span></div><div class="eyebrow">ADVENTURE COMPLETE</div><h1>Brilliant counting!</h1><p>You counted all the wild animals.</p><div class="final-score">'+score+' / '+rounds.length+' stars</div><button class="primary" id="again">PLAY AGAIN</button></section>');celebration();}
  else {
    const r=rounds[index];
    const animals=Array.from({length:r.answer},(_,i)=>'<button class="animal '+(i<counted?'done':'')+'" data-i="'+i+'" aria-label="'+r.label+' '+(i+1)+'"><span class="sprite s'+r.sprite+'"></span><i>'+(i<counted?i+1:'')+'</i></button>').join('');
    const answers=options(r.answer).map(n=>'<button class="answer '+(wrong.includes(n)?'wrong':'')+'" data-answer="'+n+'" '+(counted<r.answer?'disabled':'')+'>'+n+'</button>').join('');
    root.innerHTML=shell('<section class="play-card"><div class="status"><span>Round '+(index+1)+' of '+rounds.length+'</span><b>★ '+score+'</b></div><div class="progress"><i style="width:'+((index/rounds.length)*100)+'%"></i></div><button id="question" class="question">Count the '+r.name+'. How many are there? <span>Listen</span></button><div class="animal-grid count-'+r.answer+'">'+animals+'</div><div class="answer-zone"><p>'+(counted<r.answer?'Count every animal in order':'Choose the answer')+'</p><div class="answers">'+answers+'</div></div></section>');
  }
  bind();
}
function bind(){
  document.getElementById("sound")?.addEventListener("click",()=>{sound=!sound;speechSynthesis?.cancel();render();});
  document.getElementById("start")?.addEventListener("click",()=>{screen="play";voice("Let's count the wild animals!");render();});
  document.getElementById("again")?.addEventListener("click",()=>{index=0;score=0;counted=0;wrong=[];screen="play";render();});
  document.getElementById("question")?.addEventListener("click",()=>voice("Count the "+rounds[index].name+". How many are there?"));
  document.querySelectorAll(".animal").forEach(el=>{const act=()=>{const i=Number(el.dataset.i);if(i!==counted)return;counted++;voice(words[counted]);render();};el.addEventListener("mouseenter",act,{once:true});el.addEventListener("click",act,{once:true});});
  document.querySelectorAll(".answer").forEach(el=>el.addEventListener("click",()=>choose(Number(el.dataset.answer))));
}
function choose(n){const r=rounds[index];if(counted<r.answer)return;if(n!==r.answer){wrong.push(n);voice("Try again");render();return;}score++;voice("Great job!");setTimeout(()=>{index++;counted=0;wrong=[];if(index===rounds.length)screen="finish";render();},700);}
function celebration(){if(!sound)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ctx=new AC(),now=ctx.currentTime;[523,659,784,1047].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type="triangle";o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.18);g.gain.linearRampToValueAtTime(.18,now+i*.18+.03);g.gain.exponentialRampToValueAtTime(.001,now+i*.18+.55);o.connect(g).connect(ctx.destination);o.start(now+i*.18);o.stop(now+i*.18+.6);});}
render();
