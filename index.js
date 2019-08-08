const koa = require('koa')
const Router = require('koa-router')
const fs = require('fs')
const multer = require('multer')
const storage = multer.diskStorage({
	destination : (req, file, callback) => {
		callback(null, './')
	}
})
const upload = multer({storage}).single('upfile')

const app = new koa()
const router = new Router()

app.use(router.routes())

router.get('/', async ctx => {
	ctx.type = 'html'
	ctx.body = fs.createReadStream('index.html')
})

router.post('/api/fileanalyse', async ctx => {
		let {req, res} = ctx
		let obj = await get_details(ctx)
		if(obj) { 
			let file_details = {
				name : obj.originalname,
				type : obj.mimetype,
				size : obj.size
			}
			ctx.body = JSON.stringify(file_details, null, " ")
		} else {
			ctx.body = {"Error" : "Please Select File"}
		}
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log("Server started on ", PORT))

function l(e) { console.log(e) }

async function get_details(ctx) {
	let {req, res} = ctx
	return new Promise((resolve, rej) => {
		upload(req, res, (err) => {
			if(err) rej(err)
			if(req.file){
						fs.unlink('./'+req.file.filename, (err) => {
							if(err) rej(err)
						});
						resolve(req.file)
			} else {
				resolve(0)
			}
		})
	})
}