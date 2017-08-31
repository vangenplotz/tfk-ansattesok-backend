import client from "./client"

const index = 'tfk';
const type = 'department';
const sort = [{ 'name.keyword': { order: 'asc' } }];

const baseQuery = {
	index,
	type,
	body: {}
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
				size,
				sort
			}
		});
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
	} catch (error) {
		return [];
	}
};

export const findByDepartmentName = async (needle, from = 0, size = 100) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					match: {
						name: needle
					}
				},
				from,
				size,
				sort
			}
		});
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
	} catch (error) {
		return [];
	}
};

export const findByDepartmentId = async (id) => {
	try {
		const response = await client.search({
			...baseQuery,
			body: {
				query: {
					match: {
						_id: id
					}
				}
			}
		});
		if (response.hits.total === 0) {
			return null;
		}
		return {
			id: response.hits.hits[0]._id,
			...response.hits.hits[0]._source
		};
	} catch (error) {
		return null;
	}
};