import elasticsearch from "elasticsearch"
import dotenv from "dotenv"

dotenv.load();

const client = new elasticsearch.Client({
	hosts: [process.env.ELASTICSEARCH_URL]
});

export default client;