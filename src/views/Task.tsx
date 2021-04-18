import {
  AppBar,
  IconButton,
  Toolbar,
  Icon,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Link,
  Route,
  useParams,
  useRouteMatch,
  Switch,
} from "react-router-dom";
import { Dimmer } from "semantic-ui-react";
import AddOrder from "../components/AddOrder";
import ResPage from "../components/ResPage";
import sampleData from "../components/SampleData";
import { selectTaskStatus } from "../data/taskSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: { marginRight: theme.spacing(2) },
    tabs: { marginLeft: theme.spacing(2) },
    appBar: { marginBottom: theme.spacing(0.5) },
  })
);

export default function Task() {
  const classes = useStyles();
  const { name } = useParams<{ name: string }>();
  const { url } = useRouteMatch<{ url: string }>();
  const taskRunning = useSelector(selectTaskStatus)(name);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const onTabChange = (e: React.ChangeEvent<{}>, newVal: number) =>
    setActive(newVal);

  useEffect(() => {
    if (taskRunning) {
      axios
        .post("http://159.75.220.54:5000/getResList", {
          "TYPE": ["机床", "人员", "设备"],
          "START_TIME": "2020-12-01 09:00:00",
          "END_TIME": "2020-12-01 11:00:00",
          "username": "david",
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [taskRunning]);

  return (
    <React.Fragment>
      <Paper className={classes.appBar}>
        <AppBar position="static" color="inherit" elevation={0}>
          <Toolbar variant="dense">
            <IconButton
              edge="start"
              color="inherit"
              className={classes.backButton}
              component={Link}
              to="/dashboard"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
            <Typography variant="h6" color="inherit">
              {name}
            </Typography>
            <Tabs
              value={active}
              onChange={onTabChange}
              centered
              className={classes.tabs}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="排产结果" component={Link} to={`${url}`} />
              <Tab label="插单" component={Link} to={`${url}/add`} />
            </Tabs>
          </Toolbar>
        </AppBar>
      </Paper>
      <Switch>
        <Route exact path="/dashboard/:name">
          <Dimmer.Dimmable dimmed={open} blurring>
            <Dimmer active={open}>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    提示
                  </Typography>
                  <Typography>
                    任务尚在运行过程中，请稍候再来查看结果！
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button component={Link} to="/dashboard">
                    回到控制台
                  </Button>
                  <Button
                    component={Link}
                    to={`${url}/add`}
                    color="primary"
                    onClick={() => setActive(1)}
                  >
                    前往插单页面
                  </Button>
                </CardActions>
              </Card>
            </Dimmer>
            <ResPage data={sampleData} />
          </Dimmer.Dimmable>
        </Route>
        <Route path="/dashboard/:name/add">
          <AddOrder />
        </Route>
      </Switch>
    </React.Fragment>
  );
}
