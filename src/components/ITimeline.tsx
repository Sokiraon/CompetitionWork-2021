import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import { TaskResult } from "../data/taskSlice";
import { makeStyles, Paper, Typography } from "@material-ui/core";

interface ITimelineProps {
  tasks: TaskResult;
  type: "机床" | "人员" | "设备";
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

export default function ITimeline(props: ITimelineProps) {
  const classes = useStyles();
  const { tasks, type } = props;

  const genTimeline = () => {
    let data = tasks[type] ?? {};
    if (!Object.keys(data).length) return null;
    return Object.entries(data).map((entry) =>
      entry[1].map((value) => (
        <TimelineItem>
          <TimelineOppositeContent>
            <Typography variant="body2" color="textSecondary">
              {value.start}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={3} className={classes.paper}>
              <Typography variant="h6" component="h1">
                工序名：{value.process_id}
              </Typography>
              <Typography>{`名称：${
                entry[0]
              }，需求量：${value.amount.toString()}`}</Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))
    );
  };

  return (
    <Timeline align="alternate">
      {genTimeline() ?? <Typography variant="h6">无数据</Typography>}
    </Timeline>
  );
}
