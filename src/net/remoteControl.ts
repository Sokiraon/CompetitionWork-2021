import axios from "axios";
import { Task } from "../data/taskSlice";

class remoteControl {
  private static serverUrl = "http://159.75.220.54:5000";

  static checkNameAvailability(name: string) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.serverUrl, name)
        .then((res) => {})
        .catch((err) => {});
    });
  }

  static pushNewTask(name: string, startTime: string, files: File[]) {
    let formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("name", name);
    formData.append("startTime", startTime);
    axios
      .post(this.serverUrl + "/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchTasks(username: string) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.serverUrl + "/taskList", { username })
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => console.log(err));
    });
  }
}

export default remoteControl;
