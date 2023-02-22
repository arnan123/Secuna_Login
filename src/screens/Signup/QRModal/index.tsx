import React, {  useState } from 'react';
import {
  Space,
  Input,
  Button,
  notification,
  Image,
  Typography,
} from 'antd';
import style from './styles.module.scss';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { TwoFAInterface } from '../../../interfaces/2FAInterface';

function QRModal({ twoFA }: { twoFA: TwoFAInterface }) {
  const [cookies, setCookie] = useCookies(['token', 'login-token']);
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();

  const submitCode = () => {
    if (!code.trim()) {
      notification.error({
        message: 'error in submitting code',
        duration: 3,
      });
      return;
    }

    if (!cookies.token) {
      notification.error({
        message: 'Cookies expired.Login Again',
        duration: 3,
      });
      return;
    }

    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND}/2fa/verify`,
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        'Content-Type': 'application/json',
      },
      data: { code },
    })
      .then((res) => {
        setCookie('login-token', res.data.access_token, {
          maxAge: 86400,
        });
        navigate('/Home', { replace: true });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <Space className={style['qr-modal-wrapper']}>
      <Space className={style['qr']}>
        <Space className={style['input']}>
          <Typography.Text>{twoFA.message}</Typography.Text>
          <Input
            placeholder="Enter Code Here"
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
        </Space>
        {twoFA.two_fa_enabled === false && <Image src={twoFA.two_fa_qr_url} />}
      </Space>

      <Button className={style['submit-button']} onClick={submitCode}>
        SUBMIT
      </Button>
    </Space>
  );
}

export default QRModal;
