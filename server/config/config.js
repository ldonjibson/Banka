import dotenv from 'dotenv'
dotenv.config()
let secret = process.env.SECRET_KEY
export {
	// 'secret':'thisisandelabanka'
	secret,
}