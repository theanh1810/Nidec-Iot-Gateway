const iotBusiness = require('@business/iot.business');
const machineBusiness = require('@business/machine.business');
const planBusiness = require('@business/plan.business');
const reportBusiness = require('@business/report.business');
const { isFunction } = require('@helpers/checkType')

module.exports = {
  async connect(socket) {
    const { handshake, id } = socket;
    const { headers } = handshake;
    const { 'user-agent': userAgent, mac, authorization } = headers;
    if (mac) {
      const iot = await iotBusiness.connect(mac, id);
      socket.emit('update-infor', { Name_machine: iot?.Name || '' });
      if (iot?.MachineID) {
        const intervalId = setInterval(() => {
          reportBusiness.performance(socket, iot.MachineID);
        }, 10000);

        setInterval(() => {
          planBusiness.getCount(socket, iot.MachineID);
        }, 10000);

        global.dicInterval[iot.MachineID] = intervalId;
        global.dicHmiClient[iot.MachineID] = socket;
      }
    }

    // setInterval(() => {
    // 	socket.emit('machine-stock', { value: Number((Math.random() * 100 + 50).toFixed(2)) })
    // }, 2000)
  },
 
  async disconnect(socket) {
    const { handshake, id } = socket;
    const { headers } = handshake;
    const { mac, authorization } = headers;

    if(mac){
      const machineId = await iotBusiness.disconnect(mac, id);

      if (machineId && global.dicInterval[machineId]) {
        clearInterval(global.dicInterval[machineId]);
        global.dicInterval[machineId] = null;
      }
      
      if (machineId && global.dicHmiClient[machineId]) {
        global.dicHmiClient[machineId] = null;
      }
    }
    // authorization || console.log('disconnected', id)
  },

  async getPlanProduction(socket, payload) {
    await planBusiness.get(socket, payload);
  },

  async nextPlanProduction(socket, payload) {
    await planBusiness.next(socket, payload);
  },

  async prevPlanProduction(socket, payload) {
    await planBusiness.back(socket, payload);
  },

  nextProduct(socket, payload) {
    console.log(payload);
  },

  async doNextPlan(socket, payload) {
    await planBusiness.doNextPlan(socket, payload);
  },

  async startPlan(socket, payload) {
    await planBusiness.start(socket, payload);
  },
  async stopPlan(socket, payload) {
    await planBusiness.stop(socket, payload);
  },
  async endPlan(socket, payload) {
    await planBusiness.stop(socket, payload);
  },
  async pausePlan(socket, payload) {
    await planBusiness.pause(socket, payload);
  },
  async updateStates(socket, payload) {
    await machineBusiness.updateState(payload);
  },

  async updateCount(socket, payload, res){
    isFunction(res) && res(true)
    await planBusiness.updateCount(socket, payload);
  },

  async machineStop(socket, payload) {
    await machineBusiness.stop(payload);
  },

  async machineError(socket, payload) {
    await machineBusiness.error(payload);
  },

  async qc(socket, payload) {
    await machineBusiness.qc(socket, payload);
  },

  async updateCavity(socket, payload) {
    await planBusiness.updateCavity(socket, payload);
  },
  async connectIot(socket, payload) {
    await iotBusiness.connectIot(socket, payload);
  },

  
};
