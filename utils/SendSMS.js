const AfricasTalking = require("africastalking");

// TODO: Initialize Africa's Talking

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICA_API_KEY,
  username: process.env.AFRICA_API_USER,
});

module.exports = async (options) => {
  console.log(options);
  await africastalking.SMS.send({
    to: options.number,
    message: `
    id: ${Date.now()}
    ${options.message}`,
    from: "36689",
  });
};
