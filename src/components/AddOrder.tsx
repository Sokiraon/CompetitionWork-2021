import {
  Button,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Theme,
} from "@material-ui/core";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { columnDefs, gridOptions, headers } from "../data/tableGridDef";
import TableGrid from "./TableGrid";

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

export default function AddOrder() {
  const classes = useStyles();
  const [tab, setTab] = useState(0);

  let oldData: object[][] = [[], [], [], [], []];
  const [activeTable, setActiveTable] = useState(0);

  const [newData, setNewData] = useState<object[]>([]);

  useEffect(() => {
    //oldData[activeTable] = [];
  }, [activeTable]);

  return (
    <Paper className={classes.root} square>
      <Grid container spacing={0}>
        <Grid item xs={2}>
          <Tabs
            orientation="vertical"
            value={tab}
            onChange={(e, v) => setTab(v)}
            className={classes.tabs}
          >
            <Tab label="原数据" />
            <Tab label="新数据" />
            <Button
              color="primary"
              variant="contained"
              disableElevation
              className={classes.button}
            >
              提交
            </Button>
          </Tabs>
        </Grid>
        <Grid item xs={10}>
          <TabPanel value={tab} index={0}>
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
          <TabPanel value={tab} index={1}>
            <TableGrid data={newData} setData={setNewData} colDefs={columnDefs[0]} />
          </TabPanel>
        </Grid>
      </Grid>
    </Paper>
  );
}
