const webpack = require("webpack");
const logger = require("./logger")

let prodConfig = require('./config/prod.config')


const compiler = webpack(prodConfig);
  
compiler.run((err, stats) => {
    if(err){
        logger.ciLoger.error(err)
        return
    }
    let statsJson = stats.toJson()
    Console.log(statsJson)
    logger.ciLoger.info(statsJson)
});