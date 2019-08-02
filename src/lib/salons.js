const {SALONS} = require('../../config');

var salons=[];

SALONS.forEach(salon => {
        
    salons[salon.name] = {local: salon.file !== "", ...salon}
    
})

module.exports=salons