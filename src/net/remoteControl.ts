import axios from "axios";
import { Task } from "../store/taskSlice";

class remoteControl {
  static pushNewTask(task: Task, files: File[]) {
    let formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('name', task.name);
    formData.append('startTime', task.startTime);
    axios.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default remoteControl;