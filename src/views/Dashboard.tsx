import {
  Icon as MTIcon,
  Button as MTButton,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory } from "react-router";
import { Link, Switch } from "react-router-dom";
import {
  Button,
  Container,
  Header,
  Icon,
  Message,
  Table,
} from "semantic-ui-react";
import Auth from "../net/auth";
import AppMenu from "../components/AppMenu";
import { addTask, selectTaskList, Task } from "../data/taskSlice";
import remoteControl from "../net/remoteControl";

interface TaskItem {
  taskname: string;
  start: string;
  status: string;
}

export default function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const tasks = useSelector(selectTaskList);

  useEffect(() => {
    if (!Auth.getInstance().loginState) {
      //history.push('/');
    }
    remoteControl.fetchTasks("david").then((res) => {
      let taskList = res as Array<TaskItem>;
      for (let task of taskList) {
        dispatch(
          addTask({
            running: task["status"] === "FINISHED" ? false : true,
            name: task["taskname"],
            startTime: task["start"],
          })
        );
      }
    });
  }, [Auth.getInstance().loginState]);

  return (
    <React.Fragment>
      <AppMenu />
      <Switch>
        <Route exact path="/dashboard">
          <Container style={{ marginTop: "2em" }}>
            <Header as="h3" dividing>
              任务列表
              <Button
                compact
                color="blue"
                as={Link}
                to="/new"
                style={{ marginLeft: 12 }}
              >
                <Icon name="add" />
                新任务
              </Button>
            </Header>
            {tasks.length ? null : (
              <Message content="无任务，请创建新任务" warning attached="top" />
            )}
            <Table singleLine striped columns={4} selectable attached>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>状态</Table.HeaderCell>
                  <Table.HeaderCell>名称</Table.HeaderCell>
                  <Table.HeaderCell>开始于</Table.HeaderCell>
                  <Table.HeaderCell />
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tasks.map(({ running, name, startTime }) => (
                  <Table.Row key={name} positive={!running} warning={running}>
                    <Table.Cell collapsing>
                      {running ? (
                        <div>
                          <Icon name="play" />
                          进行中
                        </div>
                      ) : (
                        <div>
                          <Icon name="check" />
                          已完成
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell content={name} />
                    <Table.Cell content={startTime ?? "N/A"} />
                    <Table.Cell textAlign="right">
                      <MTButton
                        component={Link}
                        to={"/dashboard/" + name}
                        endIcon={<MTIcon>arrow_forward</MTIcon>}
                        size="large"
                      >
                        <Typography variant="body1">详情</Typography>
                      </MTButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Container>
        </Route>
      </Switch>
    </React.Fragment>
  );
}
