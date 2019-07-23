/*
	GoogleAuthenticator
	@author 	luojia@luojia.me
	@copyright 	2016
	@license 	MTI
	@link 		http://luojia.me
	@refer to 	https://github.com/PHPGangsta/GoogleAuthenticator
*/

'use strict';

const crypto = require('crypto');
const charTable=[
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
	'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
	'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
	'Y', 'Z', '2', '3', '4', '5', '6', '7',
	'='
],allowedPeddingCount=[6,4,3,1,0];

function str_split(str,length){
	if(typeof str !== 'string')return [];
	let a=[],i=0;
	length||(length=1);
	do{
		a.push(str.substr(i,length));
		i+=length;
	}while(i<str.length);
	return a;
}
function randInt(min,max){
	if(min===max)return min;
	return (min + Math.random() * (max - min)+0.5)|0;
}
const Base32={
	decode:function(str){
		if(!str)return '';
		let paddingMatch=str.match(/\=+$/),
			paddingCharCount=paddingMatch?paddingMatch[0].length:0;
		if(allowedPeddingCount.indexOf(paddingCharCount)<0)return false;
		for (let i=0;i<4;i++){
			if (paddingCharCount===allowedPeddingCount[i] 
				&& str.substr(-(allowedPeddingCount[i]))!=charTable[32].repeat(allowedPeddingCount[i]))
				return false;
		}
		str=str.replace(/\=+$/,'');
		let binaryString = "";
		for (let i=0;i<str.length;i+=8) {
			let x='';
			if (charTable.indexOf(str[i])<0)return false;
			for (let j=0;j<8;j++) {
				let bin=charTable.indexOf(str[i+j]).toString(2);
				x+='0'.repeat(5-bin.length)+bin;
			}
			let eightBits=str_split(x,8);
			for (let z = 0; z < eightBits.length; z++) {
				let y,cd=parseInt(eightBits[z],2,10);
				binaryString+=((y=String.fromCharCode(cd))||cd==48)?y:"";
			}
		}
		return binaryString;
	}
}

const zeroBuffer=new Buffer([0,0,0,0]);

class GoogleAuthenticator{
	constructor(codeLength){
		this.codeLength=codeLength||6;
	}
	createSecret(secretLength){
		secretLength||(secretLength=16);
		let secret='';
		for (let i=0;i<secretLength;i++) {
			secret+=charTable[randInt(0,charTable.length-2)];
		}
		return secret;
	}
	getCode(secret,timeSlice){
		if(timeSlice===undefined){
			timeSlice=Math.floor((new Date())/1000/30);
		}
		let secretkey=new Buffer(Base32.decode(secret),'ascii'),
			timebuffer=new Buffer(4);
		timebuffer.writeUInt32BE(timeSlice);
		let time=Buffer.concat([zeroBuffer,timebuffer]),
			hm=crypto.createHmac('sha1',secretkey).update(time,'ascii').digest(),
			offset=hm[hm.length-1]&0x0F,
			hashpart=hm.slice(offset,offset+4),
			value=(hashpart.readUInt32BE())&0x7FFFFFFF,
			modulo=Math.pow(10,this.codeLength),
			code=(value%modulo).toString();
		return '0'.repeat(this.codeLength-code.length)+code;
	}
	getQRCodeText(name,secret,title){
		let urlencoded=`otpauth://totp/${name}?secret=${secret}`;
		if(title){
			urlencoded+=`&issuer=${title}`;
		}
		return encodeURI(urlencoded);
	}
	getGoogleQRCodeAPIUrl(name,secret,title){
		return 'https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl='+encodeURIComponent(this.getQRCodeText(name,secret,title));
	}
	verifyCode(secret,code,discrepancy,currentTimeSlice){
		(typeof code!=='number')&&(code=code.toString());
		discrepancy||(discrepancy=1);
		if(currentTimeSlice===undefined){
			currentTimeSlice=Math.floor((new Date())/1000/30);
		}
		for (let i=-discrepancy;i<=discrepancy;i++) {
			let calculatedCode=this.getCode(secret,currentTimeSlice+i);
			if (calculatedCode==code){
				return true;
			}
		}
		return false;
	}
}

/*for debug*/
/*function displayCharCode(a){
	if(a instanceof Buffer){
		let arr=[];
		for(let i=0;i<a.length;i++){
			arr.push(a[i]);
		}
		console.log(arr.join(','));
		//onsole.log(a)
	}else if(typeof a =='string'){
		let arr=[];
		for(let i=0;i<a.length;i++){
			arr.push(a.charCodeAt(i));
		}
		console.log(arr.join(','));
	}
}*/
exports.authenticator=GoogleAuthenticator;