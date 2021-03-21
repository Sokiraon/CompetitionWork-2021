import React from "react"
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { Container, Icon, Menu } from "semantic-ui-react"

export default function Task() {
  const { name } = useParams<{name: string}>();
  const { url } = useRouteMatch<{url: string}>();

  return (
    <React.Fragment>
      <Menu borderless pointing size='large' secondary>
        <Menu.Item as={Link} to='/dashboard'>
          <Icon name='arrow left' />后退
        </Menu.Item>
        <Container>
          <Menu.Item header content={name} />
          <Menu.Item content='排产结果' as={Link} to={`${url}`} />
        </Container>
      </Menu>
    </React.Fragment>
  );
}