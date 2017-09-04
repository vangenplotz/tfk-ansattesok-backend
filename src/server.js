import hapi from "hapi"
import good from "good"
import inert from "inert"
import vision from "vision"
import swagger from "hapi-swagger"
import controllers from "./controllers"

const server = new hapi.Server();
server.connection({ host: '0.0.0.0', port: 3000 });
server.register([{
	register: good,
	options: {
		reporters: {
			console: [
				{
					module: 'good-squeeze',
					name: 'Squeeze',
					args: [
						{
							response: '*',
							log: '*'
						}
					]
				}, {
					module: 'good-console'
				}, 'stdout'
			]
		}
	}
},
	inert,
	vision,
	{
		register: swagger,
		options: {
			info: {
				title: 'Telemark Ansatt API docs',
				version: '1.0.0',
				description: 'A API for employees and departments of Telemark Fylkeskommune',
				contact: {
					email: 'post@vangenplotz.no',
					url: 'https://vangenplotz.no'
				},
			},
			consumes: ['application/json'],
			produces: ['application/json']
		}
	}
]);
server.route(controllers);

server.start(error => {
	if (error) {
		throw error;
	}
	server.log('info', `Server running at ${server.info.uri}`)
});
