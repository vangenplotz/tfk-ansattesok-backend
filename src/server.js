import hapi from "hapi"
import good from "good"
import controllers from "./controllers"

const server = new hapi.Server();
server.connection({ host: '0.0.0.0', port: 3000 });
server.route(controllers);

server.register({
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
});

server.start(error => {
	if (error) {
		throw error;
	}
	server.log('info', `Server running at ${server.info.uri}`)
});
