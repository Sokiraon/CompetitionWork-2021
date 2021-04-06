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
} from "@material-ui/core";
import { FilePondFile } from "filepond";
import Papa from "papaparse";
import React, { useState } from "react";
import { FilePond } from "react-filepond";
import { useSelector } from "react-redux";
import {
  Link,
  Route,
  useParams,
  useRouteMatch,
  Switch,
} from "react-router-dom";
import { selectTaskResult, TaskResult } from "../store/taskSlice";
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

  const [active, setActive] = useState(0);
  const taskResult = useSelector(selectTaskResult);
  const onTabChange = (e: React.ChangeEvent<{}>, newVal: number) =>
    setActive(newVal);

  const [data, setData] = useState<TaskResult[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const updateFiles = (newFiles: FilePondFile[]) =>
    setFiles([newFiles[0]?.file]);
  const parse = () => {
    Papa.parse(files[0], {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      encoding: "utf-8",
      complete: (res) => {
        setData(res.data as TaskResult[]);
        console.log(data);
      },
    });
  };

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
              <Tab label="基本信息" component={Link} to={`${url}`} />
              <Tab label="排产结果" component={Link} to={`${url}/result`} />
              <Tab label="插单" component={Link} to={`${url}/add`} />
            </Tabs>
          </Toolbar>
        </AppBar>
      </Paper>
      <Switch>
        <Route exact path="/dashboard/:name">
          <FilePond files={files} onupdatefiles={updateFiles} />
          <Button onClick={parse}>Parse</Button>
        </Route>
        <Route path="/dashboard/:name/result">
          <ResPage data={sampleData} />
        </Route>
        <Route path="/dashboard/:name/add">
          <p>This ensures the add feature.</p>
        </Route>
      </Switch>
    </React.Fragment>
  );
}
