import React, { useState } from "react";
import { Container, Header, Segment, Step } from "semantic-ui-react";

function getSteps(steps: string[], current: number) {
  return steps.map((value, index) => {
    if (index < current) return <Step key={index} title={value} completed />
    else if (index === current) return <Step key={index} title={value} active />
    else return <Step key={index} title={value} />
  });
}

export default function New() {
  const [step, setStep] = useState(0);
  const steps = ['步骤1', '步骤2', '步骤3'];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <React.Fragment>
      <Container style={{ marginTop: '1em' }}>
        <Header as='h3' dividing attached='top'>新建任务</Header>
        <Segment attached>
          <Step.Group ordered attached='top'>
            { getSteps(steps, step) }
          </Step.Group>
        </Segment>
      </Container>
    </React.Fragment>
  )
}