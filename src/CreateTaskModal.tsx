import React from 'react';
import { Modal, Form, Input, message } from 'antd';
import type { Task } from './types';
import * as api from './api';

interface CreateTaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await api.createTask(values as Omit<Task, 'taskExecutions'>);
      message.success('Task created successfully!');
      onSuccess(); // This will trigger a refresh in the main App component
      form.resetFields();
    } catch (error) {
      message.error('Failed to create task. Please check the details.');
    }
  };

  return (
    <Modal
      title="Create a New Task"
      open={visible}
      onOk={handleCreate}
      onCancel={onClose}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" name="create_task_form">
        <Form.Item name="id" label="Task ID" rules={[{ required: true, message: 'Please input the task ID!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Task Name" rules={[{ required: true, message: 'Please input the task name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="owner" label="Owner" rules={[{ required: true, message: 'Please input the owner!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="command" label="Command" rules={[{ required: true, message: 'Please input the command!' }]}>
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateTaskModal;