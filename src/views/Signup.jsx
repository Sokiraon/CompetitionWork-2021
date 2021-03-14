import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button, Form, Grid, Header, Message, Segment } from "semantic-ui-react";

export default function Signup() {
  const { register, handleSubmit, setValue, watch, trigger } = useForm();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [nameErr, setNameErr] = useState(false);
  const [passwdErr, setPasswdErr] = useState(false);
  const [confirmErr, setConfirmErr] = useState(false);

  useEffect(() => {
    register({ name: 'username' });
    register({ name: 'password' });
    register({ name: 'confirm'}, { validate: value => {
      if (value === watch('password')) setConfirmErr(false);
      else setConfirmErr('两次输入的密码不符')
    }});
  });
  
  const onSubmit = () => {
    setLoading(true);
  };

  return (
    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal'>
          注册新账号
        </Header>
        <Form size='big' loading={loading} onSubmit={handleSubmit(onSubmit)} error={error}>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' 
            placeholder='用户名' name='username' required
            onChange={async (e, { name, value }) => {
              setError(false);
              setValue(name, value);
              await trigger('username');
            }} error={nameErr} />
            <Form.Input fluid icon='lock' iconPosition='left' 
            placeholder='密码' type='password' name='password'
            onChange={async (e, { name, value }) => {
              setError(false);
              setValue(name, value);
              await trigger('password');
            }} required error={passwdErr} />
            <Form.Input fluid icon='check square' iconPosition='left' 
            placeholder='确认密码' type='password' name='confirm'
            onChange={async (e, { name, value }) => {
              setError(false);
              setValue(name, value);
              await trigger('confirm');
            }} required error={confirmErr} />
            <Message error content={errorMsg} style={{ textAlign: 'left' }} />
            <Button color='teal' fluid size='large' type='submit'>
              提交
            </Button>
          </Segment>
        </Form>
        <Message>
          已有账号？马上 <Link to='/'>登录</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
}