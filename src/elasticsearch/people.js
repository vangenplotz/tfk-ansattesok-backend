import client from "./client"

const index = 'tfk';
const type = 'person';

const baseQuery = {
	index,
	type
};

const buildNestedQuery = (params) => {
	const must = [];
	if (params['departmentIds'] && params['departmentIds'].split(',').length > 0) {
		must.push({ terms: { 'positions.departmentId.keyword': params['departmentIds'].split(',')}});
	}
	if (params['partTime'] === params['fullTime']) {
		return must;
	}
	if (JSON.parse(params['partTime'])) {
		must.push({ term: { 'positions.type.keyword': 'Vikar'}})
	}
	if (JSON.parse(params['fullTime'])) {
		must.push({ term: { 'positions.type.keyword': 'Fast ansatt'}})
	}
	return must;
};

const buildQuery = (params) => {
	const must = [];
	if (!!params['q']) {
		must.push({ wildcard: { fullName: `*${params['q'].toLowerCase()}*`}})
	}
	const nested = {
		nested: {
			path: 'positions',
			query: {
				bool: {
					must: buildNestedQuery(params)
				}
			}
		}
	};
	must.push(nested);
	return must;
};

export const findAllByParams = async (params, from = 0, size = 100) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					bool: {
						must: buildQuery(params)
					}
				},
				from,
				size
			}
		});
		return createResponse(response);
	} catch (error) {
		return [];
	}
};

export const findAll = async (from = 0, size = 100) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					match_all: {}
				},
				from,
				size
			}
		});
		return createResponse(response);
	} catch (error) {
		return [];
	}
};

export const findBy = async (field, needle, from = 0, size = 100) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					wildcard: {
						[field]: `*${needle}*`
					}
				},
				from,
				size
			}
		});
		return createResponse(response);
	} catch (error) {
		return [];
	}
};

export const findByFullName = async (needle, from = 0, size = 100) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					regexp: {
						fullName: `.*${needle.toLowerCase()}.*`
					}
				},
				from,
				size
			}
		});
		return createResponse(response);
	} catch (error) {
		return [];
	}
};

export const findByDepartmentId = async (departmentId) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					nested: {
						path: 'positions',
						query: {
							bool: {
								must: {
									match: { 'positions.departmentId': departmentId }
								}
							}
						}
					}
				}
			}
		});
		return createResponse(response);
	} catch (error) {
		return [];
	}
};

export const findById = async (id) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					match: {
						_id: id
					}
				},
				size: 1
			}
		});
		if (response.hits.total === 0) {
			return null;
		}
		return {
			id: response.hits.hits[0]._id,
			...response.hits.hits[0]._source
		}
	} catch (error) {
		return null;
	}
};

const createResponse = (response) => {
	const payload = response.hits.hits.map(hit => {
		return {
			id: hit._id, ...hit._source
		}
	});
	const meta = {
		total: response.hits.total
	};
	return {
		payload,
		meta
	};
};