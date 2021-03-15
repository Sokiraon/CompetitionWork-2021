import { Link } from "react-router-dom";
import { Button, Container, Grid, Icon } from "semantic-ui-react";

export default function New() {
  return (
    <Container>
      <Button icon labelPosition='left' as={Link} to='/dashboard' compact>
        <Icon name='arrow left' />返回
      </Button>
    </Container>
  )
}