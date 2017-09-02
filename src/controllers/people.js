import * as people from "../elasticsearch/people"

const findAll = {
	method: 'GET',
	path: '/people',
	handler: async (req, res) => {
		if (req.query['fullTime'] || req.query['partTime'] || req.query['departmentIds']) {
			const response = await people.findAllByParams(req.query, req.query['page'], req.query['size']);
			return res({ people: response.payload })
					.header('X-TOTAL', response.meta.total)
					.code(200);
		} else if (!req.query['field'] || !req.query['q']) {
			const response = await people.findAll(req.query['page'], req.query['size']);
			return res({ people: response.payload })
					.header('X-TOTAL', response.meta.total)
					.code(200);
		}
		let response = [];
		switch (req.query['field']) {
			case 'givenname':
				response = await people.findBy('givenName', req.query['q']);
				break;
			case 'familyname':
				response = await people.findBy('familyName', req.query['q']);
				break;
			case 'fullname':
				response = await people.findByFullName(req.query['q']);
				break;
			default:
				return res().code(400);
		}
		return res({ people: response.payload})
				.header('X-TOTAL', response.meta.total)
				.code(200);
	}
};

const findById = {
	method: 'GET',
	path: '/people/{id}',
	handler: async (req, res) => {
		if (!req.params.id) {
			return res().code(400);
		}
		const response = await people.findById(req.params.id);
		if (!response) {
			return res().code(404);
		}
		return res({ person: response }).code(200);
	}
};

const findByDepartmentId = {
	method: 'GET',
	path: '/departments/{departmentId}/people',
	handler: async (req, res) => {
		if (!req.params.departmentId) {
			return res().code(400);
		}
		const response = await people.findByDepartmentId(req.params.departmentId);
		return res({ people: response.payload})
				.header('X-TOTAL', response.meta.total)
				.code(200);
	}
};


export default [
		findAll,
		findById,
		findByDepartmentId
]