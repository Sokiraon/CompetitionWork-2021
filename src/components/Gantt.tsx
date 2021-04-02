import { gantt } from 'dhtmlx-gantt';
import { useEffect, useState } from 'react';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { TaskResult } from '../store/taskSlice';
import initializeGSTC from './GanttData';
import { GSTCResult } from 'gantt-schedule-timeline-calendar';

interface GanttProps {
  tasks: TaskResult[];
}

function getGanttData(tasks: TaskResult[]) {
  return {
    data: tasks.map((task, index) => ({
      id: index,
      text: task.process_id,
      start_date: new Date(task.start_time),
      end_date: new Date(task.end_time)
    }))
  }
}

export default function Gantt(props: GanttProps) {
  const { tasks } = props;
  const [container, setContainer] = useState<HTMLDivElement | null>();
  let state: any, gstc: any;

  useEffect(() => {
    gantt.parse(getGanttData(tasks));
    gantt.render();
  });

  return (
    <div
      ref={(element) => {
        if (element) initializeGSTC(element, state, gstc);
      }}
      style={{ width: '100%', height: '100%' }} 
    />
  )
}