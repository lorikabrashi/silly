const rewire = require('rewire')
const faker = require('faker')
const expect = require('chai').expect
const general = rewire('../../helpers/general')

describe('General functions testing', function () {
    describe('Function getBoolean', () => {
        it('Should return always a boolean', () => {
            expect(general.getBoolean()).to.be.a('boolean')
        })
        it('Should return true', () => {
            expect(general.getBoolean('1')).to.equal(true)
        })
        it('Should return false', () => {
            expect(general.getBoolean('0')).to.equal(false)
        })
    })

    describe('Function isEmptyObject', () => {
        it('Should return true (Empty)', () => {
            expect(general.isEmptyObject({})).to.be.equal(true)
        })
        it('Should return false (not Empty)', () => {
            expect(general.isEmptyObject(faker.helpers.createCard())).to.be.equal(false)
        })
        it('Should return Error (No object provided!)', () => {
            expect(() => {
                general.isEmptyObject()
            }).throw('No object provided!')
        })
    })

    describe('Function getDefaultQueryParams', () => {
        const fakeParams = {
            fields: faker.fake('{{name.firstName}},{{name.lastName}},{{date.past}}'),
            offset: faker.random.number(),
            limit: faker.random.number(),
        }
        const result = general.getDefaultQueryParams(fakeParams)

        it('Should return an object with fields(array), offset (min = 0), limit (min = 0, max = 50)', () => {
            expect(result.fields).to.be.an('array')
            expect(result.offset).to.be.a('number')
            expect(result.offset).to.be.above(-1)
            expect(result.limit).to.be.a('number')
            expect(result.limit).to.be.above(-1)
            expect(result.limit).to.be.below(51)
        })
    })

    describe('Function extractFields', () => {
        const mockData = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            address: faker.address.streetAddress(),
            userDetails: faker.helpers.userCard(),
        }
        const fields = ['address', 'email', 'userDetails.username']
        const result = general.extractFields(mockData, fields)
        it('Should extract address, email and username as an innerchild and number from array', () => {
            expect(result).to.be.an('object')
            expect(result).to.have.property('address')
            expect(result).to.have.property('email')
            expect(result).to.have.property('userDetails.username')
        })
    })

    describe('Function filterImage', () => {
        it('Should return true for different image types that are allowed and false for others ', (done) => {
            const filterImage = general.__get__('filterImage')
            const tests = [
                {
                    mimetype: 'image/jpeg',
                    expected: true,
                },
                {
                    mimetype: 'image/png',
                    expected: true,
                },
                {
                    mimetype: 'other',
                    expected: false,
                },
            ]
            tests.forEach((test) => {
                it('', (done) => {
                    filterImage({}, test.mimetype, (_, result) => {
                        expect(result).to.be.a('boolean')
                        expect(result).to.be.equal(test.expected)
                        done()
                    })
                })
            })
            done()
        })
    })
})
