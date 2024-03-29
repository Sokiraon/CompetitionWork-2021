import axios from "axios";
import Papa from "papaparse";
import { Task } from "../data/taskSlice";

class remoteControl {
  private static serverUrl = "http://159.75.220.54:5000";

  static checkNameAvailability(name: string) {
    return new Promise((resolve, reject) => {
      axios
        .post(this.serverUrl + "/isDuplicate", {
          username: "david",
          taskname: name,
        })
        .then((res) => {
          if (res.data === "ALREADY EXIST") reject("ALREADY EXIST");
          else resolve("OK");
        })
        .catch((err) => console.log(err));
    });
  }

  static pushNewTask(name: string, startTime: string, files: File[]) {
    let formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    axios
      .post(this.serverUrl + "/upload", formData, {
        headers: {
          username: "david",
          taskname: name,
          start: startTime,
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

  static fetchOldData(taskname: string, filename: string) {
    return new Promise((resolve, reject) => {
      axios
        .post(
          this.serverUrl + "/download",
          {
            username: "david",
            taskname: taskname,
            filename: filename,
          },
          {
            headers: {
              username: "david",
              taskname: taskname,
              filename: filename,
            },
          }
        )
        .then((res) => {})
        .catch((err) => reject(err));
    });
  }
}

export default remoteControl;
