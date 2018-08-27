const Koa=require('koa');
const http=require('http');
const https = require('https');
const cheerio = require('cheerio');
const path = require('path');
const serve = require('koa-static');
const fs=require('fs');
const {cmd}=require('./cmd');
const zlib = require('zlib');

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
    const $ = cheerio.load(await fetch(ctx.request.query.url));
    $('body').find('img').each(function(i, elem) {
      if(elem.attribs.src.indexOf("http")<0){
        links+="https:"+elem.attribs.src+"\n"
      }else{
        links+=elem.attribs.src+"\n"
      }
    })
    console.log(links)
    await fs.writeFile('tmpImg.txt',links, (err) => {
      if (err) throw err;
      console.log('save success');
    });
    await cmd("wget -i tmpImg.txt")
    await cmd("cd public")
    await cmd("zip   tmpImg.zip *")
    const inp = fs.createReadStream('public');
    const out = fs.createWriteStream('public.gz');

    inp.pipe(gzip).pipe(out);
    ctx.response.body='$'
  }
};

app.use(main);
app.use(public);

app.listen(3001,()=>{
	console.log('3001 running')
})