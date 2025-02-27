const AfricasTalking = require("africastalking");

// TODO: Initialize Africa's Talking

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICA_API_KEY,
  username: process.env.AFRICA_API_USER,
});

module.exports = async (options) => {
  await africastalking.SMS.send({
    to: options.number,
    message: options.message,
    from: "36689",
  });
};
