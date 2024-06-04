import React, {
  useEffect,
  useMemo,
  useState,
  useContext,
  memo,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import useIot from '@@api/useIot';
import useTranslate from '@@lang';
import useSocket from '@@socket';
import useFile from '@@api/useFile';
import useListener from '@@store/useListener';
import useModal from '@@utils/hooks/useModal';
import MachineSelect from '@@components/MachineSelect';
import { v4 } from 'uuid';

import {
  Table,
  Space,
  Row,
  Col,
  Tag,
  Checkbox,
  Input,
  Typography,
  Select,
  Modal,
} from 'antd';
import { Filter } from '@@components/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotate,
  faDownload,
  faTrashCan,
  faPlus,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import { FilterFilled } from '@ant-design/icons';
import { Button, Actions } from '@@components/index';
import IotContext from '@@context/IotContext';

const UPDATE_FIRMWARE = 'update-iot-firmware';

const { Text } = Typography;
const { TextArea } = Input;

const SelectFile = ({ macs }) => {
  const t = useTranslate();
  const { getFiles } = useFile();
  const { updateFirmware } = useIot();
  const listener = useListener();
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState(window.location.origin);
  const [selectedFile, setSelectedFile] = useState('');

  const fileOptions = useMemo(
    () =>
      files
        .filter((file) => file.type === 1)
        .map((file) => {
          const handleClick = () => {
            setSelectedFile(file.name);
          };

          return (
            <Button key={file.name} onClick={handleClick} type="default">
              {file.name}
            </Button>
          );
        }),
    [files]
  );

  const handleChangePath = (e) => setPath(e.target.value);

  const handleChangeSelectedFile = (e) => setSelectedFile(e.target.value);

  const handleUpdateFirmware = () =>
    updateFirmware({ macs, path, selectedFile });

  const handleGetFiles = async () => {
    const { success, data } = await getFiles();
    if (success) {
      setFiles(data.data);
    }
  };

  useEffect(() => {
    const key = listener.on(UPDATE_FIRMWARE, handleUpdateFirmware);

    return () => {
      listener.off(UPDATE_FIRMWARE, key);
    };
  }, [selectedFile, macs]);

  useEffect(() => {
    handleGetFiles();
  }, []);

  return (
    <Row gutter={[10, 10]}>
      <Col span={12}>
        <Input
          allowClear
          addonBefore={t('path')}
          value={path}
          onChange={handleChangePath}
        />
      </Col>
      <Col span={12}>
        <Input
          allowClear
          addonBefore={t('file')}
          value={selectedFile}
          onChange={handleChangeSelectedFile}
        />
      </Col>
      <Col span={24}>
        <Space direction="vertical">{fileOptions}</Space>
      </Col>
    </Row>
  );
};

const InputAddonBefore = ({ title, width = 50, textAlign = 'center' }) => {
  return (
    <div style={{ width, textAlign }}>
      <Text>{title}</Text>
    </div>
  );
};

const InfoModal = memo(
  forwardRef((_, ref) => {
    const t = useTranslate();
    const { state, open, close } = useModal();
    const { sendEvent } = useIot();
    const [socketId, setSocketId] = useState('');
    const [event, setEvent] = useState('config-iot');
    const [payload, setPayload] = useState(
      '{"MALENH":"CAUHINH","SSID":"cg-new-agv","PASS":"AGVregent","SERV":"172.21.24.10","PORT":8686,"PROTOCOL":"HTTP"}'
    );

    const handleSendEvent = async () => {
      await sendEvent({ socketId, event, payload });
    };

    const resetData = () => {
      setSocketId('');
      setEvent('config-iot');
      setPayload(
        '{"MALENH":"CAUHINH","SSID":"cg-new-agv","PASS":"AGVregent","SERV":"172.21.24.10","PORT":8686,"PROTOCOL":"HTTP"}'
      );
    };

    const footer = [
      <Button key={v4()} onClick={close} danger type="primary">
        {t('close').toUpperFirst()}
      </Button>,
      <Button key={v4()} onClick={handleSendEvent} type="primary">
        {t('send').toUpperFirst()}
      </Button>,
    ];

    const handleChangeSocketId = (e) => setSocketId(e.target.value);

    const handleChangeEvent = (e) => setEvent(e.target.value);

    const handleChangePayload = (e) => setPayload(e.target.value);

    const setData = (record) => {
      setSocketId(record?.SocketID);
      open();
    };

    useImperativeHandle(ref, () => ({ open: setData, close }), []);

    useEffect(() => {
      state || resetData();
    }, [state]);

    return (
      <Modal
        title={t('iot').toCapitalize()}
        open={state}
        onCancel={close}
        footer={footer}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            addonBefore="Socket ID"
            value={socketId}
            onChange={handleChangeSocketId}
          />
          <Input
            allowClear
            addonBefore="event"
            value={event}
            onChange={handleChangeEvent}
          />
          <TextArea rows={3} value={payload} onChange={handleChangePayload} />
        </Space>
      </Modal>
    );
  })
);

const UpdateModal = memo(
  forwardRef((_, ref) => {
    const t = useTranslate();
    const { handleGetIots } = useContext(IotContext);
    const { updateIot } = useIot();
    const { state, open, close } = useModal();
    const [name, setName] = useState('');
    const [mac, setMac] = useState('');
    const [machineId, setMachineId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const oldMac = useRef(null);

    const handleChangeName = (e) => setName(e.target.value);

    const handleChangeMac = (e) => setMac(e.target.value);

    const handleUpdateIot = async () => {
      setConfirmLoading(true);
      const { success } = await updateIot({
        oldMac: oldMac.current,
        newMac: mac,
        name,
        machineId,
      });

      if (success) {
        handleGetIots();
        close();
      }
      setConfirmLoading(false);
    };

    const resetData = () => {
      oldMac.current = null;
      setName('');
      setMac('');
    };

    const setData = ({ Name, Mac, machine }) => {
      oldMac.current = Mac;
      setName(Name);
      setMac(Mac);
      setMachineId(machine?.ID);
      open();
    };

    useImperativeHandle(ref, () => ({ open: setData, close }), []);

    useEffect(() => {
      state || resetData();
    }, [state]);

    return (
      <Modal
        title={t('update iot').toCapitalize()}
        open={state}
        maskClosable={false}
        closable={!confirmLoading}
        cancelText={t('close').toUpperFirst()}
        cancelButtonProps={{ type: 'primary', danger: true }}
        onCancel={close}
        okText={t('confirm').toUpperFirst()}
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        onOk={handleUpdateIot}
        confirmLoading={confirmLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            allowClear
            addonBefore={<InputAddonBefore title={t('name').toUpperFirst()} />}
            value={name}
            onChange={handleChangeName}
          />
          <Input
            allowClear
            addonBefore={<InputAddonBefore title={t('mac').toUpperCase()} />}
            value={mac}
            onChange={handleChangeMac}
          />
          <MachineSelect value={machineId} onChange={setMachineId} />
        </Space>
      </Modal>
    );
  })
);

const CreateModal = memo(
  forwardRef((_, ref) => {
    const t = useTranslate();
    const { handleIotUpdate } = useContext(IotContext);
    const { createIot } = useIot();
    const { state, open, close } = useModal();
    const [name, setName] = useState('');
    const [mac, setMac] = useState('');
    const [machineId, setMachineId] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const handleChangeName = (e) => setName(e.target.value);

    const handleChangeMac = (e) => setMac(e.target.value);

    const handleCreateIot = async () => {
      setConfirmLoading(true);
      const { success, data } = await createIot({ mac, name, machineId });

      if (success) {
        handleIotUpdate(data.data);
        close();
      }
      setConfirmLoading(false);
    };

    const resetData = () => {
      setName('');
      setMac('');
      setMachineId(null);
    };

    useImperativeHandle(ref, () => ({ open, close }), []);

    useEffect(() => {
      state || resetData();
    }, [state]);

    return (
      <Modal
        title={t('create iot').toCapitalize()}
        open={state}
        maskClosable={false}
        closable={!confirmLoading}
        cancelText={t('close').toUpperFirst()}
        cancelButtonProps={{ type: 'primary', danger: true }}
        onCancel={close}
        okText={t('confirm').toUpperFirst()}
        okButtonProps={{ style: { backgroundColor: 'green' } }}
        onOk={handleCreateIot}
        confirmLoading={confirmLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            allowClear
            addonBefore={<InputAddonBefore title={t('name').toUpperFirst()} />}
            value={name}
            onChange={handleChangeName}
          />
          <Input
            allowClear
            addonBefore={<InputAddonBefore title={t('mac').toUpperCase()} />}
            value={mac}
            onChange={handleChangeMac}
          />
          <MachineSelect value={machineId} onChange={setMachineId} />
        </Space>
      </Modal>
    );
  })
);

const ColumnList = memo(
  forwardRef(() => {
    const t = useTranslate();
    const { columns, columnsFilter, setColumnsFilter } = useContext(IotContext);

    const handleChangeCheckAll = ({ target }) => {
      target.checked ? setColumnsFilter([]) : setColumnsFilter([]);
    };

    const options = useMemo(
      () =>
        columns.map((column) => ({
          label: column.title,
          value: column.title,
        })),
      [columns]
    );

    return (
      <Checkbox.Group
        style={{
          padding: 10,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 20px 0px',
        }}
        onChange={setColumnsFilter}
        value={columnsFilter}
      >
        <Row gutter={[10, 10]}>
          <Col span={4}>
            <Checkbox onChange={handleChangeCheckAll}>{t('all')}</Checkbox>
          </Col>
          {options.map((option) => (
            <Col key={option.label} span={4}>
              <Checkbox value={option.value}>{option.label}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    );
  })
);

const ToolBar = memo(({ selectedRows, handleGetIots }) => {
  const t = useTranslate();
  const { deleteIot } = useIot();
  const listener = useListener();
  const createModalRef = useRef(null);

  const macs = useMemo(
    () => selectedRows.map(({ Mac }) => Mac),
    [selectedRows]
  );

  const handleConfirm = () => listener.emit(UPDATE_FIRMWARE);

  const handleOpenCreateModal = () => createModalRef.current.open();

  const handleDeleteIots = async () => {
    const { success } = await deleteIot(macs);
    if (success) handleGetIots();
  };

  return (
    <>
      <Space
        style={{
          borderRadius: 5,
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <Button
          tooltipTitle={t('reload')}
          tooltipPlacement="bottom"
          icon={<FontAwesomeIcon icon={faRotate} />}
          onClick={handleGetIots}
        />
        <Button.Dropdown
          tooltipTitle={t('column')}
          tooltipPlacement="top"
          icon={<FontAwesomeIcon icon={faListCheck} />}
          dropdownRender={() => <ColumnList />}
        />
        <Button
          tooltipTitle={t('add')}
          tooltipPlacement="bottom"
          icon={<FontAwesomeIcon icon={faPlus} />}
          onClick={handleOpenCreateModal}
        />
        {!!selectedRows.length && (
          <>
            <Button.Modal
              tooltipTitle={t('update firmware')}
              tooltipPlacement="top"
              modalTitle={t('select firmware').toUpperFirst()}
              modalContent={<SelectFile macs={macs} />}
              modalWidth="50%"
              icon={<FontAwesomeIcon icon={faDownload} />}
              onConfirm={handleConfirm}
              danger
            />
            <Button.Confirm
              popConfirmPlacement="bottom"
              popconfirmTitle={t('delete')}
              tooltipTitle={t('delete')}
              tooltipPlacement="top"
              icon={<FontAwesomeIcon icon={faTrashCan} />}
              danger
              onConfirm={handleDeleteIots}
            />
          </>
        )}
      </Space>
      <CreateModal ref={createModalRef} />
    </>
  );
});

const Iot = () => {
  const t = useTranslate();
  const socket = useSocket();
  const { getIots, deleteIot } = useIot();
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const updateModalRef = useRef(null);
  const infoModalRef = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: (props) => <Filter {...props} />,
    filterIcon: (filtered) => (
      <FilterFilled color={filtered ? '#1677ff' : undefined} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  });

  const columns = useMemo(
    () => [
      {
        title: 'STT',
        key: 'STT',
        render: (_, __, index) => index + 1,
        align: 'center',
        show: true,
        width: 50,
        align: 'center',
      },
      {
        title: 'Name',
        dataIndex: ['Name'],
        show: true,
        align: 'center',
        filterSearch: true,
        ...getColumnSearchProps('Name'),
      },
      {
        title: 'MAC',
        dataIndex: ['Mac'],
        show: true,
        align: 'center',
        ...getColumnSearchProps('Mac'),
      },
      {
        title: 'Version',
        dataIndex: ['Version'],
        show: true,
        align: 'center',
        ...getColumnSearchProps('Version'),
      },
      {
        title: 'Status',
        render: (_, record) =>
          record.IsConnected ? (
            <Tag color="#87d068">{t('connected')}</Tag>
          ) : (
            <Tag color="gray">{t('disconnected')}</Tag>
          ),
        show: true,
        filters: [
          { text: t('connected'), value: true },
          { text: t('disconnected'), value: false },
        ],
        onFilter: (val, record) => val === record.IsConnected,
        width: 120,
        align: 'center',
      },
      {
        title: 'Machine',
        dataIndex: ['machine', 'Name'],
        show: true,
        align: 'center',
        ...getColumnSearchProps('Machine'),
      },
      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => {
          const handleOpenUpdateModal = () =>
            updateModalRef.current.open(record);

          const handleOpenInfoModal = () => infoModalRef.current.open(record);

          const handleDeleteIot = async () => {
            const { success } = await deleteIot(record.Mac);
            if (success) handleGetIots();
          };

          return (
            <Actions
              titleIndex="Name"
              record={record}
              onEdit={handleOpenUpdateModal}
              onDelete={handleDeleteIot}
              onInfo={handleOpenInfoModal}
            />
          );
        },
        show: true,
        align: 'center',
      },
    ],
    [t]
  );

  const [columnsFilter, setColumnsFilter] = useState(
    columns.map((column) => column.title)
  );

  const columnsFiltered = useMemo(
    () => columns.filter((column) => columnsFilter.includes(column.title)),
    [columns, columnsFilter]
  );

  const title = () => <ToolBar {...{ selectedRows, handleGetIots }} />;

  const showTotal = (total, range) => {
    return (
      <div>
        <Tag>
          {range[0]}-{range[1]}
        </Tag>
        <Text>/</Text>
        <Tag>{total}</Tag>
        <Text>Items</Text>
      </div>
    );
  };

  const handleGetIots = useCallback(async () => {
    setLoading(true);
    const { data, success } = await getIots();

    if (success) {
      setDataSource(data);
      handleChangeSelection(null, []);
    }
    setLoading(false);
  }, []);

  const handleChangeSelection = (_, selectedRows) => {
    setSelectedRows(selectedRows);
  };

  const handleIotUpdate = useCallback((iot) => {
    setDataSource((prev) =>
      prev.map((data) => {
        if (data.Mac === iot.Mac) return { ...data, ...iot };
        return data;
      })
    );
  });

  useEffect(() => {
    handleGetIots();

    socket.on('update-iot', handleIotUpdate);

    return () => {
      socket.off('update-iot', handleIotUpdate);
    };
  }, []);

  return (
    <IotContext.Provider
      value={{
        setColumnsFilter,
        handleIotUpdate,
        handleGetIots,
        columns,
        columnsFilter,
      }}
    >
      <UpdateModal ref={updateModalRef} />
      <InfoModal ref={infoModalRef} />
      <Table
        className="scroll-table"
        size="small"
        bordered
        loading={loading}
        columns={columnsFiltered}
        dataSource={dataSource}
        rowKey={'Mac'}
        rowSelection={{
          type: 'checkbox',
          onChange: handleChangeSelection,
        }}
        title={title}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal,
          defaultPageSize: 50,
          pageSizeOptions: [10, 30, 50, 100, 150],
        }}
        scroll={{
          scrollToFirstRowOnChange: true,
          y: true,
        }}
      />
    </IotContext.Provider>
  );
};

export default Iot;
