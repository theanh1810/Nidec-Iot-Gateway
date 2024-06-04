const CommandProductionDetail = require('@models/CommandProductionDetail');
const MasterBom = require('@models/MasterBom');
const RuntimeHistory = require('@models/RuntimeHistory');
const { Op } = require('sequelize');
const moment = require('moment');
const OeeDay = require('@models/OeeDay')

const getOeeByDay = async (machineId) => {
  const startOfDay = moment().startOf('day').add(8, 'hours');

  let wheres = { Master_Machine_ID :machineId };

  if(moment().diff(startOfDay, 'hours', true) < 0) {
      wheres["Time_Created"] = {
          [Op.gte]:startOfDay
          .subtract(1, "day")
          .format("YYYY-MM-DD HH:mm:ss")
          .toString()
      }
  } else {
      wheres["Time_Created"] = {
          [Op.gte]:startOfDay
          .format("YYYY-MM-DD HH:mm:ss")
          .toString()
      }
  }

  return await OeeDay.findOne({
    where: wheres
  });
}

async function performance(socket, machineId) {
  try {
    const planIsRunning = await CommandProductionDetail.findOne({
      where: {
        Part_Action: machineId,
        Status: 1,
        IsDelete: false,
      },
    });
    let p = 0,
      a = 0,
      q = 0,
      real = 0,
      target = 0,
      A_P = 0,
      H_Stop_Machine = 0, // Giờ dừng máy
      M_Stop_Machine = 0, // Phút dừng máy
      S_Stop_Machine = 0; // Giây dừng máy 
      H_Error_Machine = 0, // Giờ dừng máy
      M_Error_Machine = 0, // Phút dừng máy
      S_Error_Machine = 0; // Giây dừng máy

    if (planIsRunning) {
      const current = moment();
      const startTime = moment(planIsRunning.Time_Real_Start);
      const oeeDay = await getOeeByDay(machineId);
      const bom = await MasterBom.findOne({
        where: {
          Product_BOM_ID: planIsRunning.Product_ID,
          Mold_ID: planIsRunning.Mold_ID,
        },
      });

      p = oeeDay?.P ?? 0;
      a = oeeDay?.A ?? 0;
      q = oeeDay?.Q ?? 0;
      real = Number(planIsRunning.Quantity_Production);
      target = Math.floor(
        (current.diff(startTime, 'seconds', true) / bom.Cycle_Time)) * planIsRunning.Cavity_Real;
      A_P = Math.round((real / target)*100, 0);
      const timeAll = await getTimeMinuteStopAndError(machineId, startTime);
      H_Stop_Machine = Math.floor(timeAll.stopTime / 60); // Giờ dừng máy
      M_Stop_Machine = Math.floor(timeAll.stopTime - H_Stop_Machine * 60); // Phút dừng máy
      S_Stop_Machine =
      Math.floor((timeAll.stopTime - H_Stop_Machine * 60 - M_Stop_Machine) * 60); // Giây dừng máy
      
      H_Error_Machine = Math.floor(timeAll.errorTime / 60); // Giờ dừng máy
      M_Error_Machine = Math.floor(timeAll.errorTime - H_Error_Machine * 60); // Phút dừng máy
      S_Error_Machine =
      Math.floor((timeAll.errorTime - H_Error_Machine * 60 - M_Error_Machine) * 60); // Giây dừng máy
    }
    // console.log('performance:', {
    //   a: a,
    //   p: p,
    //   q: q,
    //   real: real,
    //   target: target,
    //   A_P: A_P,
    //   H_Stop_Machine: H_Stop_Machine, // Giờ dừng máy
    //   M_Stop_Machine: M_Stop_Machine, // Phút dừng máy
    //   S_Stop_Machine: S_Stop_Machine, // Giây dừng máy
    // });

    socket.emit('performance', {
      a: a,
      p: p,
      q: q,
      real: real,
      target: target,
      A_P: A_P,
      H_Stop_Machine: H_Stop_Machine, // Giờ dừng máy
      M_Stop_Machine: M_Stop_Machine, // Phút dừng máy
      S_Stop_Machine: S_Stop_Machine, // Giây dừng máy
      H_Error_Machine, // Giờ lỗi máy
      M_Error_Machine, // Phút lỗi máy
      S_Error_Machine // Giây lỗi máy
    });
  } catch (err) {
    console.log(err);
  }
}

async function getTimeMinuteStopAndError(machineId, planStartTime) {
  const runtimes = await RuntimeHistory.findAll({
    where: {
      Master_Machine_ID: machineId,
      Time_created: {
        [Op.gte]: moment(planStartTime).format('YYYY-MM-DD HH:mm:ss'),
      },
      IsRunning: false,
    },
  });
  const errorTime = runtimes.filter(a=>a.Master_Status_ID >= 1 && a.Master_Status_ID <= 6).reduce(
    (accumulator, runtime) => accumulator + (runtime?.Duration ?? 0),
    0
  );
  const stopTime = runtimes.filter(a=>a.Master_Status_ID >= 7 && a.Master_Status_ID <= 10).reduce(
    (accumulator, runtime) => accumulator + (runtime?.Duration ?? 0),
    0
  );

  return {
    errorTime,
    stopTime
  }
}

module.exports = {
  performance,
};
