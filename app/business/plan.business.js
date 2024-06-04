const MasterIot = require('@models/MasterIot');
const MasterMachine = require('@models/MasterMachine');
const CommandProductionDetail = require('@models/CommandProductionDetail');
const CommandProductionRunning = require('@models/CommandProductionRunning');
const MasterBom = require('@models/MasterBom');
const socketClient = require('@socketClient');
const { Op } = require('sequelize');
const moment = require('moment');
const machineBusiness = require('@business/machine.business');

async function startPlan(id, machine_id) {
  try {
    const plan = await CommandProductionDetail.findByPk(id);

    await CommandProductionDetail.update(
      {
        Status: 1,
        Time_Real_Start:
          plan.Status == 3
            ? plan.Time_Real_Start
            : moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: {
          ID: id,
        },
      }
    );

    // update plan is running
    const parentRunning = await CommandProductionRunning.findOne({
      where: {
        Machine_ID: machine_id,
        Status: 1,
      },
    });

    if (!parentRunning) {
      await CommandProductionRunning.create({
        Command_ID: plan.Command_ID,
        Command_Detail_ID: plan.ID,
        Machine_ID: plan.Part_Action,
        Mold_ID: plan.Mold_ID,
        Product_ID: plan.Product_ID,
        Status: 1,
      });
    } else {
      await CommandProductionRunning.update(
        {
          Status: 1,
          Command_Detail_ID: plan.ID,
          Command_ID: plan.Command_ID,
        },
        {
          where: {
            ID: parentRunning.ID,
          },
        }
      );
    }
    socketClient.emit('start-plan', {
      idPlan: startPlan.id,
      machineId: machine_id,
    });
  } catch (e) {
    console.log('startPlan', e);
  }
  return 1;
}

async function updateCount(plan_id, count){
  try{
    const plan = await CommandProductionDetail.findByPk(plan_id);
    await CommandProductionDetail.update(
      {
        Count: count,
        Quantity_Production: count * Number(plan.Cavity_Real),
      },
      {
        where: {
          ID: plan_id,
        },
      }
    );
  }catch (e) {
    console.log('startPlan', e);
  }
}

async function stopPlan(id, machine_id) {
  try {
    const plan = await CommandProductionDetail.findByPk(id);

    await CommandProductionDetail.update(
      {
        Status: 2,
        Time_Real_End: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
      {
        where: {
          ID: id,
        },
      }
    );

    // stop plan is running
    const parentRunning = await CommandProductionRunning.findOne({
      where: {
        Machine_ID: machine_id,
        Status: 1,
      },
    });
    if (!parentRunning) {
      await CommandProductionRunning.create({
        Command_ID: plan.Command_ID,
        Command_Detail_ID: plan.ID,
        Machine_ID: plan.Part_Action,
        Mold_ID: plan.Mold_ID,
        Product_ID: plan.Product_ID,
        Status: 2,
      });
    } else {
      await CommandProductionRunning.update(
        {
          Status: 2,
        },
        {
          where: {
            ID: parentRunning.ID,
          },
        }
      );
    }

    socketClient.emit('stop-plan', {
      idPlan: id,
      machineId: machine_id,
    });
  } catch (e) {
    console.log('StopPlan', e);
  }
  return 2;
}

function getDatePlan() {
  const timeNow = moment().format('HHmmss');
  const endTime = '075959';
  if (timeNow < endTime) {
    return moment().subtract(1, 'day').format('YYYY-MM-DD');
  } else {
    return moment().format('YYYY-MM-DD');
  }
}



const getPlan = async (socket, plan_id) => {
  // mac: dia chi may
  // Filter Machine
  let plan = await CommandProductionDetail.findByPk(plan_id);
  const masterBoms = await MasterBom.findAll({
    where: {
      Product_BOM_ID: plan.Product_ID,
    },
    include: [{ all: true }],
  });

  // data return
  const firstPlan = masterBoms.find(
    (a) => a.Product_BOM_ID === plan?.Product_ID && a.Mold_ID === plan?.Mold_ID
  );
  if (!firstPlan) return;
  const materialPlan = masterBoms.find(
    (a) => a.Product_BOM_ID === plan?.Product_ID && a.Materials_ID != null
  );

  const count = (plan.Count > 0) ? plan.Count : 0;

  const data = {
    Plan_Id: Number(plan?.ID),
    ProductId_1: firstPlan?.product.Symbols || '',
    MoldId_1: firstPlan?.mold.Symbols || '',
    MaterialID_1: materialPlan?.materials?.Symbols || '',
    Cavity_1: firstPlan?.Cavity,
    Cavity_1_real: plan?.Cavity_Real,
    ProductId_2: 'N/A',
    MoldId_2: 'N/A',
    MaterialID_2: 'N/A',
    Cavity_2: 0,
    Cavity_2_real: 0,
    Quantity_of_raw_materials: 0,
    Quantity_of_raw_materials_in_stock: 0,
    cycle_time: firstPlan?.Cycle_Time || 0,
    Minimum_raw_materials: 0,
    Ver_1: plan?.Version || '',
    His_1: plan?.His || '',
    Ver_2: 'N/A',
    His_2: 'N/A',
    Status_Plan: plan?.Status,
    Count: Number(count)
  };

  // io.emit('notification', {
  //   channel: 'plan-response',
  //   data: data,
  //   msg: payload,
  //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
  // });
  // console.log('get-plan-production: ', data);

  socket.emit('plan-production', data);
};
module.exports = {
  async get(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac } = payload;
    if (!mac) return 'Mac not found';

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
    payload.machineID = machine.ID;
    const plans = await CommandProductionDetail.findAll({
      where: {
        IsDelete: 0,
        Part_Action: machine.ID,
        Status: {
          [Op.in]: [0, 1, 3],
        },
        Date: getDatePlan(),
      },
    });
    const parentRunning = await CommandProductionRunning.findOne({
      where: {
        Machine_ID: machine.ID,
        Status: 1,
      },
    });
    if (parentRunning) {
      let plan = plans.find((a) => a.Status == 1);
      if (!plan) {
        plan = plans.find((a) => a.Status == 3);
      }
      if (!plan) {
        plan = plans.find((a) => a.Status == 0);
      }

      if (!plan) {
        // get plan before
        plan = await CommandProductionDetail.findByPk(
          parentRunning?.Command_Detail_ID
        );
        plan.Status = 1;
      }

      if (!plan) {
        const data = {
          Plan_Id: 0,
          ProductId_1: '',
          MoldId_1: '',
          MaterialID_1: '',
          Cavity_1: 0,
          Cavity_1_real: 0,
          ProductId_2: '',
          MoldId_2: '',
          MaterialID_2: '',
          Cavity_2: 0,
          Cavity_2_real: 0,
          Quantity_of_raw_materials: 0,
          Quantity_of_raw_materials_in_stock: 0,
          cycle_time: 0,
          Minimum_raw_materials: 0,
          Ver_1: '',
          His_1: '',
          Ver_2: '',
          His_2: '',
          Status_Plan: 0,
          Count: 0
        };

        // io.emit('notification', {
        //   channel: 'plan-response',
        //   data: data,
        //   msg: payload,
        //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });
        // console.log('get-plan-production: ', data);
        // socket.emit('plan-production', data);
        // socket.emit('msg', {
        //   Msg: `Khong ton tai plan`,
        // });
        return;
      }

      const masterBoms = await MasterBom.findAll({
        where: {
          Product_BOM_ID: plan.Product_ID,
        },
        include: [{ all: true }],
      });

      // data return
      const firstPlan = masterBoms.find(
        (a) =>
          a.Product_BOM_ID === plan?.Product_ID && a.Mold_ID === plan?.Mold_ID
      );
      if (!firstPlan) return;
      const materialPlan = masterBoms.find(
        (a) => a.Product_BOM_ID === plan?.Product_ID && a.Materials_ID != null
      );

      const count = (plan.Count > 0) ? plan.Count : 0;

      const data = {
        Plan_Id: Number(plan?.ID),
        ProductId_1: firstPlan?.product.Symbols || '',
        MoldId_1: firstPlan?.mold.Symbols || '',
        MaterialID_1: materialPlan?.materials?.Symbols || '',
        Cavity_1: firstPlan?.Cavity,
        Cavity_1_real: plan?.Cavity_Real,
        ProductId_2: 'N/A',
        MoldId_2: 'N/A',
        MaterialID_2: 'N/A',
        Cavity_2: 0,
        Cavity_2_real: 0,
        Quantity_of_raw_materials: 0,
        Quantity_of_raw_materials_in_stock: 0,
        cycle_time: firstPlan?.Cycle_Time || 0,
        Minimum_raw_materials: 0,
        Ver_1: plan?.Version || '',
        His_1: plan?.His || '',
        Ver_2: 'N/A',
        His_2: 'N/A',
        Status_Plan: plan?.Status,
        Count: Number(count)
      };

      // io.emit('notification', {
      //   channel: 'plan-response',
      //   data: data,
      //   msg: payload,
      //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
      // });
      // console.log('get-plan-production: ', data);
      socket.emit('plan-production', data);
    } else {
      if (!plans) {
        const data = {
          Plan_Id: 0,
          ProductId_1: '',
          MoldId_1: '',
          MaterialID_1: '',
          Cavity_1: 0,
          Cavity_1_real: 0,
          ProductId_2: '',
          MoldId_2: '',
          MaterialID_2: '',
          Cavity_2: 0,
          Cavity_2_real: 0,
          Quantity_of_raw_materials: 0,
          Quantity_of_raw_materials_in_stock: 0,
          cycle_time: 0,
          Minimum_raw_materials: 0,
          Ver_1: '',
          His_1: '',
          Ver_2: '',
          His_2: '',
          Status_Plan: 0,
          Count: 0
        };

        // io.emit('notification', {
        //   channel: 'plan-response',
        //   data: data,
        //   msg: payload,
        //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });
        // console.log('get-plan-production: ', data);
        // socket.emit('plan-production', data);
        // socket.emit('msg', {
        //   Msg: `Khong ton tai plan`,
        // });
        return;
      } else {
        let plan = plans.find((a) => a.Status == 1);
        if (!plan) {
          plan = plans.find((a) => a.Status == 3);
        }
        if (!plan) {
          plan = plans.find((a) => a.Status == 0);
        }

        // check plan running but is holiday
        // update plan is running
        if (!plan) {
          const parentRunning = await CommandProductionRunning.findOne({
            where: {
              Machine_ID: machine.ID,
              Status: 1,
            },
          });
          if (parentRunning) {
            // get plan before
            plan = await CommandProductionDetail.findByPk(
              parentRunning?.Command_Detail_ID
            );
            plan.Status = 1;
          }
        }
        if (!plan) {
          const data = {
            Plan_Id: 0,
            ProductId_1: '',
            MoldId_1: '',
            MaterialID_1: '',
            Cavity_1: 0,
            Cavity_1_real: 0,
            ProductId_2: '',
            MoldId_2: '',
            MaterialID_2: '',
            Cavity_2: 0,
            Cavity_2_real: 0,
            Quantity_of_raw_materials: 0,
            Quantity_of_raw_materials_in_stock: 0,
            cycle_time: 0,
            Minimum_raw_materials: 0,
            Ver_1: '',
            His_1: '',
            Ver_2: '',
            His_2: '',
            Status_Plan: 0,
            Count: 0
          };

          // io.emit('notification', {
          //   channel: 'plan-response',
          //   data: data,
          //   msg: payload,
          //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
          // });
          // console.log('get-plan-production: ', data);
          // socket.emit('plan-production', data);
          // socket.emit('msg', {
          //   Msg: `Khong ton tai plan`,
          // });
          return;
        }
        const masterBoms = await MasterBom.findAll({
          where: {
            Product_BOM_ID: plan.Product_ID,
          },
          include: [{ all: true }],
        });

        // data return
        const firstPlan = masterBoms.find(
          (a) =>
            a.Product_BOM_ID === plan?.Product_ID && a.Mold_ID === plan?.Mold_ID
        );
        if (!firstPlan) return;
        const materialPlan = masterBoms.find(
          (a) => a.Product_BOM_ID === plan?.Product_ID && a.Materials_ID != null 
        );

        const count = (plan.Count > 0) ? plan.Count : 0;
        const data = {
          Plan_Id: Number(plan?.ID),
          ProductId_1: firstPlan?.product.Symbols || '',
          MoldId_1: firstPlan?.mold.Symbols || '',
          MaterialID_1: materialPlan?.materials?.Symbols || '',
          Cavity_1: firstPlan?.Cavity,
          Cavity_1_real: plan?.Cavity_Real,
          ProductId_2: 'N/A',
          MoldId_2: 'N/A',
          MaterialID_2: 'N/A',
          Cavity_2: 0,
          Cavity_2_real: 0,
          Quantity_of_raw_materials: 0,
          Quantity_of_raw_materials_in_stock: 0,
          cycle_time: firstPlan?.Cycle_Time || 0,
          Minimum_raw_materials: 0,
          Ver_1: plan?.Version || '',
          His_1: plan?.His || '',
          Ver_2: 'N/A',
          His_2: 'N/A',
          Status_Plan: plan?.Status,
          Count: Number(count)
        };

        // io.emit('notification', {
        //   channel: 'plan-response',
        //   data: data,
        //   msg: payload,
        //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
        // });
        // console.log('get-plan-production: ', data);
        socket.emit('plan-production', data);
        return;
      }
    }
    // socket.emit('msg', {
    //   Msg: `Khong ton tai plan`,
    // });
  },
  async start(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id, Count} = payload;
    if (!mac) return 'Mac not found';

    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        IsDelete: false,
        ID: iot?.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineID = machine.ID;

    //check plan start
    const plan = await CommandProductionDetail.findByPk(Plan_Id);

    if (!plan) {
      socket.emit('msg', {
        Msg: `Khong tim thay plan`,
      });
      return;
    }

    if (plan.Status == 2) {
      socket.emit('msg', {
        Msg: `Plan da san xuat`,
      });
      return;
    }
    if (
      moment(plan.Date, 'YYYY-MM-DD').format('YYYYMMDD') <
      moment().format('YYYYMMDD')
    ) {
      socket.emit('msg', {
        Msg: `Khong the start plan qua khu/hoac khong co plan cua ngay hien tai`,
      });
      return;
    }

    const parentRunning = await CommandProductionRunning.findOne({
      where: {
        Machine_ID: machine.ID,
        Status: 1,
      },
    });

    if (parentRunning && parentRunning.Mold_ID != plan.Mold_ID) {
      socket.emit('msg', {
        Msg: `Dang co plan: ${plan.Symbols} va khuon: ${parentRunning.Mold_ID} san xuat`,
      });
      return;
    }
    // start plan
    const status = await startPlan(Plan_Id, machine.ID);
    await getPlan(socket, Plan_Id);
  },

  async getCount(socket, id) {
    //check plan start
    if(id){
      const planRun = await CommandProductionRunning.findOne({
        where: {
          Machine_ID: id,
          Status: 1,
        }
      });
      if(planRun){
        const planID = planRun.Command_Detail_ID
        const plan = await CommandProductionDetail.findOne({
          where: {
            ID: planID
          }
        });
        if (plan) {
          if (plan.Status == 1) {
            socket.emit('update-count', {getCount: true});
          }
        }
      }
    }
  },

  async updateCount(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id, Count } = payload;
    if (!mac) return 'Mac not found';

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
    payload.machineID = machine.ID;
    await updateCount(Plan_Id, Count);
  },

  async stop(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id, Count} = payload;
    if (!mac) return 'Mac not found';

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
    payload.machineID = machine.ID;

    // start plan
    const status = await stopPlan(Plan_Id, machine.ID);
    await updateCount(Plan_Id, Count);
    socket.emit('update-status-plan', {
      Status_Plan: status,
    });
  },
  async doNextPlan(socket, payload) {
    try {
      const { mac, Plan_Id } = payload;
      if (!mac) return 'Mac not found';

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
      payload.machineID = machine.ID;

      // stop
      await stopPlan(Plan_Id, payload.machineID);
      await this.start(socket, payload);
    } catch (e) {
      console.log('startPlan', e);
    }
  },
  async updateCavity(socket, payload) {
    try {
      const { mac, Plan_Id, Cavity_1, Cavity_2 } = payload;
      if (!mac) return 'Mac not found';

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
      payload.machineID = machine.ID;
      // gan du lieu
      const plan = await CommandProductionDetail.findOne({
        where: {
          ID: Plan_Id,
        },
      });
      if (!plan) return 'Plan not found';
      const bom = await MasterBom.findOne({
        where: {
          Product_BOM_ID: plan.Product_ID,
          Mold_ID: plan.Mold_ID,
        },
      });
      if (!bom) return 'Bom not found';
      if (Cavity_1 > bom.Cavity) {
        console.log('msg', 'Cavity lon hon Cavity cua khuon');

        socket.emit('msg', {
          Msg: `Cavity lon hon Cavity cua khuon`,
        });
        return;
      }
      await CommandProductionDetail.update(
        {
          Cavity_Real: Cavity_1,
        },
        {
          where: {
            ID: Plan_Id,
          },
        }
      );

      socket.emit('update-cavity', {
        Cavity_1: Cavity_1,
        Cavity_2: Cavity_2,
      });
    } catch (e) {
      console.log('update-cavity', e);
    }
  },
  async next(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id } = payload;
    if (!mac) return 'Mac not found';

    const iot = await MasterIot.findOne({
      where: {
        Mac: mac,
      },
    });
    if (!iot) return 'Iot not found';
    const machine = await MasterMachine.findOne({
      where: {
        IsDelete: false,
        ID: iot?.MachineID,
      },
    });
    if (!machine) return 'Machine not found';
    payload.machineID = machine.ID;

    const plan = await CommandProductionDetail.findOne({
      where: {
        ID: Plan_Id,
      },
    });
    if (!plan) return 'plan not found';

    // gan du lieu
    let planNext = await CommandProductionDetail.findOne({
      where: {
        IsDelete: 0,
        Part_Action: machine.ID,
        ID: {
          [Op.gt]: Plan_Id,
        },
        Status: {
          [Op.in]: [0, 1, 3],
        },
        Mold_ID: {
          [Op.not]: plan.Mold_ID,
        },
        Product_ID: {
          [Op.not]: plan.Product_ID,
        },
        Date: getDatePlan(),
      },
    });

    if (!planNext) {
      // back to max plan
      planNext = await CommandProductionDetail.findOne({
        where: {
          IsDelete: 0,
          Part_Action: machine.ID,
          Mold_ID: {
            [Op.not]: plan.Mold_ID,
          },
          Product_ID: {
            [Op.not]: plan.Product_ID,
          },
          Date: getDatePlan(),
        },
        order: [['ID', 'ASC']],
      });
    }
    if (!planNext) return;
    const masterBoms = await MasterBom.findAll({
      where: {
        Product_BOM_ID: planNext.Product_ID,
      },
      include: [{ all: true }],
    });

    // data return
    const firstPlan = masterBoms.find(
      (a) =>
        a.Product_BOM_ID === planNext?.Product_ID &&
        a.Mold_ID === planNext?.Mold_ID
    );
    if (!firstPlan) return;
    const materialPlan = masterBoms.find(
      (a) => a.Product_BOM_ID === planNext?.Product_ID && a.Materials_ID != null
    );

    const data = {
      Plan_Id: Number(planNext?.ID),
      ProductId_1: firstPlan?.product.Symbols || '',
      MoldId_1: firstPlan?.mold.Symbols || '',
      MaterialID_1: materialPlan?.materials?.Symbols || '',
      Cavity_1: firstPlan?.Cavity,
      Cavity_1_real: planNext?.Cavity_Real,
      ProductId_2: 'N/A',
      MoldId_2: 'N/A',
      MaterialID_2: 'N/A',
      Cavity_2: 0,
      Cavity_2_real: 0,
      Quantity_of_raw_materials: 0,
      Quantity_of_raw_materials_in_stock: 0,
      cycle_time: firstPlan?.Cycle_Time || 0,
      Minimum_raw_materials: 0,
      Ver_1: planNext?.Version || '',
      His_1: planNext?.His || '',
      Ver_2: 'N/A',
      His_2: 'N/A',
      Status_Plan: planNext?.Status,
    };

    // io.emit('notification', {
    //   channel: 'plan-response',
    //   data: data,
    //   msg: payload,
    //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
    // });
    // console.log('next-plan-production: ', data);
    socket.emit('plan-production-view', data);
    const qualityData = await machineBusiness.getQualityDetail(data.Plan_Id, {
      Plastic_missing: 0,
      Bavia: 0,
      Dim: 0,
      Shape_change: 0,
      IBUTSU: 0,
      Orther: 0,
    });

    setTimeout(()=>{
      // console.log('update-report-product-quality:', qualityData);
      socket.emit('update-report-product-quality', qualityData);
    }, 500);
  },
  async back(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id } = payload;
    if (!mac) return 'Mac not found';

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
    payload.machineID = machine.ID;

    const plan = await CommandProductionDetail.findOne({
      where: {
        ID: Plan_Id,
      },
    });
    if (!plan) return 'plan not found';

    // gan du lieu
    let planNext = await CommandProductionDetail.findOne({
      where: {
        IsDelete: 0,
        Part_Action: machine.ID,
        ID: {
          [Op.lt]: Plan_Id,
        },
        Mold_ID: {
          [Op.not]: plan.Mold_ID,
        },
        Product_ID: {
          [Op.not]: plan.Product_ID,
        },
        Date: getDatePlan(),
      },
      order: [['ID', 'DESC']],
    });
    if (!planNext) {
      // back to max plan
      planNext = await CommandProductionDetail.findOne({
        where: {
          IsDelete: 0,
          Part_Action: machine.ID,
          Mold_ID: {
            [Op.not]: plan.Mold_ID,
          },
          Product_ID: {
            [Op.not]: plan.Product_ID,
          },
          Date: getDatePlan(),
        },
        order: [['ID', 'DESC']],
      });
    }
    if (!planNext) return;

    const masterBoms = await MasterBom.findAll({
      where: {
        Product_BOM_ID: planNext.Product_ID,
      },
      include: [{ all: true }],
    });

    // data return
    const firstPlan = masterBoms.find(
      (a) =>
        a.Product_BOM_ID === planNext?.Product_ID &&
        a.Mold_ID === planNext?.Mold_ID
    );
    if (!firstPlan) return;
    const materialPlan = masterBoms.find(
      (a) => a.Product_BOM_ID === planNext?.Product_ID && a.Materials_ID != null
    );

    const data = {
      Plan_Id: Number(planNext?.ID),
      ProductId_1: firstPlan?.product.Symbols || '',
      MoldId_1: firstPlan?.mold.Symbols || '',
      MaterialID_1: materialPlan?.materials?.Symbols || '',
      Cavity_1: firstPlan?.Cavity,
      Cavity_1_real: planNext?.Cavity_Real,
      ProductId_2: 'N/A',
      MoldId_2: 'N/A',
      MaterialID_2: 'N/A',
      Cavity_2: 0,
      Cavity_2_real: 0,
      Quantity_of_raw_materials: 0,
      Quantity_of_raw_materials_in_stock: 0,
      cycle_time: firstPlan?.Cycle_Time || 0,
      Minimum_raw_materials: 0,
      Ver_1: planNext?.Version || '',
      His_1: planNext?.His || '',
      Ver_2: 'N/A',
      His_2: 'N/A',
      Status_Plan: planNext?.Status,
    };

    // io.emit('notification', {
    //   channel: 'plan-production',
    //   data: data,
    //   msg: payload,
    //   time: moment().format('YYYY-MM-DD HH:mm:ss'),
    // });
    // console.log('back-plan-production: ', data);
    socket.emit('plan-production-view', data);
    const qualityData = await machineBusiness.getQualityDetail(data.Plan_Id, {
      Plastic_missing: 0,
      Bavia: 0,
      Dim: 0,
      Shape_change: 0,
      IBUTSU: 0,
      Orther: 0,
    });
    setTimeout(()=>{
      // console.log('update-report-product-quality:', qualityData);
      socket.emit('update-report-product-quality', qualityData);
    }, 500);
  },
  async pause(socket, payload) {
    // mac: dia chi may
    // Filter Machine
    const { mac, Plan_Id, Count } = payload;
    if (!mac) return 'Mac not found';

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
    payload.machineID = machine.ID;

    await CommandProductionDetail.update(
      {
        Status: 3,
      },
      {
        where: {
          ID: Plan_Id,
        },
      }
    );

    //check plan start
    const plan = await CommandProductionDetail.findByPk(Plan_Id);

    if (!plan) {
      socket.emit('msg', {
        Msg: `Khong tim thay plan`,
      });
      return;
    }
    const parentRunning = await CommandProductionRunning.findOne({
      where: {
        Machine_ID: plan.Part_Action,
        Status: 1,
      },
    });
    if (!parentRunning) {
      await CommandProductionRunning.create({
        Command_ID: plan.Command_ID,
        Command_Detail_ID: plan.ID,
        Machine_ID: plan.Part_Action,
        Mold_ID: plan.Mold_ID,
        Product_ID: plan.Product_ID,
        Status: 2,
      });
    } else {
      await CommandProductionRunning.update(
        {
          Status: 2,
        },
        {
          where: {
            ID: parentRunning.ID,
          },
        }
      );
    }
    await updateCount(Plan_Id, Count);
    socketClient.emit('pause-plan', {
      idPlan: Plan_Id,
      machineId: machine.ID,
    });

    // stop plan
    socket.emit('update-status-plan', {
      Status_Plan: 3,
    });
  },
};
