var path = require('path');
var development = process.argv.length > 2 && process.argv[2] === '--dev';//process.env.NODE_ENV !== 'production';

module.exports = {
	server: {
		listenPort: 5050,                                   
		distFolder: path.resolve(__dirname, development ? '../../app/src': '../../dist'),  
		staticUrl: '/'                               
	},
	devEnv: development
};
