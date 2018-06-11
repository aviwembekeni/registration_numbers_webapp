module.exports = function Registration_numbers(pool){
  
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
  
      function regNumberFromTown(regNum){
        if (regNum.startsWith('CA') || regNum.startsWith('CJ') || regNum.startsWith('CF') || regNum.startsWith('CY')) {
          return true;
        }else {
          return false;
        }
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
        /*var filteredObj = {};
        var startsWith ;
  
        if (selecedTown == "cape town") {
          startsWith = 'CA';
        } else if (selecedTown == "paarl") {
          startsWith = 'CJ';
        } else if (selecedTown == "belville") {
          startsWith = 'CY';
        } else if (selecedTown == "strand") {
          startsWith = 'CF';
        }else if (selecedTown == "all") {
          return regNums;
        }
  
        Object.keys(regNums).map(regNo =>{
         if (regNo.startsWith(startsWith)) {
           filteredObj[regNo] = 0;
         }
  
        })
  
        return filteredObj;*/
      }
  
      async function clearRegNos(){
        let emptyRegs = await pool.query('DELETE FROM registrationNumbers');
        return emptyRegs.rows;
      }

      async function selectors(tag){
        let towns = await pool.query('SELECT town_name , startsWith FROM towns');
        for (let i = 0; i < towns.rowCount; i++) {
          let current = towns.rows[i];
          if (current.startsWith===tag) {
            current.selected = true;
          }
        }
        return towns.rows;
       }
  
    return {
      addRegNum,
      getRegNums,
      regNumberFromTown,
      filterBySelectedTown,
      clearRegNos,
      selectors

    }
  }