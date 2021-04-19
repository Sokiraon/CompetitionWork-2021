import React, { useState } from "react";
import { useHistory } from "react-router";
import {
  Button,
  Grid,
  Header,
  Input,
  Message,
  Segment,
  Step,
} from "semantic-ui-react";
import SwipeableViews from "react-swipeable-views";
import Papa from "papaparse";
import { FilePond } from "react-filepond";
import { FilePondFile } from "filepond";
import {
  MenuItem,
  TextField,
  Button as MTButton,
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Icon,
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Paper,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import { useDispatch } from "react-redux";
import { addTask } from "../data/taskSlice";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import TableGrid from "../components/TableGrid";
import remoteControl from "../net/remoteControl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: { position: "relative" },
    title: { marginLeft: theme.spacing(2), flex: 1 },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function New() {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileIndex, setFileIndex] = useState(0);

  const [colDefs, setColDefs] = useState<ColDef[]>([]);
  const [tableData, setTableData] = useState<object[]>([]);
  const [tableOpen, setTableOpen] = useState(false);

  const [hasName, setHasName] = useState(false);
  const [nameChecked, setNameChecked] = useState(false);
  const [checkMsg, setCheckMsg] = useState("");

  const steps = ["欢迎", "取个名字", "来点数据", "做些修改", "大功告成"];
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const checkAvailable = () => {
    setNameChecked(false);
    remoteControl.checkNameAvailability(name)
      .then(() => {
        setHasName(false);
        setNameChecked(true);
        setCheckMsg("任务名可用！");
      })
      .catch(() => {
        setHasName(true);
        setNameChecked(true);
        setCheckMsg("任务名已存在！");
      })
  };

  const iniTable = () => {
    if (files[fileIndex])
      Papa.parse(files[fileIndex], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        encoding: "utf-8",
        complete: (res) => {
          let data = res.data as object[];
          setTableData(data);
          setColDefs(
            Object.keys(data[0]).map((value, index) => ({
              field: value,
              checkboxSelection: !index,
              headerCheckboxSelection: !index,
            }))
          );
          setTableOpen(true);
        },
      });
  };

  const updateFiles = (newFiles: FilePondFile[]) =>
    setFiles(newFiles.map((fileItem) => fileItem.file));

  const handleSubmit = () => {
    const time = new Date().toUTCString();
    dispatch(
      addTask({
        running: true,
        name: name,
        startTime: time,
      })
    );
    remoteControl.pushNewTask(name, time, files);
    history.push("/dashboard");
  };

  const setTableClose = () => setTableOpen(false);
  const saveTableData = () => {
    let file = new File(
      [new Blob([Papa.unparse(tableData)], { type: "text/csv" })],
      files[fileIndex].name
    );
    let newFiles = [...files];
    newFiles.splice(fileIndex, 1, file);
    setFiles(newFiles);
    setTableClose();
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={tableOpen}
        onClose={setTableClose}
        TransitionComponent={Transition}
      >
        <Paper>
          <AppBar className={classes.appBar} color="inherit" elevation={0}>
            <Toolbar variant="dense">
              <IconButton edge="start" color="inherit" onClick={setTableClose}>
                <Icon>close</Icon>
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                查看及修改数据
              </Typography>
              <MTButton color="inherit" onClick={saveTableData}>
                <Typography variant="body1">保存</Typography>
              </MTButton>
            </Toolbar>
          </AppBar>
        </Paper>
        <TableGrid data={tableData} colDefs={colDefs} setData={setTableData} />
      </Dialog>

      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column width="9">
          <Step.Group ordered attached="top">
            {steps.map((value, index) => (
              <Step
                key={value}
                title={value}
                completed={index < step}
                active={index === step}
              />
            ))}
          </Step.Group>
          <Segment stacked textAlign="left" attached>
            <SwipeableViews index={step} style={{ margin: "1em 0" }}>
              <React.Fragment>
                <Header as="h1" color="teal" content="欢迎！" />
                <Typography variant="h6">
                  本向导将帮助你新建一个排产任务。
                </Typography>
                <Typography variant="h6">要继续，请单击“下一步”。</Typography>
              </React.Fragment>

              <React.Fragment>
                <Header as="h3" content="首先，请确定一个任务名：" />
                <Message
                  info
                  header="注意"
                  content="任务名不需要很复杂，具有足够辨识度即可。"
                />
                <Input
                  placeholder="输入任务名"
                  action={
                    <Button
                      content="检查可用性"
                      color="blue"
                      onClick={checkAvailable}
                    ></Button>
                  }
                  fluid
                  onChange={(e) => setName(e.target.value)}
                />
                <Message
                  positive={!hasName}
                  negative={hasName}
                  hidden={!nameChecked}
                  header={checkMsg}
                />
              </React.Fragment>

              <React.Fragment>
                <Header as="h3" content="接下来，请上传数据文件：" />
                <Message
                  info
                  header="提示"
                  content="数据文件应当有5个，分别为订单信息、半成品信息、工序信息、资源信息及工序和资源的匹配关系。"
                />
                <FilePond
                  files={files}
                  onupdatefiles={updateFiles}
                  allowMultiple={true}
                  maxFiles={5}
                  labelIdle='拖放到此处 或 <span class="filepond--label-action">手动选择</span>'
                />
              </React.Fragment>

              <React.Fragment>
                <Header as="h3" content="现在，你可以按你的意愿做些调整。" />
                <Header as="h4" content="检查及修改数据" dividing />
                <Message warning>
                  <Message.Header>注意</Message.Header>
                  <p>
                    总体而言，我们建议你在专用的编辑器中处理数据，这通常会带来更好的效果。
                  </p>
                </Message>
                <TextField
                  select
                  value={fileIndex}
                  variant="outlined"
                  size="small"
                  onChange={(e) =>
                    setFileIndex((e.target.value as unknown) as number)
                  }
                  style={{ width: "50%" }}
                  label="选择文件"
                >
                  {files.map((file, index) => (
                    <MenuItem key={index} value={index}>
                      {file.name}
                    </MenuItem>
                  ))}
                </TextField>
                <MTButton
                  variant="contained"
                  disableElevation
                  onClick={() => iniTable()}
                  size="large"
                  style={{ marginLeft: "0.5em" }}
                >
                  打开
                </MTButton>
              </React.Fragment>

              <React.Fragment>
                <Header as="h1" color="teal" content="完成！" />
                <p>
                  你已经完成了所有的准备工作，现在，你可以点击“提交”按钮，创建你的排产任务。
                </p>
                <Header as="h2" content="之后会发生什么？" />
                <p>排产任务将被提交到服务器进行计算，这一过程可能较长。 </p>
                <p>
                  不过，不用担心，你随时可以在控制台查看现有的排产任务及其运行状态；
                  如果你有了新的计划，也可以对现有任务追加订单或者创建新任务。
                </p>
              </React.Fragment>
            </SwipeableViews>
            <Button.Group widths="2" fluid>
              <Button
                onClick={() =>
                  !step ? history.push("/dashboard") : prevStep()
                }
              >
                {!step ? "返回控制台" : "上一步"}
              </Button>
              <Button.Or />
              <Button
                positive
                onClick={() =>
                  step < steps.length - 1 ? nextStep() : handleSubmit()
                }
              >
                {step < steps.length - 1 ? "下一步" : "提交"}
              </Button>
            </Button.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    </React.Fragment>
  );
}
