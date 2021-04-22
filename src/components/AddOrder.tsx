import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
} from "@material-ui/core";
import { AgGridReact } from "ag-grid-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { columnDefs, gridOptions, headers } from "../data/tableGridDef";
import remoteControl from "../net/remoteControl";
import TableGrid from "./TableGrid";
import { updateTaskStatus } from "../data/taskSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div style={{ height: "630px" }} hidden={value !== index}>
      {value === index ? children : null}
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
  tabs: {
    height: "700px",
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  button: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(5),
  },
  header: {
    margin: theme.spacing(2),
    marginBottom: 0,
  },
  table: {
    margin: theme.spacing(2),
    marginTop: 0,
    marginBottom: theme.spacing(3),
    width: "auto",
    height: "620px",
  },
}));

interface AddOrderProps {
  taskname: string;
}

export default function AddOrder(props: AddOrderProps) {
  const { taskname } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  let oldData: object[][] = [[], [], [], [], []];
  const [activeTable, setActiveTable] = useState(0);

  const [newData, setNewData] = useState<object[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const openUpload = () => setUploadOpen(true);
  const closeUpload = () => setUploadOpen(false);

  const upload = () => {
    dispatch(
      updateTaskStatus({
        name: taskname,
        running: true,
        startTime: new Date().toUTCString(),
      })
    );
    history.push("/dashboard");
  };

  useEffect(() => {
    let filename = `aps_${headers[activeTable].toLowerCase()}.csv`;
    remoteControl
      .fetchOldData(taskname, filename)
      .then((res) => {})
      .catch((err) => {});
  }, [activeTable]);

  return (
    <Paper className={classes.root} square>
      <Dialog open={uploadOpen} onClose={closeUpload}>
        <DialogTitle>提示</DialogTitle>
        <DialogContent>
          <DialogContentText>
            确定要上传新数据吗？当前正在运行的同名任务将会被覆盖！
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUpload}>取消</Button>
          <Button color="primary" onClick={upload}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(e, v) => setTab(v)}
            className={classes.tabs}
          >
            <Tab label="新数据" />
            <Button
              color="primary"
              variant="contained"
              disableElevation
              className={classes.button}
              onClick={openUpload}
            >
              提交
            </Button>
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TabPanel value={tab} index={1}>
            <Paper square className={classes.header}>
              <Tabs
                centered
                value={activeTable}
                onChange={(e, v) => setActiveTable(v)}
              >
                {headers.map((header) => (
                  <Tab label={header} />
                ))}
              </Tabs>
              <Divider />
            </Paper>
            <Paper className={`ag-theme-material ${classes.table}`}>
              <AgGridReact
                gridOptions={gridOptions}
                columnDefs={columnDefs[activeTable]}
                rowData={oldData[activeTable]}
              />
            </Paper>
          </TabPanel>
          <TabPanel value={tab} index={0}>
            <TableGrid
              data={newData}
              setData={setNewData}
              colDefs={columnDefs[0]}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
}
