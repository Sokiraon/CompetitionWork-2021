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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  Link,
  Route,
  useParams,
  useRouteMatch,
  Switch,
} from "react-router-dom";
import ResPage from "../components/ResPage";
import sampleData from "../components/SampleData";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: { marginRight: theme.spacing(2) },
    tabs: { marginLeft: theme.spacing(2) },
  })
);

export default function Task() {
  const classes = useStyles();
  const { name } = useParams<{ name: string }>();
  const { url } = useRouteMatch<{ url: string }>();

  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(0);
  const onTabChange = (e: React.ChangeEvent<{}>, newVal: number) =>
    setActive(newVal);

  return (
    <React.Fragment>
      <Paper style={{ marginBottom: 8 }}>
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
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>提示</DialogTitle>
            <DialogContent>
              <DialogContentText>
                任务尚在运行过程中，请稍候再来查看结果！
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button component={Link} to="/dashboard" color="primary">
                回到控制台
              </Button>
              <Button component={Link} to={`${url}/add`} color="primary">
                前往插单页面
              </Button>
            </DialogActions>
          </Dialog>
          <ResPage data={sampleData} />
        </Route>
        <Route path="/dashboard/:name/add">
          <p>This ensures the add feature.</p>
        </Route>
      </Switch>
    </React.Fragment>
  );
}
