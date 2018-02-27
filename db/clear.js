const mongoose = require('../config/database')

mongoose.connection.dropDatabase(function(){
    console.log('Database cleared.')
})
