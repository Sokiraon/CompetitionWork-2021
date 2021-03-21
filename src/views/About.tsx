import { Typography } from "@material-ui/core";
import React from "react";
import { Container, Header, List } from "semantic-ui-react";
import AppMenu from "../components/AppMenu";

export default function About() {
  return (
    <React.Fragment>
      <AppMenu />
      <Container text>
        <Header as='h2' content='关于 App' />
        <Header as='h3' dividing content='开源声明' />
        <Typography variant='body1'>
          本App得以实现，仰赖于以下开源软件，在此予以致谢：
        </Typography>
        <List divided>
          <List.Item>
            <List.Icon name='github' size='large' verticalAlign='middle' />
            <List.Content>
              <List.Header as='a' href='https://pqina.nl/filepond/' content='Filepond' />
              <List.Description content='MIT License' />
            </List.Content>
          </List.Item>
        </List>
      </Container>
    </React.Fragment>
  );
}