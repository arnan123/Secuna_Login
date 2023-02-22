import React, {  useState } from 'react';
import style from './styles.module.scss';
import {
  Space,
  Form,
  Input,
  Button,
  Tabs,
  TabsProps,
  notification,
  Modal,
} from 'antd';
import axios from 'axios';
import { UserInterface } from '../../interfaces/UserInteface';
import { useCookies } from 'react-cookie';
import { TwoFAInterface } from '../../interfaces/2FAInterface';
import QRModal from './QRModal';

function LoginScreen() {
  const [signupData, setSignup] = useState<UserInterface>(
    {} as UserInterface
  );
  const [signinData, setSignin] = useState<UserInterface>(
    {} as UserInterface
  );
  const [twoFA, setTwoFA] = useState<TwoFAInterface>(
    {} as TwoFAInterface
  );
  const [cookies, setCookie] = useCookies(['token', 'login-token']);
  const [signUpform] = Form.useForm();
  const [signInform] = Form.useForm();
  const [defaultActiveKey, setDefaultActiveKey] =
    useState<string>('1');
    
  const [isModalOpen, setIsModalOpen] = useState(false);


  const onSubmit = () => {
    if (signupData.password !== signupData.password_confirmation) {
      notification.error({
        message: 'Password mismatch',
        duration: 3,
      });
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BACKEND}/signup`, signupData)
      .then((res) => {
        if (res.data.status === 'success') {
          notification.success({
            message: res.data.message,
            duration: 3,
          });
        }
        signUpform.resetFields();
        setSignup({} as UserInterface);
        setDefaultActiveKey('1');
      })
      .catch((err) => {
        notification.error({
          message: err.response.data.message,
          duration: 3,
        });
      });
  };

  const SignIn = () => {
    axios
      .post(`${process.env.REACT_APP_BACKEND}/signin`, signinData)
      .then((res) => {
        setTwoFA(res.data);
        setCookie('token', res.data.access_token, { maxAge: 5000 });
        setIsModalOpen(true);

        signUpform.resetFields();
        setSignup({} as UserInterface);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Sign-in',
      children: (
        <Form
          form={signInform}
          onFinish={SignIn}
          className={style['form']}
        >
          <Form.Item
            className={style['form-item']}
            name="signin_email"
            rules={[
              {
                required: true,
                message: 'Email is required',
                type: 'email',
              },
            ]}
          >
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => {
                setSignin((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            className={style['form-item']}
            name="signin_password"
            rules={[
              {
                required: true,
                message: 'Password is required',
                min: 6,
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setSignin((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Button className={style['form-button']} htmlType="submit">
            Submit
          </Button>
        </Form>
      ),
    },
    {
      key: '2',
      label: 'Sign-up',
      children: (
        <Form
          form={signUpform}
          onFinish={onSubmit}
          className={style['form']}
        >
          <Form.Item
            className={style['form-item']}
            name="username"
            rules={[
              { required: true, message: 'Username is required' },
            ]}
          >
            <Input
              placeholder="Username"
              onChange={(e) => {
                setSignup((prevState) => ({
                  ...prevState,
                  username: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            className={style['form-item']}
            name="email"
            rules={[
              {
                required: true,
                message: 'Email is required',
                type: 'email',
              },
            ]}
          >
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => {
                setSignup((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            className={style['form-item']}
            name="password"
            rules={[
              {
                required: true,
                message: 'Password is required',
                min: 6,
              },
            ]}
          >
            <Input.Password
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setSignup((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            className={style['form-item']}
            name="confirm_password"
            rules={[
              {
                required: true,
                message: 'Confirm Password is required',
                min: 6,
              },
            ]}
          >
            <Input.Password
              placeholder="Confirm Password"
              type="password"
              onChange={(e) => {
                setSignup((prevState) => ({
                  ...prevState,
                  password_confirmation: e.target.value,
                }));
              }}
            />
          </Form.Item>
          <Button className={style['form-button']} htmlType="submit">
            Submit
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div className={style['login-wrapper']}>
      <Space className={style['form-container']}>
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
          }}
          footer={null}
          width={400}
        >
          <QRModal twoFA={twoFA} />
        </Modal>
        <Tabs
          className={style['tabs']}
          defaultActiveKey={defaultActiveKey}
          activeKey={defaultActiveKey}
          onChange={(e) => {
            setDefaultActiveKey(e);
          }}
          items={items}
          type="card"
          size="large"
        />
      </Space>
    </div>
  );
}

export default LoginScreen;
