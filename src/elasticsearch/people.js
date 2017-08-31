import client from "./client"

const index = 'tfk';
const type = 'person';

const baseQuery = {
	index,
	type
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
					match: {
						fullName: {
							query: needle,
							fuzziness: 'AUTO'
						}
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