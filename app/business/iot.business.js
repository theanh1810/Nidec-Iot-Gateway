const MasterIot = require('@models/MasterIot');
const { Op } = require('sequelize');
const { iotStatusLogger } = require('@providers/logger');
const socketClient = require('@socketClient');
var dicDisconnectedTimeout = {}

module.exports = {
  async isDuplicateName({ mac, name }) {
    const where = {};

    if (mac) where.Mac = { [Op.not]: mac };
    if (name) where.Name = name;

    const countIot = await MasterIot.count({ where });
    return countIot === 1;
  },

  async isRegistered(mac) {
    const countIot = await MasterIot.count({ where: { Mac: mac } });
    return countIot === 1;
  },

  async reset() {
    await MasterIot.update(
      {
        IsConnected: false,
        SocketID: null,
      },
      {
        where: {},
      }
    );
  },

  async connect(mac, socketId) {
    console.log(`time: ${new Date()} , connected: ${mac}`);

    if(dicDisconnectedTimeout[mac]){
      clearTimeout(dicDisconnectedTimeout[mac]);
      dicDisconnectedTimeout[mac] = null;
    }
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });

    if (iot) {
      iot.IsConnected = true;
      iot.SocketID = socketId;
      await iot.save();

      iotStatusLogger.info(
        JSON.stringify({ MAC: iot.Mac, Name: iot.Name, status: 'connected' })
      );
      dicMachineStatus[iot.MachineID] = 1;
      socketClient.emit('connect-machine', {
        mac: mac,
        machineId: iot.MachineID,
        status: 1,
        statusMachine: 1,
      });

      return iot;
    }

    return null;
  },

  async disconnect(mac, socketId) {
    // wait to 5s for connect
    console.log(`time: ${new Date()} , disconnected: ${mac}`);
    var timeOutId = setTimeout(async ()=>{

      console.log('over 30s: ', mac);
      const iot = await MasterIot.findOne({
        where: {
          Mac: mac,
          SocketID: socketId,
        },
      });
  
      if (iot) {
        iot.IsConnected = false;
        await iot.save();
  
        dicMachineStatus[iot?.MachineID] = 4;
  
        iotStatusLogger.info(
          JSON.stringify({ MAC: iot.Mac, Name: iot.Name, status: 'disconnected' })
        );
  
        payload = {run: false, stop: false, error: false, count: false};
        payload.machineId = iot?.MachineID;
        socketClient.emit('status-machine', payload);
        return iot?.MachineID;
      }
    }, 2000);
    dicDisconnectedTimeout[mac] = timeOutId;
    return null;
    
  },

  async update(mac, firmware = null, ip = null) {
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });

    if (iot) {
      iot.Version = firmware;
      await iot.save();
    }
  },
  async connectIot(socket, payload) {
    try {
      const { mac } = payload;
      const iot = await MasterIot.findOne({
        where: {
          Mac: mac,
        },
      });
      if (iot) {
        socket.emit('update-infor', { Name_machine: iot?.Name || '' });
      }
    } catch (e) {
      console.log('update-cavity', e);
    }
  },
};
