import moment from "moment";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { ResourceType, TaskResult } from "../store/taskSlice";

interface CalendarProps {
  tasks: TaskResult;
  types: {
    [type in ResourceType]: boolean;
  }
}

export default function Calendar(props: CalendarProps) {
  const { tasks, types } = props;
  const localizer = momentLocalizer(moment);

  const genEvents = () => {
    let res: object[] = [];
    for (let [key, value] of Object.entries(tasks)) {
      if (value && types[key as ResourceType]) {
        for (let i in value) {
          value[i].forEach((value) => {
            res.push({
              title: value.process_id,
              start: new Date(value.start),
              end: new Date(value.end),
              resourceId: i,
            });
          });
        }
      }
    }
    return res;
  };

  const genResourses = () => {
    let res: object[] = [];
    for (let [key, value] of Object.entries(tasks)) {
      if (value && types[key as ResourceType]) {
        for (let i in value) {
          res.push({
            "id": i,
            "title": i
          })
        }
      }
    }
    return res;
  }

  return (
    <BigCalendar
      view="day"
      views={["day"]}
      popup={true}
      date={new Date("2020-12-01")}
      events={genEvents()}
      resources={genResourses()}
      localizer={localizer}
    />
  );
}
