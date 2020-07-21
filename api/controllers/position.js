const positionModel = require('../models/position')
const projectModel = require('../models/project')
const { extractFields, getDefaultQueryParams } = require('../helpers/general')

module.exports = {
    create: async (params) => {
        const fields = {
            type: params.type,
            description: params.description,
            status: params.status,
            parent_id: params.parent_id,
        }
        const position = await positionModel.create(fields)
        await projectModel.update({ _id: fields.parent_id }, { $push: { positions: position._id } })

        return `Created position - ${position._id}`
    },
    find: async (qParams) => {
        qParams = getDefaultQueryParams(qParams)
        const positions = await positionModel.find({}, { __v: 0 }, { skip: qParams.offset, limit: qParams.limit })

        return Array.from(positions).map((position) => {
            return extractFields(position, qParams.fields)
        })
    },
    findById: async (id, qParams) => {
        qParams = getDefaultQueryParams(qParams)
        const position = await positionModel.findById(id, { __v: 0 }, { skip: qParams.offset, limit: qParams.limit })
        return extractFields(position, qParams.fields)
    },
    update: async (id, params) => {
        const fields = {
            type: params.type,
            description: params.description,
            status: params.status,
        }
        return await positionModel.findByIdAndUpdate(id, fields, { new: true }).select('-__v').exec()
    },
    delete: async (id) => {
        const position = await positionModel.findByIdAndRemove(id).exec()
        return `Deleted position - ${position._id}`
    },
}
