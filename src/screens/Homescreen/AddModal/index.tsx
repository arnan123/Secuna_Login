import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Space,
  Button,
  Typography,
  Form,
  Input,
  notification,
} from 'antd';
import style from './styles.module.scss';
import { useCookies } from 'react-cookie';
import { ReportInterface } from '../../../interfaces/ReportInterface';
import axios from 'axios';

function AddModal({
  setRefresh,
  isRefresh,
}: {
  setRefresh: Dispatch<SetStateAction<boolean>>;
  isRefresh: boolean;
}) {
  const [cookies] = useCookies(['token', 'login-token']);
  const [form] = Form.useForm();
  const [report, setReport] = useState<ReportInterface>(
    {} as ReportInterface
  );
  const submitReport = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND}/reports`, report, {
        headers: {
          Authorization: `Bearer ${cookies['login-token']}`,
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log(res);
        notification.success({ message: res.data.message });
        setRefresh(!isRefresh);
        setReport({} as ReportInterface);
        form.resetFields();
      });
  };

  return (
    <Space className={style['add-modal']}>
      <Typography.Title className={style['title']} level={4}>
        SUBMIT A REPORT
      </Typography.Title>
      <Form form={form} onFinish={submitReport}>
        <Form.Item
          name="vulnerability_type"
          rules={[
            {
              required: true,
              message: 'Vulnerability Type is required',
            },
          ]}
        >
          <Input
            placeholder="Vulnerability Type"
            onChange={(e) => {
              setReport((prevState) => ({
                ...prevState,
                vulnerability_type: e.target.value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          name="severity_level"
          rules={[
            {
              required: true,
              message: 'Severity Level is required',
            },
          ]}
        >
          <Input
            placeholder="Severity Level"
            onChange={(e) => {
              setReport((prevState) => ({
                ...prevState,
                severity_level: e.target.value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: 'Title is required',
            },
          ]}
        >
          <Input
            placeholder="Title"
            onChange={(e) => {
              setReport((prevState) => ({
                ...prevState,
                title: e.target.value,
              }));
            }}
          />
        </Form.Item>
        <Form.Item
          name="description"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input
            placeholder="Description"
            onChange={(e) => {
              setReport((prevState) => ({
                ...prevState,
                description: e.target.value,
              }));
            }}
          />
        </Form.Item>
        <Button className={style['button']} htmlType="submit">
          SUBMIT
        </Button>
      </Form>
    </Space>
  );
}

export default AddModal;
