'use strict';

var authenticator=require('./index.js').authenticator;
var nya=new authenticator();
var secretLnegth=32;
var secret=nya.createSecret(secretLnegth);
var url=nya.getGoogleQRCodeAPIUrl('random/code',secret,'test');

function refresh(){
	console.log(Date());
	console.log('secret:',secret);
	let code=nya.getCode(secret);
	console.log('code:',code);
	console.log('verify code '+code+':',nya.verifyCode(secret,code));
	console.log('url:',url);
	console.log('\n\n\n\n');
}
refresh();
setInterval(refresh,10000);