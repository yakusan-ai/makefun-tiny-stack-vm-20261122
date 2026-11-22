import{readdirSync as ls,readFileSync as read,writeFileSync as write,mkdirSync as mkdir}from'node:fs';
const I=process.env.MAKEFUN_INPUT_DIR??'/input',O=process.env.MAKEFUN_OUTPUT_DIR??'/output';
const T=[];
for(const[v,ops]of[[0,[0,48,51,52]],[1,[1,2,82]],[4,[3,49,50,80,81,83]],[6,[4]],[10,[5]],[11,[6]],[15,[7]],[5,[23,27,64]],[9,[16,17,18,19,20,21,22,24,25,26,28,29,30,32,33,34]],[8,[65]]])for(const op of ops)T[op]=v;
for(const id of ls(I,{withFileTypes:true}).filter(d=>d.isDirectory()).map(d=>d.name).sort()){
const p=read(I+'/'+id+'/program.bin'),input=read(I+'/'+id+'/input.bin'),s=[],c=[],m=new Int32Array(256),out=Buffer.alloc(65536);
let pc=0,t=0,ip=0,n=0,e=0;
for(;;){
if(t===1000000){e=10;break}if(pc<0||pc>=p.length){e=9;break}
let op=p[pc++],k=op===1?1:op===2?4:op>=48&&op<=51?2:0;
const needs=T[op];
if(needs===undefined){e=5;break}
const pop=needs>>2,push=needs&3;
if(pc+k>p.length){e=9;break}t++;
if(s.length<pop){e=2;break}if(s.length-pop+push>256){e=3;break}
let v=k===1?p.readInt8(pc):k===4?p.readInt32LE(pc):k===2?p.readUInt16LE(pc):0;pc+=k;
let b=pop?s.pop():0,a=pop>1?s.pop():0,r;
if(op===0)break;
if(op===1||op===2)s.push(v);
else if(op===4)s.push(b,b);
else if(op===5)s.push(b,a);
else if(op===6)s.push(a,b,a);
else if(op===7){r=s.pop();s.push(a,b,r)}
else if(op>=16&&op<=34){
if(op>=19&&op<=22&&!b){e=4;break}
r=op===16?a+b:op===17?a-b:op===18?Math.imul(a,b):op===19?a/b:op===20?a%b:op===21?(a>>>0)/(b>>>0):op===22?(a>>>0)%(b>>>0):op===23?-b:op===24?a&b:op===25?a|b:op===26?a^b:op===27?~b:op===28?a<<b:op===29?a>>b:op===30?a>>>b:op===32?+(a===b):op===33?+(a<b):+((a>>>0)<(b>>>0));s.push(r|0)
}else if(op>=48&&op<=50){if(op===48||(op===49?!b:b))pc+=(v<<16>>16)}
else if(op===51){if(c.length===64){e=7;break}c.push(pc);pc=v}
else if(op===52){if(!c.length){e=8;break}pc=c.pop()}
else if(op===64||op===65){if(b<0||b>255){e=6;break}if(op===64)s.push(m[b]);else m[b]=a}
else if(op===80||op===81){r=op===80?Buffer.from(String(b)):Buffer.from([b&255]);if(n+r.length>65536){e=11;break}r.copy(out,n);n+=r.length}
else if(op===82)s.push(ip<input.length?input[ip++]:-1);
else if(op===83){e=b&255;break}
}
const d=O+'/'+id;mkdir(d,{recursive:true});write(d+'/stdout.bin',out.subarray(0,n));write(d+'/exit.txt',e+'\n');
}
