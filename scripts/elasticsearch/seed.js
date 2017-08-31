import dotenv from "dotenv"
import elasticsearch from "elasticsearch"
import fs from "fs"
import path from "path"

dotenv.load();

const index = 'tfk';

const client = new elasticsearch.Client({ hosts: [ process.env.ELASTICSEARCH_URL ]});

const getIndex = async () => {
	try {
		 await client.indices.get({ index: 'tfk' });
		 console.log('This index already exist. Script terminating...');
		 return process.exit(1);
	} catch (error) {
		if (error.statusCode === 404) {
			return true;
		}
		throw error;
	}
};

const createIndex = async () => {
	try {
		await client.indices.create({ index });
		console.log(`Created index \'${index}\'`);
	} catch (error) {
		throw error;
	}
};

const createMapping = async () => {
	try {
		await client.indices.putMapping({
			index,
			type: 'person',
			body: {
				properties: {
					positions: {
						type: 'nested'
					},
					fullName: {
						type: 'string'
					},
					givenName: {
						type: 'string',
						copy_to: 'fullName'
					},
					familyName: {
						type: 'string',
						copy_to: 'fullName'
					}
				}
			}
		});
		console.log(`Created mapping \'person\' for index \'${index}\'`);
	} catch (error) {
		throw error;
	}
};

const getDepartments = (positions) => {
	return positions.reduce((accumulator, currentPosition) => {
		accumulator[currentPosition.departmentId] = { id: currentPosition.departmentId, name: currentPosition.departmentName };
		return accumulator;
	}, {});
};

const getBulkDataInput = (data) => {
	let departments = {};

	const employeePayload = data.results.reduce((accumulator, currentItem) => {
		departments = { ...departments, ...getDepartments(currentItem.positions)};
		accumulator.push({ index: { _index: index, _type: 'person', _id: currentItem.personId }});
		const { personId, ...person } = currentItem;
		accumulator.push(person);
		return accumulator;
	}, []);

	const departmentPayload = Object.keys(departments).reduce((accumulator, department) => {
		accumulator.push({ index: { _index: index, _type: 'department', _id: departments[department].id }});
		accumulator.push({ name: departments[department].name });
		return accumulator;
	}, []);

	return {
		employeePayload,
		departmentPayload
	};
};

const readDataFile = () => {
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'data', 'ansatte.json'), 'utf8'));
	return getBulkDataInput(data);
};

const bulkInsert = async (payload) => {
	try {
		await client.bulk({ body: payload });
	} catch (error) {
		throw error;
	}
};

const seed = async () => {
	await getIndex();
	await createIndex();
	await createMapping();
	const payload = readDataFile();
	await bulkInsert(payload.employeePayload);
	await bulkInsert(payload.departmentPayload);
	console.log('Script executed successfully.')
};

seed();