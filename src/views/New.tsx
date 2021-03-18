import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, Grid, Header, Input, Message, Segment, Step } from "semantic-ui-react";
import SwipeableViews from 'react-swipeable-views';
import Papa from "papaparse";
import MaterialTable from "material-table";
import { FilePond } from "react-filepond";
import { FilePondFile } from "filepond";
import { MenuItem, TextField, Button as MTButton, Slide, Dialog, AppBar, Toolbar, IconButton, Icon, Typography, makeStyles, Theme, createStyles } from "@material-ui/core";
import localization from '../localization/MaterialTable';
import { TransitionProps } from "@material-ui/core/transitions/transition";

function getSteps(steps: string[], current: number) {
  return steps.map((value, index) => {
    if (index < current) return <Step key={index} title={value} completed />
    else if (index === current) return <Step key={index} title={value} active />
    else return <Step key={index} title={value} />
  });
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: { position: 'relative' },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1
    },
    table: { margin: theme.spacing(2) }
  }),
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function New() {
  const history = useHistory();
  const classes = useStyles();

  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [headers, setHeaders] = useState<object[]>([]);
  const [tableData, setTableData] = useState<object[]>([]);
  const [tableOpen, setTableOpen] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const steps = ['欢迎', '取个名字', '来点数据', '做些修改', '大功告成'];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const iniTable = () => {
    if (files[fileIndex])
      Papa.parse(files[fileIndex], {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        encoding: 'gbk',
        complete: (res) => {
          let new_headers = [];
          let data = res.data as object[];
          setTableData(data);
          for (let key in data[0])
            new_headers.push({ title: key, field: key });
          setHeaders(new_headers);
          setTableOpen(true);
        }
      });
  };

  const updateFiles = (newFiles: FilePondFile[]) =>
    setFiles(newFiles.map(fileItem => fileItem.file));

  const handleSubmit = () => {
    history.push('/dashboard');
  };

  const setTableClose = () => setTableOpen(false);
  const saveTableData = () => {
    setTableClose();
  }

  return (
    <React.Fragment>
      <Dialog fullScreen open={tableOpen} onClose={setTableClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge='start' color='inherit' onClick={setTableClose}>
              <Icon>close</Icon>
            </IconButton>
            <Typography variant='h6' className={classes.title}>查看及修改数据</Typography>
            <MTButton color='inherit' onClick={saveTableData}>
              <Typography variant='body1'>保存</Typography>
            </MTButton>
          </Toolbar>
        </AppBar>
        <div className={classes.table}>
          <MaterialTable columns={headers} data={tableData} title=''
          options={{
            selection: true, exportButton: true, 
            pageSize: 9, pageSizeOptions: [9]
          }} actions={[{
            tooltip: '删除所选行',
            icon: 'delete',
            onClick: (e, data) => {}
          }]} localization={localization} />
        </div>
      </Dialog>

      <Grid textAlign='center' style={{ height: '100vh'}} verticalAlign='middle'>
        <Grid.Column width='9'>
          <Step.Group ordered attached='top'>
            { getSteps(steps, step) }
          </Step.Group>
          <Segment stacked textAlign='left' attached>
            <SwipeableViews index={step} style={{ margin: '1em 0' }}>
              <React.Fragment>
                <Header as='h1' color='teal' content='欢迎！'
                subheader='本向导将帮助你新建一个排产任务' />
                <Header as='h4' content='要继续，请单击“下一步”。' />
              </React.Fragment>

              <React.Fragment>
                <Header as='h3' content='首先，请确定一个任务名：' />
                <Message info>
                  <Message.Header>注意</Message.Header>
                  <p>任务名不需要很复杂，具有足够辨识度即可。</p>
                </Message>
                <Input placeholder='输入任务名' action={
                  <Button content='检查可用性' color='blue' ></Button>
                } fluid />
              </React.Fragment>

              <React.Fragment>
                <Header as='h3' content='接下来，请上传数据文件：' />
                <FilePond files={files} onupdatefiles={updateFiles} allowMultiple={true}
                maxFiles={5} labelIdle='拖放到此处 或 <span class="filepond--label-action">手动选择</span>' />
              </React.Fragment>

              <React.Fragment>
                <Header as='h3' content='现在，你可以按你的意愿做些调整。' />
                <Header as='h4' content='调整数据' dividing />
                <Message warning>
                  <Message.Header>注意</Message.Header>
                  <p>总体而言，我们建议你在专用的编辑器中处理数据，这通常会带来更好的效果。</p>
                </Message>
                <TextField select value={fileIndex} variant='outlined' size='small'
                onChange={(e) => setFileIndex(e.target.value as unknown as number)}
                style={{ width: '50%' }} label='选择文件'>
                  {files.map((file, index) => 
                  <MenuItem key={index} value={index}>{file.name}</MenuItem>
                  )}
                </TextField>
                <MTButton variant='contained' disableElevation 
                onClick={() => iniTable()} size='large' 
                style={{ marginLeft: '0.5em' }}>打开</MTButton>
              </React.Fragment>
              
              <React.Fragment>
                <Header as='h1' color='teal' content='完成！' />
                <p>你已经完成了所有的准备工作，现在，你可以点击“提交”按钮，创建你的排产任务。</p>
                <Header as='h2' content='之后会发生什么？' />
                <p>排产任务将被提交到服务器进行计算，这一过程可能较长。 </p>
                <p>不过，不用担心，你随时可以在控制台查看现有的排产任务及其运行状态；
                  如果你有了新的计划，也可以对现有任务追加订单或者创建新任务。</p>
              </React.Fragment>
            </SwipeableViews>
            <Button.Group widths='2' fluid>
              <Button onClick={() => !step ? 
              history.push('/dashboard') : prevStep()
              }>{ !step ? '返回控制台' : '上一步'}</Button>
              <Button.Or />
              <Button positive onClick={() => step < steps.length-1 ?
              nextStep() : handleSubmit()
              }>{ step < steps.length-1 ? '下一步' : '提交'}</Button>
            </Button.Group>
          </Segment>
        </Grid.Column>
      </Grid>
    </React.Fragment>
  )
}