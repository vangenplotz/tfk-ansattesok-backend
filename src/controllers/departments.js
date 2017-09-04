import * as departments from "../elasticsearch/departments"
import joi from "joi"

const findAll = {
	method: 'GET',
	path: '/departments',
	config: {
		description: 'Get a list of departments',
		tags: ['api'],
		validate: {
			query: {
				field: joi.string(),
				q: joi.string(),
				page: joi.number().integer(),
				size: joi.number().integer()
			}
		}
	},
	handler: async (req, res) => {
		if (!req.query['field' || !req.query['q']]) {
			const response = await departments.findAll(req.query['page'], req.query['size']);
			return res({ departments: response.payload })
					.header('X-TOTAL', response.meta.total)
					.code(200);
		} else if (req.query['field'] && req.query['q']) {
			const response = await departments.findByDepartmentName(req.query['q'], req.query['page'], req.query['size']);
			return res({ departments: response.payload })
					.header('X-TOTAL', response.meta.total)
					.code(200);
		}
		return res().code(400);
	}
};

const findById = {
	method: 'GET',
	path: '/departments/{id}',
	config: {
		description: 'Get a single department',
		tags: ['api'],
		validate: {
			params: {
				id: joi.number().integer()
			}
		}
	},
	handler: async (req, res) => {
		if (!req.params.id) {
			return res.code(404);
		}
		const response = await departments.findByDepartmentId(req.params.id);
		if (!response) {
			return res.code(404);
		}
		return res({ department: response })
				.code(200);
	}
};

export default [
	findAll,
	findById
]