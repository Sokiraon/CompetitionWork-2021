import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button, Form, Grid, Header, Message, Segment } from "semantic-ui-react";
import Auth from "../net/auth";

export default function Login() {
  useEffect(() => {
    register({ name: 'username' }, { required: true });
    register({ name: 'password' }, { required: true });
  });

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, setValue } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    Auth.getInstance().loginWithPassword(data.username, data.password).then(() => {
      history.push('/dashboard');
    }).catch((err) => {
      setLoading(false);
      switch(err.data['code']) {
        case 'USER_NOT_FOUND':
          setErrorMsg(`该用户不存在！`);
          break;
        case 'WRONG_PASSWORD':
          setErrorMsg(`密码错误！`);
          break;
        default: break;  
      }
      setError(true);
    })
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center'>
          登录到系统
        </Header>
        <Form size='big' loading={loading} onSubmit={handleSubmit(onSubmit)} error={error}>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' 
            placeholder='用户名' name='username' required
            onChange={(e, { name, value }) => {
              setError(false);
              setValue(name, value);
            }} />
            <Form.Input fluid icon='lock' iconPosition='left' 
            placeholder='密码' type='password' name='password'
            onChange={(e, { name, value }) => {
              setError(false);
              setValue(name, value);
            }} required />
            <Message error content={errorMsg} style={{ textAlign: 'left' }} />
            <Button color='teal' fluid size='large' type='submit'>
              登录
            </Button>
          </Segment>
        </Form>
        {/*
        <Message>
          没有账号？在这里 <Link to='/signup'>注册</Link>
        </Message>
         */}
      </Grid.Column>
    </Grid>
  );
}