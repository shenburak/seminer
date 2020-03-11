import { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { withApollo } from '../apollo/client'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import Field from '../components/field'
import { useRouter } from 'next/router'
import { useMutation, useApolloClient } from '@apollo/react-hooks'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const ViewerQuery = gql`
  query ViewerQuery {
    viewer {
      id
      email
    }
  }
`
const SiniflarQuery = gql`
  query SiniflarQuery {
    siniflar {
        saat
        sinif
        icerik
        kontenjan
        aciklama
    }
  }
`

const SinifKaydetMutation = gql`
  mutation SiniftKaydetMutation($sinif: String!, $saat: String!, $icerik: String!, $kontenjan: String!, $aciklama: String!) {
    sinifKaydet(input: { sinif: $sinif, saat: $saat , icerik: $icerik, kontenjan: $kontenjan, aciklama: $aciklama }) {
      success
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

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 100,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    l_root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
    },
    l_listSection: {
        backgroundColor: 'inherit',
    },
    l_ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
}));

async function kaydet(sinif, c) {
    const _sinif = document.getElementById("sinif|" + sinif + "|-input").value
    const saat = document.getElementById("saat|" + sinif + "|-input").value
    const icerik = document.getElementById("icerik|" + sinif + "|-input").value
    const kontenjan = document.getElementById("kontenjan|" + sinif + "|-input").value
    const aciklama = document.getElementById("aciklama|" + sinif + "|-input").value
    const { data } = await c({
        variables: {
            sinif: _sinif,
            saat: saat,
            icerik: icerik,
            kontenjan: kontenjan,
            aciklama: aciklama,
        },
    })
}

function Index() {
    const [sinifKaydet] = useMutation(SinifKaydetMutation)
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const router = useRouter()
    const { data, loading } = useQuery(ViewerQuery)
    const { data: dataSiniflar, loading: loadingSiniflar, refetch: refetchSiniflar } = useQuery(SiniflarQuery, { fetchPolicy: "network-only" })
    const [bilgiler, setBilgiler] = useState({});


    const handleInputChange = (event) => {
        event.persist();
        setBilgiler(inputs => ({ ...inputs, [event.target.name.split("|")[1]]: { ...inputs[event.target.name.split("|")[1]], [event.target.name.split("|")[0]]: event.target.value } }));
    }

    if (
        loading === false &&
        loadingSiniflar === false &&
        data.viewer === null &&
        typeof window !== 'undefined'
    ) {
        router.push('/graphql/signin')
    }

    if (data && data.viewer && dataSiniflar && !loadingSiniflar) {
        return (
            <Container maxWidth="md">
                <Box my={4}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Admin
          </Typography>
                    <Link href="/" color="secondary">
                        Ana sayfa
          </Link>
                    <Button id="yenile" hidden={true} onClick={() => {
                        refetchSiniflar().then(() => {
                            refetchSiniflar().then(() =>
                                dataSiniflar.siniflar.map(sinif => {
                                    setBilgiler(inputs => ({ ...inputs, [sinif.sinif]: sinif }));
                                })
                            );
                        })
                    }} color="secondary">
                        YENİLE
          </Button>
                </Box>

                <Grid container>
                    {dataSiniflar.siniflar.map(sinif => {
                        return (
                            <Grid item xs={6}>
                                <Card className={classes.root}>
                                    <CardContent>
                                        <Typography className={classes.title} color="textSecondary" gutterBottom>
                                            <Field
                                                value={bilgiler[sinif.sinif] ? bilgiler[sinif.sinif].saat : ""}
                                                fullWidth
                                                name={"saat|" + sinif.sinif + "|"}
                                                onChange={handleInputChange}
                                                label="Saat"
                                            />
                                            <br />
                                        </Typography>
                                        <Typography variant="h5" component="h2">
                                            <Field
                                                value={bilgiler[sinif.sinif] ? bilgiler[sinif.sinif].sinif : ""}
                                                fullWidth
                                                name={"sinif|" + sinif.sinif + "|"}
                                                onChange={handleInputChange}
                                                label="Sınıf"
                                            />
                                            <br />
                                            <Field
                                                value={bilgiler[sinif.sinif] ? bilgiler[sinif.sinif].icerik : ""}
                                                fullWidth
                                                name={"icerik|" + sinif.sinif + "|"}
                                                onChange={handleInputChange}
                                                label="İçerik"
                                            />
                                            <br />
                                        </Typography>
                                        <Typography className={classes.pos} color="textSecondary">
                                            <Field
                                                value={bilgiler[sinif.sinif] ? bilgiler[sinif.sinif].kontenjan : ""}
                                                fullWidth
                                                name={"kontenjan|" + sinif.sinif + "|"}
                                                onChange={handleInputChange}
                                                label="Kontenjan"
                                            />
                                            <br />
                                        </Typography>
                                        <Typography variant="body2" component="p">
                                            <Field
                                                value={bilgiler[sinif.sinif] ? bilgiler[sinif.sinif].aciklama : ""}
                                                fullWidth
                                                name={"aciklama|" + sinif.sinif + "|"}
                                                onChange={handleInputChange}
                                                label="Açıklama"
                                            />
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Grid container>
                                            <Grid container justify="center">
                                                <Grid item >
                                                    <Button onClick={async () => { kaydet(sinif.sinif, sinifKaydet) }} variant="contained" color="primary" size="small">Kaydet</Button>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}

                </Grid>

                <Box my={4}>
                    <ProTip />
                    <Copyright />
                </Box>
            </Container >
        );
    }

    return <p>Loading...</p>
}

export default withApollo(Index)