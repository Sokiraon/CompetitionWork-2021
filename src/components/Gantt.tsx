import { useCallback, useEffect, useState } from "react";
import "gantt-schedule-timeline-calendar/dist/style.css";
import { TaskResult } from "../store/taskSlice";
import DeepState from "gantt-schedule-timeline-calendar/node_modules/deep-state-observer";
import GSTC, {
  Config,
  GSTCResult,
  Item,
  Row,
} from "gantt-schedule-timeline-calendar";

interface GanttProps {
  tasks: TaskResult;
}

let gstc: GSTCResult, ganttState: DeepState;

export default function Gantt(props: GanttProps) {
  const { tasks } = props;
  const callback = useCallback((element) => {
    if (element) {
      ganttState = GSTC.api.stateFromConfig(config);
      gstc = GSTC({
        element,
        state: ganttState,
      });
    }
  }, []);

  const genRows = () => {
    let res: Row[] = [];
    for (const [key, value] of Object.entries(tasks)) {
      if (value) {
        for (let i in value) {
          res.push({
            id: i,
            label: i,
          });
        }
      }
    }
    console.log(res);
    return res;
  };

  const genItems = () => {
    let res: Item[] = [];
    for (const [key, value] of Object.entries(tasks)) {
      if (value) {
        for (let i in value) {
          value[i].forEach((value, index) => {
            let label = i + index.toString();
            res.push({
              id: label,
              label: "",
              rowId: i,
              time: {
                start: new Date(value.start).valueOf(),
                end: new Date(value.end).valueOf(),
              },
            });
          });
        }
      }
    }
    console.log(res);
    return res;
  };

  const columns = [
    {
      id: "label",
      data: "label",
      sortable: "label",
      header: {
        content: "资源名称",
      },
    },
  ];

  const config: Config = {
    licenseKey:
      "====BEGIN LICENSE KEY====\nXOfH/lnVASM6et4Co473t9jPIvhmQ/l0X3Ewog30VudX6GVkOB0n3oDx42NtADJ8HjYrhfXKSNu5EMRb5KzCLvMt/pu7xugjbvpyI1glE7Ha6E5VZwRpb4AC8T1KBF67FKAgaI7YFeOtPFROSCKrW5la38jbE5fo+q2N6wAfEti8la2ie6/7U2V+SdJPqkm/mLY/JBHdvDHoUduwe4zgqBUYLTNUgX6aKdlhpZPuHfj2SMeB/tcTJfH48rN1mgGkNkAT9ovROwI7ReLrdlHrHmJ1UwZZnAfxAC3ftIjgTEHsd/f+JrjW6t+kL6Ef1tT1eQ2DPFLJlhluTD91AsZMUg==||U2FsdGVkX1/SWWqU9YmxtM0T6Nm5mClKwqTaoF9wgZd9rNw2xs4hnY8Ilv8DZtFyNt92xym3eB6WA605N5llLm0D68EQtU9ci1rTEDopZ1ODzcqtTVSoFEloNPFSfW6LTIC9+2LSVBeeHXoLEQiLYHWihHu10Xll3KsH9iBObDACDm1PT7IV4uWvNpNeuKJc\npY3C5SG+3sHRX1aeMnHlKLhaIsOdw2IexjvMqocVpfRpX4wnsabNA0VJ3k95zUPS3vTtSegeDhwbl6j+/FZcGk9i+gAy6LuetlKuARjPYn2LH5Be3Ah+ggSBPlxf3JW9rtWNdUoFByHTcFlhzlU9HnpnBUrgcVMhCQ7SAjN9h2NMGmCr10Rn4OE0WtelNqYVig7KmENaPvFT+k2I0cYZ4KWwxxsQNKbjEAxJxrzK4HkaczCvyQbzj4Ppxx/0q+Cns44OeyWcwYD/vSaJm4Kptwpr+L4y5BoSO/WeqhSUQQ85nvOhtE0pSH/ZXYo3pqjPdQRfNm6NFeBl2lwTmZUEuw==\n====END LICENSE KEY====",
    list: {
      columns: {
        data: GSTC.api.fromArray(columns),
      },
      rows: GSTC.api.fromArray(genRows()),
    },
    chart: {
      items: GSTC.api.fromArray(genItems()),
      time: {
        leftGlobal: new Date("2020-12-01").getTime(),
        zoom: 17,
      },
    },
  };

  return <div ref={callback} style={{ width: "100%", height: "100%" }} />;
}
