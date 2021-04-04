import { useState } from "react";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import "gantt-schedule-timeline-calendar/dist/style.css";
import { TaskResult } from "../store/taskSlice";
import DeepState from "gantt-schedule-timeline-calendar/node_modules/deep-state-observer";
import GSTC, { Config, GSTCResult } from "gantt-schedule-timeline-calendar";

interface GanttProps {
  tasks: TaskResult[];
}

export default function Gantt(props: GanttProps) {
  const { tasks } = props;
  const [ganttState, setGanttState] = useState<DeepState>();

  const genRows = () => {
    return [
      { id: "1", label: "Row 1" },
      { id: "2", label: "Row 2" },
    ];
  };

  const genItems = () => {
    return [
      {
        id: "1",
        label: "Item 1",
        rowId: "1",
        time: {
          start: new Date("2020-01-03 9:00").valueOf(),
          end: new Date("2020-01-03 9:05").valueOf(),
        },
      },
      {
        id: "2",
        label: "Item 2",
        rowId: "1",
        time: {
          start: new Date("2020-01-03 9:30").valueOf(),
          end: new Date("2020-01-03 10:00").valueOf(),
        },
      },
      {
        id: "3",
        label: "Item 3",
        rowId: "2",
        time: {
          start: GSTC.api.date("2020-01-15").startOf("day").valueOf(),
          end: GSTC.api.date("2020-01-20").endOf("day").valueOf(),
        },
      },
    ];
  };

  const columns = [
    {
      id: "id",
      label: "ID",
      data: {},
      header: {
        content: "ID",
      },
    },
    {
      id: "label",
      data: "label",
      sortable: "label",
      header: {
        content: "Label",
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
        leftGlobal: new Date('2020-12-01').getTime(),
        zoom: 17,
      }
    },
  };

  return (
    <div
      ref={(element) => {
        if (element) {
          if (!ganttState) setGanttState(GSTC.api.stateFromConfig(config));
          else {
            GSTC({
              element,
              state: ganttState,
            });
          }
        }
      }}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
