import React, { useEffect, useState } from "react";
import { Route, useHistory } from "react-router";
import { Link, Switch } from "react-router-dom";
import { Button, Confirm, Container, Header, Icon, Menu, Table } from "semantic-ui-react";
import Auth from "../auth/core";

export default function Dashboard() {
  const auth = Auth.getInstance();
  const history = useHistory();

  const [logoutConfirm, setLogoutConfirm] = useState(false);

  const tableData = [
    { status: 'running', name: 'test1', started: '2021-01-01' },
    { status: 'finished', name: 'test2', started: '2021-01-02' },
  ];

  useEffect(() => {
    if (!Auth.getInstance().loginState) {
      //history.push('/');
    }
  });

  return (
    <React.Fragment>
      <Confirm content='确定要退出吗？' open={logoutConfirm}
      onCancel={() => setLogoutConfirm(false)} onConfirm={() => {
        auth.logout(); history.push('/');
      }} cancelButton='取消' confirmButton='确定' />
      <Menu borderless size='large'>
        <Container>
          <Menu.Item header>XSchedule</Menu.Item>
          <Menu.Item as={Link} to='/dashboard'>控制台</Menu.Item>
          <Menu.Item as={Link} to='/about'>关于</Menu.Item>
          <Menu.Menu position='right'>
            <Menu.Item><Button onClick={() => 
              setLogoutConfirm(true)
            }>登出</Button></Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>

      <Switch>
        <Route exact path='/dashboard'>
          <Container style={{ marginTop: '2em' }}>
            <Header as='h3' dividing>任务列表
              <Button compact color='blue' as={Link} to='/new'
              style={{ marginLeft: 12 }}>
                <Icon name='add' />新任务
              </Button>
            </Header>
            <Table singleLine striped columns={4} selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>状态</Table.HeaderCell>
                  <Table.HeaderCell>名称</Table.HeaderCell>
                  <Table.HeaderCell>开始于</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tableData.map(({ status, name, started}, index) =>
                  <Table.Row key={index}>
                    <Table.Cell collapsing>{ status === 'finished' ? 
                    (<div><Icon name='check' />已完成</div>) :
                    (<div><Icon name='play' />进行中</div>) }</Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{started}</Table.Cell>
                    <Table.Cell><Button icon as={Link} to={'/dashboard/' + name}>
                      <Icon name='external' />
                    </Button></Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Container>
        </Route>
        <Route exact path='/dashboard/:name' />
      </Switch>
    </React.Fragment>
  );
}