module.exports = function(pool){

  var VALID_TAGS = ['all', 'CA', 'CJ', 'CY', 'CF'];

      async function addRegNum(regNum){



        regNum = regNum.toUpperCase();

        var startsWith = regNum.substring(0, 2).trim();

        if (regNum === undefined || regNum === '' || !VALID_TAGS.includes(startsWith)) {
          return false;
        }

        var results = await pool.query('SELECT * FROM registrationNumbers WHERE reg_num = $1', [regNum]);
        if(results.rowCount === 0){

          let townId = await pool.query('SELECT id FROM towns where startsWith = $1', [startsWith]);

          await pool.query('INSERT INTO registrationNumbers (reg_num, town) VALUES ($1, $2)', [regNum, townId.rows[0].id]);
          return true;
        }
      }

      async function getRegNums(){
        let results = await pool.query('SELECT reg_num from registrationNumbers');
        return results.rows;
      }


      async function filterBySelectedTown(selecedTown){

        if (!VALID_TAGS.includes(selecedTown)) {
          return false;
        }

        let filt = await pool.query('SELECT reg_num, town FROM registrationNumbers');

        if(selecedTown !== "all"){
          let tag = await pool.query('SELECT id from towns WHERE startsWith = $1', [selecedTown]);
          return filt.rows.filter(item => item.town == tag.rows[0].id);
        }else{
          return filt.rows;
        }

      }

      async function clearRegNos(){
        let emptyRegs = await pool.query('DELETE FROM registrationNumbers');
        return emptyRegs.rows;
      }

      async function selectors(tag){
        let storedTowns = await pool.query('SELECT town_name , startsWith FROM towns');
        for (let i = 0; i < storedTowns.rowCount; i++) {
          let current = storedTowns.rows[i];
          if (current.startsWith===tag) {
            current.selected = true;
          }
        }
        return storedTowns.rows;
       }

    return {
      addRegNum,
      getRegNums,
      filterBySelectedTown,
      clearRegNos,
      selectors

    }
  }
