import dotenv from "dotenv"
import elasticsearch from "elasticsearch"

dotenv.load();

const client = new elasticsearch.Client({ hosts: [ process.env.ELASTICSEARCH_URL ]});

const deleteIndex = async () => {
	try {
		await client.indices.delete({ index: 'tfk' });
		console.log('Elasticsearch was cleaned.');
	} catch (error) {
		console.log('Elasticsearch was cleaned.');
	}
	client.close();
};

deleteIndex();