"Use strict";
var assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

const pool = new Pool({
  connectionString: 'postgresql://aviwe:aviwe@localhost:5432/registrationNumbers'
});

const Registration = require('../registration_numbers');

describe('addRegNum', function () {

    beforeEach(async function () {
      await pool.query('DELETE FROM registrationNumbers');
    });

    it('should return true if registration number is added', async function(){

        let reg = Registration(pool);
     
        assert.equal(true, await reg.addRegNum('CA 123-123'));   

    })

    it('should return false if registration number is not added', async function(){

        let reg = Registration(pool);
     
        assert.equal(false, await reg.addRegNum('CW 123-123'));   

    })

    it('should return added registrationNumber', async function(){

        let reg = Registration(pool);

        let results = await reg.addRegNum('CA 123-123')
     
        assert.deepEqual([ { reg_num: 'CA 123-123' }], await reg.getRegNums());   

    })

});

describe('filterBySelectedTown', function () {

    beforeEach(async function () {
      await pool.query('DELETE FROM registrationNumbers');
    });

    it("should return all registration number when filtered by 'all'", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CA 123-123', town: 1 },
                    { reg_num: 'CF 123-123', town: 4 },
                    { reg_num: 'CJ 123-123', town: 2 },
                    { reg_num: 'CY 123-123', town: 3 }]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.filterBySelectedTown("all"));   

    })

    it("should return registration numbers from Cape Town when filtered by 'CA'", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CA 123-123', town: 1 }]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.filterBySelectedTown("CA"));   

    })

    it("should return registration numbers from Paarl when filtered by 'CJ'", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CJ 123-123', town: 2 }]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.filterBySelectedTown("CJ"));   

    })

    it("should return registration numbers from Belville when filtered by 'CY'", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CY 123-123', town: 3 }]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.filterBySelectedTown("CY"));   

    })

    it("should return registration numbers from Strand when filtered by 'CF'", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CF 123-123', town: 4 }]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.filterBySelectedTown("CF"));   

    })

});

describe('filterBySelectedTown', function () {

    beforeEach(async function () {
      await pool.query('DELETE FROM registrationNumbers');
    });

    it("should return an empty list when cleared", async function(){

        let reg = Registration(pool);

        let res = [ { reg_num: 'CA 123-123'},
                    { reg_num: 'CF 123-123'},
                    { reg_num: 'CJ 123-123',},
                    { reg_num: 'CY 123-123',}]
      

        await reg.addRegNum('CA 123-123');
        await reg.addRegNum('CF 123-123');
        await reg.addRegNum('CJ 123-123');
        await reg.addRegNum('CY 123-123');
     
        assert.deepEqual(res, await reg.getRegNums()); 
        assert.deepEqual([], await reg.clearRegNos()); 

    })
    
    after(async function () {
        await pool.end();
      });

});