const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    const config = require('./config.json');
    Object.keys(config.development).forEach((key)=>{
        process.env[key] = config.development[key];
    });
}