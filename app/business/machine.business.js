const MasterIot = require('@models/MasterIot');
const MasterMachine = require('@models/MasterMachine');
const MasterBom = require('@models/MasterBom');
const ProductionLog = require('@models/ProductionLog');
const io = require('@socketIo');
const socketClient = require('@socketClient');
const CommandProductionDetail = require('@models/CommandProductionDetail');
const { Sequelize } = require('sequelize');
const moment = require('moment');
const { convertToFloat } = require('../helpers/convert');

async function getQualityDetail(plan_id, payload) {
  const { Plastic_missing, Bavia, Dim, Shape_change, IBUTSU, Orther } = payload;
  const detailPlan = await CommandProductionDetail.findOne({
    where: {
      ID: plan_id,
    },
  });
  const qualityDetails = await ProductionLog.findAll({
    attributes: [
      'Master_Status_ID',
      [Sequelize.fn('sum', Sequelize.col('NG')), 'total_ng'],
    ],
    where: {
      Command_Production_Detail_ID: plan_id,
    },
    group: ['Master_Status_ID'],
    raw: true,
  });
  return {
    Total_NG: detailPlan?.Quantity_Error,
    Plastic_missing:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 11)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(Plastic_missing),
    Bavia:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 12)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(Bavia),
    Dim:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 13)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(Dim),
    Shape_change:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 14)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(Shape_change),
    IBUTSU:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 15)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(IBUTSU),
    Orther:
      qualityDetails
        .filter((a) => a.Master_Status_ID === 16)
        .reduce((accumulator, data) => accumulator + convertToFloat(data?.total_ng ?? 0), 0) +
      convertToFloat(Orther),
  };
}

module.exports = {
  async count(socket, payload){
    const { Plan_Id: idPlan, mac, count, quantity } = payload;
    const plan = await CommandProductionDetail.findOne({
      where: { ID: planID },
    });
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot.MachineID,
      },
    });
  },
  
  async updateState(payload) {
    // Kiem tra cac truong thong tin
    // Filter Machine
    const { mac, count } = payload;
    if (Boolean(count)) {
      await this.subtractMachine(payload);
      console.log('payload after:', payload);
      socketClient.emit('send-iot', payload);
    } else {
      await this.updateStatus(mac, payload);
    }
  },
  async subtractMachine(payload) {
    const { Plan_Id: idPlan, mac } = payload;
    console.log('subtractMachine:', payload);
    // Tu ID plan -> Product, Mold, Machine(Part_Action), Tu Product, Mold -> BOM -> Usage (Quantity_Materials)-> NVL tieu hao -> Tru ton tren may
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineId = machine.ID;
    // Tim kiem KHSX
    let plan = await CommandProductionDetail.findOne({
      where: { ID: idPlan, Status: 1, IsDelete: 0 },
    });
    if (!plan) {
      return { status: 0, error: `Khong co KHSX Voi ID ${idPlan}` };
    }

    const bom = await MasterBom.findOne({
      where: {
        Product_BOM_ID: plan.Product_ID,
        Mold_ID: plan.Mold_ID,
      },
    });

    if (!bom) {
      return {
        status: 0,
        error: `Khong co BOM của product ${plan.Product_ID}`,
      };
    }
    await CommandProductionDetail.update(
      {
        Quantity_Production:
          convertToFloat(plan.Quantity_Production) +
          convertToFloat(1 * plan.Cavity_Real),
      },
      {
        where: {
          ID: plan.ID,
        },
      }
    );
  },
  async updateStatus(mac, payload) {
    const { run, stop, error } = payload;

    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineId = machine.ID;
    let machineStatus = 0;
    if (Boolean(run)) {
      machineStatus = 1;
    } else if (Boolean(stop)) {
      machineStatus = 2;
    } else if (Boolean(error)) {
      machineStatus = 3;
    }

    // save mem cache
    global.dicMachineStatus[machine.ID] = machineStatus;

    io.emit('notification', {
      channel: 'status-machine',
      data: [],
      msg: payload,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    socketClient.emit('status-machine', payload);
  },
  async qc(socket, payload) {
    console.log('QC payload:',payload);
    const {
      mac,
      Plan_Id: planID,
      Plastic_missing,
      Bavia,
      Dim,
      Shape_change,
      IBUTSU,
      Orther,
    } = payload;
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot?.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineId = machine.ID;
    const plan = await CommandProductionDetail.findOne({
      where: { ID: planID },
    });
    if (!plan) return 'Plan not found';

    await CommandProductionDetail.update(
      {
        Quantity_Error:
          convertToFloat(plan.Quantity_Error) +
          convertToFloat(Plastic_missing) +
          convertToFloat(Bavia) +
          convertToFloat(Dim) +
          convertToFloat(Shape_change) +
          convertToFloat(IBUTSU) +
          convertToFloat(Orther),
      },
      {
        where:{
          ID: planID,
        }
      }
    );

    socketClient.emit('qc', payload);
    const qualityDetail = await getQualityDetail(planID, payload);
    console.log('update-report-product-quality:', qualityDetail);
    socket.emit('update-report-product-quality', qualityDetail);
  },
  async stop(payload) {
    // Kiem tra cac truong thong tin
    // Filter Machine
    const { mac } = payload;
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot?.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineId = machine.ID;
    io.emit('notification', {
      channel: 'stop-machine',
      data: [],
      msg: payload,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    socketClient.emit('stop-machine', payload);
  },
  async error(payload) {
    // Kiem tra cac truong thong tin
    // Filter Machine
    const { mac } = payload;
    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        ID: iot?.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineId = machine.ID;
    io.emit('notification', {
      channel: 'error-machine',
      data: [],
      msg: payload,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
    });
    socketClient.emit('error-machine', payload);
  },
  getQualityDetail

};
