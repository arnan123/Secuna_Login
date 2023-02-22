import React, { useEffect, useState } from 'react';
import style from './styles.module.scss';
import {
  Space,
  Table,
  Button,
  Modal,
  Typography,
  notification,
} from 'antd';
import { useCookies } from 'react-cookie';
import { ReportInterface } from '../../interfaces/ReportInterface';
import axios from 'axios';
import AddModal from './AddModal';
import { useNavigate } from 'react-router-dom';

function HomeScreen() {
  const [cookies] = useCookies(['token', 'login-token']);
  const [reports, setReports] = useState<ReportInterface[]>([]);
  const [isRefresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchReports().catch((err) => console.error(err));
  }, [isRefresh]);

  const fetchReports = async () => {
    if (!cookies['login-token']) {
      navigate('/', { replace: true });
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND}/reports`,
        {
          headers: {
            Authorization: `Bearer ${cookies['login-token']}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setReports(response.data.reports);
    } catch (err) {
      console.log(err);
    }
  };

  const addReport = () => {
    setIsModalOpen(true);
  };

  const deleteReport = async (uuid: string) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND}/reports/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${cookies['login-token']}`,
            'Content-Type': 'application/json',
          },
        }
      );
      notification.success({
        message: response.data.message,
        duration: 3,
      });
      setReports(response.data.reports);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={style['home-wrapper']}>
      <Space className={style['header']}>
        <Typography.Title level={3}>All Reports</Typography.Title>
        <Button
          size="large"
          className={style['add-button']}
          onClick={addReport}
        >
          Add Report
        </Button>
      </Space>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={null}
        width={300}
      >
        <AddModal setRefresh={setRefresh} isRefresh={isRefresh} />
      </Modal>
      <Table
        className={style['table']}
        columns={[
          {
            key: 'vulnerability_type',
            dataIndex: 'vulnerability_type',
            title: 'vulnerability_type',
          },
          {
            key: 'title',
            dataIndex: 'title',
            title: 'title',
          },
          {
            key: 'description',
            dataIndex: 'description',
            title: 'description',
          },
          {
            key: 'Actions',
            dataIndex: 'Actions',
            title: 'Actions',
            render: (data, report: ReportInterface) => {
              return (
                <Button
                  onClick={() => {
                    deleteReport(report.uuid);
                  }}
                >
                  DELETE
                </Button>
              );
            },
          },
        ]}
        dataSource={reports || []}
        rowKey={(data) => data.uuid}
        pagination={false}
        size="small"
      />
    </div>
  );
}

export default HomeScreen;
