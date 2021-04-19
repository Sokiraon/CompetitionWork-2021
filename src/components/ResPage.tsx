import {
  Button,
  Checkbox,
  createStyles,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Icon,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import { ResourceType, TaskResult } from "../data/taskSlice";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Calendar from "./Calendar";
import ITimeline from "./ITimeline";
import { IAccordion, IAccordionDetails, IAccordionSummary } from "./IAccordion";

interface ResPageProps {
  data: TaskResult;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { marginTop: theme.spacing(0.25) },
    icon: {
      marginRight: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(2),
      marginBottom: 0,
    },
    timePicker: {
      width: "200px",
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    button: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
  })
);

export default function ResPage(props: ResPageProps) {
  const { data } = props;
  const classes = useStyles();
  const [disabled, setDisabled] = useState(true);

  const [active, setActive] = useState("panel1");
  const handleChange = (panel: string) => () => setActive(panel);

  const [check, setCheck] = useState({
    机床: true,
    人员: false,
    设备: false,
  });
  const { 机床, 人员, 设备 } = check;
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheck({ ...check, [e.target.name]: e.target.checked });
  };

  const [radio, setRadio] = useState<ResourceType>("机床");
  const handleRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadio(e.target.value as ResourceType);
  };

  const [startBegin, setStartBegin] = useState("2020-12-01T09:00");
  const onBeginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartBegin(e.target.value);
    setDisabled(false);
  };
  const [startEnd, setStartEnd] = useState("2020-12-01T11:00");
  const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartEnd(e.target.value);
    setDisabled(false);
  };

  const getPanelContent = () => {
    switch (active) {
      case "panel1":
        return (
          <Paper style={{ height: "700px", overflowY: "scroll" }}>
            <Calendar tasks={data} types={check} />
          </Paper>
        );
      case "panel2":
        return (
          <Paper style={{ height: "700px", overflowY: "scroll" }}>
            <ITimeline tasks={data} type={radio} />
          </Paper>
        );
    }
  };

  return (
    <Grid container spacing={1} className={classes.root}>
      <Grid item xs={2}>
        <Paper square>
          <IAccordion
            square
            expanded={active === "panel1"}
            onChange={handleChange("panel1")}
          >
            <IAccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Icon className={classes.icon}>event_note</Icon>
              <Typography>日程表</Typography>
            </IAccordionSummary>
            <IAccordionDetails>
              <FormControl component="fieldset">
                <Typography variant='body1'>筛选资源类型</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={机床}
                        onChange={handleCheck}
                        name="机床"
                      />
                    }
                    label="机床"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={人员}
                        onChange={handleCheck}
                        name="人员"
                      />
                    }
                    label="人员"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={设备}
                        onChange={handleCheck}
                        name="设备"
                      />
                    }
                    label="设备"
                  />
                </FormGroup>
              </FormControl>
            </IAccordionDetails>
          </IAccordion>
          <Divider />
          <IAccordion
            square
            expanded={active === "panel2"}
            onChange={handleChange("panel2")}
          >
            <IAccordionSummary expandIcon={<Icon>expand_more</Icon>}>
              <Icon className={classes.icon}>timeline</Icon>
              <Typography>时间线</Typography>
            </IAccordionSummary>
            <IAccordionDetails>
              <FormControl component="fieldset">
                <Typography variant='body1'>筛选资源类型</Typography>
                <RadioGroup value={radio} onChange={handleRadio}>
                  <FormControlLabel
                    value="机床"
                    control={<Radio />}
                    label="机床"
                  />
                  <FormControlLabel
                    value="人员"
                    control={<Radio />}
                    label="人员"
                  />
                  <FormControlLabel
                    value="设备"
                    control={<Radio />}
                    label="设备"
                  />
                </RadioGroup>
              </FormControl>
            </IAccordionDetails>
          </IAccordion>
          <Divider />
          <FormControl component="fieldset" className={classes.formControl}>
            <Typography variant='body1'>限定时间范围</Typography>
            <TextField
              label="最早开始时间"
              type="datetime-local"
              value={startBegin}
              className={classes.timePicker}
              onChange={onBeginChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="最晚开始时间"
              type="datetime-local"
              value={startEnd}
              className={classes.timePicker}
              onChange={onEndChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              disableElevation
              color="primary"
              size="large"
              disabled={disabled}
              className={classes.button}
            >
              应用
            </Button>
          </FormControl>
        </Paper>
      </Grid>
      <Grid item xs={10}>
        {getPanelContent()}
      </Grid>
    </Grid>
  );
}
