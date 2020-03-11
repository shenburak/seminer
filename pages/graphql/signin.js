import React from 'react'
import Link from 'next/link'
import { withApollo } from '../../apollo/client'
import gql from 'graphql-tag'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import Field from '../../components/field'
import { getErrorMessage } from '../../lib/form'
import { useRouter } from 'next/router'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MuiLink from '@material-ui/core/Link';

const SignInMutation = gql`
  mutation SignInMutation($email: String!, $password: String!) {
    signIn(input: { email: $email, password: $password }) {
      user {
        id
        email
      }
    }
  }
`
function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <MuiLink color="inherit" href="https://github.com/ethorhub">
                <img src="/ethor.jpg" style={{ width: "25px", height: "25px" }} />
            </MuiLink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


function SignIn() {
    const client = useApolloClient()
    const [signIn] = useMutation(SignInMutation)
    const [errorMsg, setErrorMsg] = React.useState()
    const router = useRouter()

    async function handleSubmit(event) {
        event.preventDefault()

        const emailElement = event.currentTarget.elements.email
        const passwordElement = event.currentTarget.elements.password

        try {
            await client.resetStore()
            const { data } = await signIn({
                variables: {
                    email: emailElement.value,
                    password: passwordElement.value,
                },
            })
            if (data.signIn.user) {
                await router.push('/')
            }
        } catch (error) {
            setErrorMsg(getErrorMessage(error))
        }
    }

    return (
        <Grid container justify="center" alignItems="center">
            <Grid container justify="center" alignItems="center">
                <Grid item>
                    <h1>Giriş yap</h1>
                </Grid>
            </Grid>
            <Grid item>
                <form onSubmit={handleSubmit}>
                    {errorMsg && <p>{errorMsg}</p>}
                    <Field
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        label="Email"
                    />
                    <br />
                    <Field
                        name="password"
                        type="password"
                        autoComplete="password"
                        required
                        label="Şifre"
                    />
                    <br />
                    <Grid container justify="center" alignItems="center">

                        <Button variant="contained" type="submit" color="primary">
                            Giriş yap
                </Button>
                    </Grid>
                </form>
                <Grid item>
                    <Copyright />
                </Grid>
            </Grid>
        </Grid>
    )
}

export default withApollo(SignIn)