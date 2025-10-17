import React, { useState, useEffect, useMemo } from 'react';
import { App as AntApp, Layout, Card, Table, Button, Space, Typography, Tag, Modal, Input, Empty } from 'antd';
import { PlusOutlined, CaretRightOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { Task, TaskExecution } from './types';
import * as api from './api';
import CreateTaskModal from './CreateTaskModal';
import './App.css'; // <-- IMPORT YOUR NEW STYLESHEET

const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const AppContent: React.FC = () => {
  const { modal, message: messageApi } = AntApp.useApp();

  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await api.getTasks();
      setAllTasks(response.data);
    } catch (error) {
      messageApi.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (!searchTerm) return allTasks;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return allTasks.filter(task =>
      task.name.toLowerCase().includes(lowercasedSearchTerm) ||
      task.id.toLowerCase().includes(lowercasedSearchTerm) ||
      task.owner.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [allTasks, searchTerm]);

  const handleCreateSuccess = () => {
    setIsModalVisible(false);
    fetchTasks();
  };

  const handleExecute = async (id: string) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      await api.executeTask(id);
      messageApi.success(`Task ${id} executed successfully!`);
      fetchTasks();
    } catch (error) {
      messageApi.error(`Failed to execute task ${id}`);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: 'Are you sure you want to delete this task?',
      content: `This will permanently delete task with ID: ${id}`,
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await api.deleteTask(id);
          messageApi.success(`Task ${id} deleted successfully!`);
          fetchTasks();
        } catch (error) {
          messageApi.error(`Failed to delete task ${id}`);
        }
      },
    });
  };

  const expandedRowRender = (record: Task) => {
    if (!record.taskExecutions || record.taskExecutions.length === 0) {
      return <Empty description="No execution history for this task." />;
    }
    const columns: ColumnsType<TaskExecution> = [
      { title: 'Start Time', dataIndex: 'startTime', key: 'startTime', width: '30%' },
      { title: 'End Time', dataIndex: 'endTime', key: 'endTime', width: '30%' },
      { title: 'Output', dataIndex: 'output', key: 'output', render: (text) => <pre className="output-pre">{text}</pre> },
    ];
    return (
      <Card title="Execution History" size="small" className="execution-history-card">
        <Table columns={columns} dataSource={record.taskExecutions} pagination={false} rowKey="startTime" />
      </Card>
    );
  };

  const columns: ColumnsType<Task> = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Owner', dataIndex: 'owner', key: 'owner' },
    { title: 'Command', dataIndex: 'command', key: 'command', render: (cmd) => <Tag color="blue">{cmd}</Tag> },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<CaretRightOutlined />} type="primary" onClick={() => handleExecute(record.id)} loading={actionLoading[record.id]}>
            Execute
          </Button>
          <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="main-layout">
      <Header className="header">
        <Title level={2} className="header-title">Kaiburr Task Manager</Title>
      </Header>
      <Content className="content-wrapper">
        <Card className="content-card">
          <Space align="center" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <Search
              placeholder="Search by ID, Name, or Owner..."
              onChange={(e) => setSearchTerm(e.target.value)}
              enterButton
              allowClear
              size="large"
              style={{ width: 400 }}
            />
            <Button icon={<PlusOutlined />} type="primary" size="large" onClick={() => setIsModalVisible(true)}>
              Create Task
            </Button>
          </Space>
          <Table
            className="striped-table"
            columns={columns}
            dataSource={filteredTasks}
            loading={loading}
            rowKey="id"
            expandable={{ expandedRowRender }}
            bordered
            locale={{
              emptyText: searchTerm
                ? <Empty description={`No tasks found for "${searchTerm}"`} />
                : <Empty description="No tasks created yet. Click 'Create Task' to begin." />
            }}
          />
        </Card>
      </Content>
      <CreateTaskModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSuccess={handleCreateSuccess} />
    </Layout>
  );
};

const App: React.FC = () => (
  <AntApp>
    <AppContent />
  </AntApp>
);

export default App;