import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Confirm, Container, Menu } from "semantic-ui-react";
import Auth from "../net/auth";

export default function AppMenu() {
  const auth = Auth.getInstance();
  const history = useHistory();
  const [logoutConfirm, setLogoutConfirm] = useState(false);

  return (
    <React.Fragment>
      <Confirm content='确定要退出吗？' open={logoutConfirm}
      onCancel={() => setLogoutConfirm(false)} onConfirm={() => {
        auth.logout(); history.push('/');
      }} cancelButton='取消' confirmButton='确定' />
      <Menu borderless size='large'>
        <Container>
          <Menu.Item header content='XSchedule' />
          <Menu.Item as={Link} to='/dashboard' content='控制台' />
          <Menu.Item as={Link} to='/about' content='关于' />
          <Menu.Menu position='right'>
            <Menu.Item><Button onClick={() => 
              setLogoutConfirm(true)
            }>登出</Button></Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    </React.Fragment>
  )
}