import {
  Drawer,
  Grid,
  Icon,
  Paper,
  Tab,
  Tabs,
  Typography,
  withStyles,
} from "@material-ui/core";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import { useState } from "react";
import { TaskResult } from "../store/taskSlice";
import Timeline from "react-calendar-timeline";
import { Chrono } from "react-chrono";
import React from "react";

interface ResPageProps {
  data: TaskResult[];
}

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
}))(MuiAccordionDetails);

export default function ResPage(props: ResPageProps) {
  const { data } = props;

  const [active, setActive] = useState("panel1");
  const [expanded, setExpanded] = useState<string | boolean>("panel1");
  const handleChange = (panel: string) => (
    e: React.ChangeEvent<{}>,
    newVal: boolean
  ) => {
    setActive(panel);
    setExpanded(newVal ? panel : false);
  };

  const getNumber = (str: string) => {
    str = str.split("_")[1];
    if (parseInt(str)) return parseInt(str);
    return 10000;
  };
  const getGroups = (data: TaskResult[]) => {
    let res = new Set<number>();
    data.forEach((row) => {
      res.add(getNumber(row.process_id));
    });
    return Array.from(res).map((value) => ({
      id: value,
      title: String(value),
    }));
  };

  const getChartData = (data: TaskResult[]) =>
    data.map((row, index) => ({
      id: index,
      group: getNumber(row.process_id),
      title: row.process_id,
      start_time: new Date(row.start_time),
      end_time: new Date(row.end_time),
    }));

  const getTimeLine = (data: TaskResult[]) =>
    data.map((row) => ({
      title: row.start_time,
      cardTitle: row.process_id,
      cardSubtitle: row.semi_product_id,
      cardDetailedText: row.resource_types,
    }));

  return (
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Paper square>
          <Accordion
            square
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            style={{ paddingTop: 8 }}
          >
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography>甘特图</Typography>
            </AccordionSummary>
            <AccordionDetails>Gantt chart config</AccordionDetails>
          </Accordion>
          <Accordion
            square
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
          >
            <AccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography>时间线</Typography>
            </AccordionSummary>
            <AccordionDetails>Timeline config</AccordionDetails>
          </Accordion>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        {active === "panel1" ? (
          <Timeline
            groups={getGroups(data)}
            items={getChartData(data)}
            defaultTimeStart={new Date("2021/12/1 9:00")}
            defaultTimeEnd={new Date("2021/12/1 14:00")}
          />
        ) : (
          <div style={{ width: "100%", height: "950px" }}>
            <Chrono
              mode="VERTICAL_ALTERNATING"
              items={getTimeLine(data)}
              scrollable
            />
          </div>
        )}
      </Grid>
    </Grid>
  );
}
