import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Confirm, Container, Menu } from "semantic-ui-react";
import Auth from "../auth/core";

export default function Dashboard() {
  const auth = Auth.getInstance();
  const history = useHistory();

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  useEffect(() => {
    if (!Auth.getInstance().loginState)
      history.push('/');
  })

  return (
    <React.Fragment>
      <Confirm content='确定要退出吗？' open={logoutConfirm}
      onCancel={() => setLogoutConfirm(false)} onConfirm={() => {
        auth.logout();
        history.push('/');
      }} cancelButton='取消' confirmButton='确定' />
      <Menu fixed='top' borderless size='large'>
        <Container>
          <Menu.Item header>XSchedule</Menu.Item>
          <Menu.Item as='a'>控制台</Menu.Item>
          <Menu.Item as='a'>关于</Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item><Button onClick={() => 
              setLogoutConfirm(true)
            }>登出</Button></Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </React.Fragment>
  );
}