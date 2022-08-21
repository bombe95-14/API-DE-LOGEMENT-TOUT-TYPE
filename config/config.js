
var config = {
    VERSION: 1,
    BUILD: 1,
    URL: 'http://127.0.0.1',
    API_PATH : '/api',
    PORT : process.env.PORT || 8080,
    DB : {
    //MongoDB configuration
    HOST : 'localhost',
    PORT : '27017',
    DATABASE : 'logement'
    },
    /*
    * Get DB Connection String for connecting to MongoDB database
    */
    getDBString : function(){
    return 'mongodb://'+ this.DB.HOST +':'+ this.DB.PORT +'/'+ this.DB.DATABASE;
    }
    
}

module.exports = config;
