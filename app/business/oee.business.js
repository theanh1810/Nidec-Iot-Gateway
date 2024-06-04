const MasterMachine = require('@models/MasterMachine');
const { iotStatusLogger } = require('@providers/logger');
const moment = require('moment');
const MasterBom = require('@models/MasterBom');
const CommandProductionDetail = require('@models/CommandProductionDetail');
const { Sequelize } = require('sequelize');

module.exports = {
  async initStatus(socketClient) {
    iotStatusLogger.info(`ooe init call status`);
    const machineAll = await MasterMachine.findAll({
      where: {
        IsDelete: false,
      },
    });

    //console.log('Call STT', machineAll)
    let data = [];
    for (let machine of machineAll) {
      let stt = {
        machineId: machine.ID,
        run: 0, //Tín hiệu máy chạy
        stop: 0, //Tín hiệu máy dừng
        error: 0, //Tín hiệu máy lỗi
        disconnect: 0,
        time: moment().format('YYYY-MM-DD HH:mm:ss'), //string, Thời gian đồng bộ giữ IOT và Server
      };

      switch (global.dicMachineStatus?.[machine.ID]) {
        case 1:
          stt.run = 1;
          break;
        case 2:
          stt.stop = 1;
          break;
        case 3:
          stt.error = 1;
          break;
        case 4:
          stt.disconnect = 1;
          break;
      }

      data.push(stt);
    }

    // console.log(data);
    socketClient.emit('call-status-machine-back', data);
  },

  async autoStartPlan(data) {
    const { machine_id, plans } = data;
    if (global.dicHmiClient[machine_id] && plans[0]) {
      const socket = global.dicHmiClient[machine_id];
      const plan = plans[0];

      const masterBoms = await MasterBom.findAll({
        where: {
          Product_BOM_ID: plan.Product_ID,
          Mold_ID: plan.Mold_ID,
        },
        include: [{ all: true }],
      });

      const count = (plan.Count > 0) ? plan.Count : 0;
      // data return
      const firstPlan = masterBoms.find(
        (a) =>
          a.Product_BOM_ID === plan?.Product_ID && a.Mold_ID === plan?.Mold_ID
      );
      if (!firstPlan) return;

      const data = {
        Plan_Id: Number(plan?.ID),
        ProductId_1: firstPlan?.product.Symbols || '',
        MoldId_1: firstPlan?.mold.Symbols || '',
        MaterialID_1: firstPlan?.materials?.Symbols || '',
        Cavity_1: firstPlan?.Cavity || 0,
        ProductId_2: '',
        MoldId_2: '',
        MaterialID_2: '',
        Cavity_2: plan?.Cavity_Real || 0,
        Quantity_of_raw_materials: 0,
        Quantity_of_raw_materials_in_stock: 0,
        cycle_time: firstPlan?.Cycle_Time || 0,
        Minimum_raw_materials: 0,
        Status_Plan: plan?.Status,
        Count: Number(count)
      };

      console.log('auto-start-plan-production: ', data);
      socket.emit('plan-production', data);
    }
  },
  async refreshPlan(data) {
    const { plan_id } = data;
    const listMachines = await CommandProductionDetail.findAll({
      where: {
        Command_ID: plan_id,
      },
      attributes: [[Sequelize.literal('DISTINCT Part_Action'), 'Part_Action']],
      distinct: true,
    });
    
    console.log('ma',listMachines );
    console.log('global.dicHmiClient',global.dicHmiClient );
    listMachines.forEach((record) => {
      if (global.dicHmiClient[record.Part_Action]) {
        const socket = global.dicHmiClient[record.Part_Action];
        socket.emit('refresh-plan', {id:record.Part_Action});
      }
    });
  },

  async clearPlan(data) {
    Object.keys(global.dicHmiClient).forEach((machine_id) => {
      const socket = global.dicHmiClient[machine_id];
      if (socket) {
        socket.emit('refresh-plan',{id:machine_id});
      }
    });
  },
};
