'use strict';

var authenticator=require('./index.js').authenticator;

var nya=new authenticator();

console.log('==============Random test=============');
var secret=nya.createSecret(32);
console.log('secret:',secret);

var code=nya.getCode(secret);
console.log('code:',code);

var verifyResult1=nya.verifyCode(secret,code);
console.log('verify result of:'+code,verifyResult1);

var verifyResult2=nya.verifyCode(secret,"123456");
console.log('verify esult of:123456',verifyResult2);

var QRaddr=nya.getGoogleQRCodeAPIUrl('poi test/'+secret,secret,'poi');
console.log('QR address:',QRaddr);
console.log('\n\n');
console.log('================fixed test================');
console.log('code of QYTACVMTAYCPZDYS',nya.getCode('QYTACVMTAYCPZDYS'));
console.log('QR of QYTACVMTAYCPZDYS',nya.getGoogleQRCodeAPIUrl('poi test/QYTACVMTAYCPZDYS','QYTACVMTAYCPZDYS','poi'));