import { Grid, Paper, Tab, Tabs } from "@material-ui/core";
import { useState } from "react";
import { TaskResult } from "../store/taskSlice";
import Timeline from "react-calendar-timeline";
import { Chrono } from "react-chrono";

interface ResPageProps {
  data: TaskResult[];
}

export default function ResPage(props: ResPageProps) {
  const { data } = props;
  const [tab, setTab] = useState(0);
  const onTabChange = (e: React.ChangeEvent<{}>, val: number) => setTab(val);

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
    <Grid container spacing={0}>
      <Grid item xs={2}>
        <Paper square>
          <Tabs
            value={tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={onTabChange}
            orientation="vertical"
          >
            <Tab label="甘特图" />
            <Tab label="时间线" />
          </Tabs>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        {tab === 0 ? (
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
