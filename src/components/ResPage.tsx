import { Grid, Icon, Paper, Typography } from "@material-ui/core";
import { useState } from "react";
import { TaskResult } from "../store/taskSlice";
import { Chrono } from "react-chrono";
import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { IAccordion, IAccordionSummary, IAccordionDetails } from "./IAccordion";
import Gantt from "./Gantt";

interface ResPageProps {
  data: TaskResult[];
}

export default function ResPage(props: ResPageProps) {
  const { data } = props;
  const localizer = momentLocalizer(moment);

  const [active, setActive] = useState("panel1");
  const handleChange = (panel: string) => (
    e: React.ChangeEvent<{}>,
    newVal: boolean
  ) => setActive(panel);

  const getTimeLine = (data: TaskResult[]) =>
    data.map((row) => ({
      title: row.start,
      cardTitle: row.resource_id,
      cardSubtitle: row.process_id,
    }));

  const getPanelContent = () => {
    switch (active) {
      case "panel1":
        return (
          <div>
            <Gantt tasks={data} />
          </div>
        );
      case "panel2":
        return (
          <Paper style={{ height: "700px", overflowY: "scroll" }}>
            <Calendar date={new Date()} events={[]} localizer={localizer} />
          </Paper>
        );
      case "panel3":
        return (
          <div style={{ height: "700px" }}>
            <Chrono
              mode="VERTICAL_ALTERNATING"
              items={getTimeLine(data)}
              scrollable
            />
          </div>
        );
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={2}>
        <Paper square>
          <IAccordion
            square
            expanded={active === "panel1"}
            onChange={handleChange("panel1")}
            style={{ paddingTop: 8 }}
          >
            <IAccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography>甘特图</Typography>
            </IAccordionSummary>
            <IAccordionDetails>Gantt chart config</IAccordionDetails>
          </IAccordion>
          <IAccordion
            square
            expanded={active === "panel2"}
            onChange={handleChange("panel2")}
          >
            <IAccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography>日程表</Typography>
            </IAccordionSummary>
            <IAccordionDetails>Calendar config</IAccordionDetails>
          </IAccordion>
          <IAccordion
            square
            expanded={active === "panel3"}
            onChange={handleChange("panel3")}
          >
            <IAccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography>时间线</Typography>
            </IAccordionSummary>
            <IAccordionDetails>Timeline config</IAccordionDetails>
          </IAccordion>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        {getPanelContent()}
      </Grid>
    </Grid>
  );
}
