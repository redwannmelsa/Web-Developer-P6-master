const multer = require('multer'); //middleware imported to process images

//object used to assign mime type to a file name extension in const storage
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png'
};

//storing images sent by users to be saved locally
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		const name = file.originalname.split(' ').join('_'); //in case file has spaces in its name, replaces them with underscore
		const extension = MIME_TYPES[file.mimetype]; //gets the corresponding extension type based on the sent image's mime type
		callback(null, name + Date.now() + '.' + extension); //concatenates the name of the file, the current time when processed and the extension to generates a new unique file name
	}
});

module.exports = multer({ storage }).single('image');