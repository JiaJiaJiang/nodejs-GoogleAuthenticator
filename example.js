'use strict';

var authenticator=require('./index.js').authenticator;

var nya=new authenticator();//以code位数为参数new一个验证器，默认为6

console.log('随机密钥测试');
var secret=nya.createSecret();//可选参数为密钥长度
console.log('secret:',secret);

var code=nya.getCode(secret);
console.log('code:',code);

var verifyResult1=nya.verifyCode(secret,code);
console.log('verify result of:'+code,verifyResult1);

var verifyResult2=nya.verifyCode(secret,123456);
console.log('verify esult of:123456',verifyResult2);

var QRaddr=nya.getQRCodeGoogleUrl('poi test/'+secret,secret,'poi');
console.log('QR address:',QRaddr);
console.log('\n\n');
console.log('固定密钥测试');
console.log('code of QYTACVMTAYCPZDYS',nya.getCode('QYTACVMTAYCPZDYS'));
console.log('QR of QYTACVMTAYCPZDYS',nya.getQRCodeGoogleUrl('poi test/QYTACVMTAYCPZDYS','QYTACVMTAYCPZDYS','poi'));