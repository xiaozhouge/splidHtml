const Koa=require('koa');
const http=require('http');
const https = require('https');
const cheerio = require('cheerio');
const path = require('path');
const serve = require('koa-static');
const fs=require('fs');
const {test}=require('./test');
const zlib = require('zlib');
const {cmd}=require('./cmd');
const gzip = zlib.createGzip();
const app=new Koa();
const public = serve(path.join(__dirname)+'/public/');
const fetch=(url)=>{
	return new Promise((resolve,reject)=>{
		let  body='';
		const req = https.request(url, (res) => {
		  console.log(`resstatus: ${res.statusCode}`);
		  //console.log(`reshead: ${JSON.stringify(res.headers)}`);
		  res.setEncoding('utf8');
		  res.on('data', (chunk) => {
		  	body+=chunk;
		    // console.log(`resbody: ${chunk}`);
		  });
		  res.on('end', () => {
        console.log('no message');
		    resolve(body)
		  });
		});

		req.on('error', (e) => {
		  console.error(`errmsg: ${e.message}`);
		  reject(error)
		});
		req.end();
	})
} 
const main = async ctx => {
  if (ctx.request.path === '/') {
     ctx.response.type = 'html';
     ctx.response.body = fs.createReadStream('./public/index.html');
  } else {
    console.log(ctx.request.query.url)
    let links = "";
    let dom=await fetch(ctx.request.query.url);
    const $ = cheerio.load(dom);
    $('body').find('img').each(function(i, elem) {
      if(elem.attribs.src.indexOf("http")<0){
        links+="https:"+elem.attribs.src+"\n"
      // cmd("wget "+"https:"+elem.attribs.src+"   -P /home/gxz/splidHtml/splidHtml/public")
      }else{
        links+=elem.attribs.src+"\n"
	//cmd("wget "+elem.attribs.src+" -P /home/gxz/splidHtml/splidHtml/public")
      }
    })
    console.log(links)
    await fs.writeFile('tmpImg.txt',links, (err) => {
      if (err) throw err;
      console.log('save success');
	console.log(path.join(__dirname)+'/public/')
    });
    await fs.writeFile('./public/index.html',dom, (err) => {
      if (err) throw err;
      console.log('save success');
    });
    setTimeout(()=>{
	test()
        cmd()
  },5000)
   // test()
   // cmd()
    //cmd("popd")
    ctx.response.body='$'
  }
};

app.use(main);
app.use(public);

app.listen(3006,()=>{
	console.log('3006  running')
})
