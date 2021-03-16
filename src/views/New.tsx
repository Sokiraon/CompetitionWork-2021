import React, { useState } from "react";
import { useHistory } from "react-router";
import { Button, Container, Form, Grid, Header, Input, Message, Modal, Segment, Step } from "semantic-ui-react";
import SwipeableViews from 'react-swipeable-views';
import { FilePond } from "react-filepond";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import { FilePondFile } from "filepond";
import Papa from "papaparse";
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn";
import { GridApi, GridReadyEvent } from "ag-grid-community";

function getSteps(steps: string[], current: number) {
  return steps.map((value, index) => {
    if (index < current) return <Step key={index} title={value} completed />
    else if (index === current) return <Step key={index} title={value} active />
    else return <Step key={index} title={value} />
  });
}

export default function New() {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [gridApi, setGridApi] = useState<GridApi>();
  const [tableData, setTableData] = useState<object[]>([]);
  const [tableOpen, setTableOpen] = useState(false);
  const steps = ['欢迎', '取个名字', '来点数据', '大功告成'];
  const headers: string[] = [];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  const onGridReady = (e: GridReadyEvent) => setGridApi(e.api);

  const setTable = (file: FilePondFile) => {
    Papa.parse(file.file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      encoding: 'gbk',
      complete: (res) => {
        let data = res.data as object[];
        setTableOpen(true);
        gridApi?.applyTransaction({
          add: data
        });
        setTableData(data);
        for (let key in data) headers.push(key);
      }
    });
  };

  const handleSubmit = () => {
    history.push('/dashboard');
  };

  return (
    <React.Fragment>
      <Modal size='fullscreen' open={tableOpen} onClose={() => setTableOpen(false)}>
        <Modal.Header content='查看及修改数据' />
        <Modal.Content>
          <div style={{ height: '60vh', width: '100%' }} className='ag-grid-material'>
            <AgGridReact rowData={tableData} onGridReady={onGridReady}>
              <AgGridColumn field='order_id' />
            </AgGridReact>
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button positive content='保存' />
          <Button negative onClick={() => setTableOpen(false)} content='取消' />
        </Modal.Actions>
      </Modal>
      <Grid textAlign='center' style={{ height: '100vh'}} verticalAlign='middle'>
        <Grid.Column width='8'>
          <Step.Group ordered attached='top'>
            { getSteps(steps, step) }
          </Step.Group>
          <Segment stacked attached textAlign='left'>
            <SwipeableViews index={step} style={{ marginBottom: '1em' }}>
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
                  <Button content='检查可用性' color='blue' />
                } fluid />
              </React.Fragment>

              <React.Fragment>
                <Header as='h3' content='接下来，请上传数据文件：' />
                <FilePond allowMultiple server='http://localhost:5000/upload' instantUpload={false}
                onprocessfilestart={setTable}
                labelIdle='拖放文件 或 <span class="filepond--label-action">手动选择</span>' />
              </React.Fragment>
              
              <React.Fragment>
                <Header as='h1' color='teal' content='完成！' />
                <p>你已经完成了所有的准备工作，现在，你可以点击“提交”按钮，创建你的排产任务。</p>
                <Header as='h2' content='之后会发生什么？' />
                <p>排产任务将被提交到服务器进行计算，这一过程可能较长。不过不用担心，你随时可以在控制台查看现有的排产任务及其运行状态。 </p>
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