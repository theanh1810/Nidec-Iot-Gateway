const oeeBusiness = require('@business/oee.business');

module.exports = {

  async callInitStatus(socketClient) {
	  await oeeBusiness.initStatus(socketClient);
  },
  async autoStartPlan(socketClient) {
	  await oeeBusiness.autoStartPlan(socketClient);
  },
  async refreshPlan(payload) {
	  await oeeBusiness.refreshPlan(payload);
  },
  async clearPlan(payload) {
	  await oeeBusiness.clearPlan(payload);
  },
};
