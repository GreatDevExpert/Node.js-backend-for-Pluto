import path from 'path';
let rootPath = path.normalize(__dirname + '/..');
import plaid from 'plaid';

module.exports = {
	development: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pluto_dev',
		root: rootPath,
		app: {
			name: 'Pluto Backend'
		},
        secret:'secretkeyforplutowebservice',
		admin: {
			email: 'admin@gopluto.io',
			password: 'pass'
		},
		plaid_client_id: '570cbe080259902a3980eaa6',
		plaid_client_secret: 'b335f16d572941e5a68e2f78d8620a',
		plaid_env: plaid.environments.tartan,
		webhook_url: 'http://ec2-54-210-243-213.compute-1.amazonaws.com:3300/api/v1/webhook',

		goalImagesFolder: 'uploads/goals',
		avatarImagesFolder: 'uploads/avatars',
		categoryImagesFolder: 'uploads/categories',
		challengeImagesFolder: 'uploads/challenges'
	},
	production: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pluto_dev',
		root: rootPath,
		app: {
			name: 'Pluto Backend'
		},
		secret:'secretkeyforplutowebservice',
		admin: {
			email: 'admin@gopluto.io',
			password: 'pass'
		},
		plaid_client_id: '570cbe080259902a3980eaa6',
		plaid_client_secret: 'b335f16d572941e5a68e2f78d8620a',
		plaid_env: plaid.environments.production,
		webhook_url: 'http://ec2-54-210-243-213.compute-1.amazonaws.com:3300/api/v1/webhook',

		goalImagesFolder: 'uploads/goals',
		avatarImagesFolder: 'uploads/avatars',
		categoryImagesFolder: 'uploads/categories',
		challengeImagesFolder: 'uploads/challenges'
	}
};
