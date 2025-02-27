const credentials = {
    apiKey: process.env.AFRICA_API_KEY,
    username: process.env.AFRICA_API_USER
}

const AfricasTalking = require('africastalking')(credentials)

const airtime = AfricasTalking.AIRTIME

module.exports = async (option)=>{
    const options = {
        recipients: [{
            phoneNumber: option.number,
            currencyCode: option.currencyCode,
            amount: option.amount
        }]
    };
    await airtime.send(options)
}
