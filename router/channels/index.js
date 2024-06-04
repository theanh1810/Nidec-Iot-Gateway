const io = require('@socketIo');
const controller = require('@controllers/socket/controller');
const middleware = require('@middlewares/socket.middleware');

const subscribeEvent = (socket) => {
  socket.on('disconnect', async () => await controller.disconnect(socket));

  socket.on(
    'get-plan-production',
    async (payload) => await controller.getPlanProduction(socket, payload)
  );
  socket.on(
    'Next-Plan',
    async (payload) => await controller.nextPlanProduction(socket, payload)
  );
  socket.on(
    'Back-Plan',
    async (payload) => await controller.prevPlanProduction(socket, payload)
  );
  // socket.on('next-product', (payload) => controller.nextProduct(socket, payload))
  // socket.on('Perform-Next-Plan', (payload) => controller.doNextPlan(socket, payload))

  // socket.on('start-plan-production', console.log)
  // socket.on('end-plan-production', console.log)
  socket.on(
    'Start-Plan',
    async (payload, res) => await controller.startPlan(socket, payload, res)
  );
  socket.on(
    'Stop-Plan',
    async (payload) => await controller.pausePlan(socket, payload)
  );
  socket.on(
    'End-Plan',
    async (payload) => await controller.endPlan(socket, payload)
  );

  socket.on('Download-done', (msg) => {
    console.log('done', msg);
  });

  socket.on(
    'update-states',
    async (payload) => await controller.updateStates(socket, payload)
  );

  socket.on(
    'update-count',
    async (payload, res) => await controller.updateCount(socket, payload, res)
  );


  socket.on(
    'err-machine-status',
    async (payload) => await controller.machineError(socket, payload)
  );
  socket.on(
    'stop-machine-status',
    async (payload) => await controller.machineStop(socket, payload)
  );
  socket.on(
    'update-report-product-quality',
    async (payload) => await controller.qc(socket, payload)
  );
  socket.on(
    'update-cavity',
    async (payload) => await controller.updateCavity(socket, payload)
  );

  socket.on(
    'Pause-Plan',
    async (payload) => await controller.pausePlan(socket, payload)
  );
  
  socket.on(
    'connect-iot',
    async (payload) => await controller.connectIot(socket, payload)
  );

  socket.on('ping', socket => {
    const { handshake } = socket;
    const { headers } = handshake;
    const { mac } = headers;
    console.log(`time: ${new Date()} , ping: ${mac}`);
  });
  
  socket.on('pong', socket => {
    const { handshake } = socket;
    const { headers } = handshake;
    const { mac } = headers;
    console.log(`time: ${new Date()} , pong: ${mac}`);
  });
  // socket.on('call-status-machine', () => controller.callInitStatus(socket))
};





io.use(middleware.auth);

io.on('connection', async (socket) => {
  await controller.connect(socket);
  subscribeEvent(socket);
});


