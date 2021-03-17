import React, { useRef, useState } from "react";
import { useHistory } from "react-router";
import { Button, Grid, Header, Icon, Input, List, Message, Modal, Segment, Step } from "semantic-ui-react";
import SwipeableViews from 'react-swipeable-views';
import Papa from "papaparse";
import { GridApi } from "ag-grid-community";
import MaterialTable from "material-table";

function getSteps(steps: string[], current: number) {
  return steps.map((value, index) => {
    if (index < current) return <Step key={index} title={value} completed />
    else if (index === current) return <Step key={index} title={value} active />
    else return <Step key={index} title={value} />
  });
}

export default function New() {
  const history = useHistory();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [tableData, setTableData] = useState<object[]>([]);
  const [tableOpen, setTableOpen] = useState(false);
  const steps = ['欢迎', '取个名字', '来点数据', '个性化', '大功告成'];
  const headers: object[] = [];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newFiles = event.target.files, res = [];
    if (newFiles?.length)
      for (let i = 0; i < newFiles.length; i++) {
        res.push(newFiles[i]);
      }
      setFiles([...files, ...res]);
  };

  const iniTable = (index: number) => {
    Papa.parse(files[index], {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      encoding: 'gbk',
      complete: (res) => {
        let data = res.data as object[];
        setTableData(data);
        for (let key in data[0])
          headers.push({ field: key});
      }
    })
  };

  const handleSubmit = () => {
    history.push('/dashboard');
  };

  return (
    <React.Fragment>
      <Modal size='fullscreen' open={tableOpen} onClose={() => setTableOpen(false)}
      style={{ position: 'relative' }}>
        <Modal.Header content='查看及修改数据' />
        <Modal.Content>
          <div style={{ height: '60vh', width: '100%' }}>
            <MaterialTable columns={headers} data={tableData} />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button positive content='保存' />
          <Button negative onClick={() => setTableOpen(false)} content='取消' />
        </Modal.Actions>
      </Modal>
      <Grid textAlign='center' style={{ height: '100vh'}} verticalAlign='middle'>
        <Grid.Column width='9'>
          <Step.Group ordered attached='top'>
            { getSteps(steps, step) }
          </Step.Group>
          <Segment stacked textAlign='left' attached>
            <SwipeableViews index={step} style={{ margin: '0.5em' }}>
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

              <div>
                <Header as='h3' content='接下来，请上传数据文件：' />
                <input type='file' ref={fileInputRef} multiple
                style={{ display: 'none' }} onChange={handleUpload} />
                <Button content='添加文件' onClick={() => fileInputRef.current?.click()} 
                attached='top' color='blue' />
                <Segment attached>{ !files ? <Header as='h4' content='无文件' /> :
                <List divided>
                  {files.map((value, index) => 
                  <List.Item key={index}>
                    <List.Content floated='left'>
                      <Button icon='delete' compact onClick={() => {
                        let newFiles = files;
                        newFiles.splice(index, 1);
                        setFiles(newFiles);
                      }} />
                    </List.Content>
                    <List.Content floated='right'>
                      <Button content='编辑' onClick={() => iniTable(index)} />
                    </List.Content>
                    <List.Content verticalAlign='middle' content={value.name} />
                  </List.Item>
                  )}
                </List>
                }</Segment>
              </div>

              <React.Fragment>
                <Header as='h3' content='现在，你可以添加一些个性化设置。' />
              </React.Fragment>
              
              <React.Fragment>
                <Header as='h1' color='teal' content='完成！' />
                <p>你已经完成了所有的准备工作，现在，你可以点击“提交”按钮，创建你的排产任务。</p>
                <Header as='h2' content='之后会发生什么？' />
                <p>排产任务将被提交到服务器进行计算，这一过程可能较长。 </p>
                <p>不过，不用担心，你随时可以在控制台查看现有的排产任务及其运行状态；
                  如果你有了新的计划，也可以追加订单或者创建新任务。</p>
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