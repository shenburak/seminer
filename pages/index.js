import { useState } from 'react'
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
import { useQuery, useMutation } from '@apollo/react-hooks'
import Field from '../components/field'
import { useRouter } from 'next/router'
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { useLazyQuery } from '@apollo/react-hooks';

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
const KayitOlanlarQuery = gql`
  query KayitOlanlarQuery($sinif: String!) {
    kayitOlanlar(input:{sinif:$sinif}) {
      siniflar{
        kisiSayisi
        sinif
      }
      kisiler{
        isimsoyisim
        sinif
        numara
      }
    }
  }
`
const KisiKaydetMutation = gql`
mutation KisiKaydetMutation($sinif: String!, $isimsoyisim: String!, $numara: String!, $kendisinifi: String!) {
  kisiKaydet(input: { isimsoyisim: $isimsoyisim, sinif: $sinif, numara: $numara, kendisinifi: $kendisinifi }) {
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
  const numara = document.getElementById("numara|" + sinif + "|-input").value
  const isimsoyisim = document.getElementById("isimsoyisim|" + sinif + "|-input").value
  const { data } = await c({
    variables: {
      kendisinifi: _sinif,
      sinif: sinif,
      numara: numara,
      isimsoyisim: isimsoyisim,
    },
  })
}

function Index() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const router = useRouter()
  const { data, loading } = useQuery(ViewerQuery)
  const [kisiKaydet] = useMutation(KisiKaydetMutation)
  const { data: dataSiniflar, loading: loadingSiniflar, refetch: refetchSiniflar } = useQuery(SiniflarQuery, { fetchPolicy: "network-only" })

  const [bilgiler, setBilgiler] = useState({});
  const [getKayitOlan, { loading: kayitOlanlarLoading, data: kayitOlanlarData }] = useLazyQuery(KayitOlanlarQuery, { fetchPolicy: "network-only" });
  const [kayitOlanBilgiler, setKayitOlanBilgiler] = useState({});
  const [siniflarBilgiler, setSiniflarBilgiler] = useState({});

  if (
    loading === false &&
    data.viewer === null &&
    typeof window !== 'undefined'
  ) {
    router.push('/graphql/signin')
  }

  const handleInputChange = (event) => {
    event.persist();
    setBilgiler(inputs => ({ ...inputs, [event.target.name.split("|")[1]]: { ...inputs[event.target.name.split("|")[1]], [event.target.name.split("|")[0]]: event.target.value } }));
  }

  if (data && data.viewer && dataSiniflar && !loadingSiniflar) {
    return (
      <Container maxWidth="md">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Kayıt
          </Typography>
          <Link href="/admin" color="secondary">
            Admin
          </Link>
          <Button id="yenile" hidden={true} onClick={async () => {
            await getKayitOlan({ variables: { sinif: "9/C" } })
            if (kayitOlanlarData && !kayitOlanlarLoading) {
              kayitOlanlarData.kayitOlanlar.siniflar.map(sinif => {
                setSiniflarBilgiler(inputs => {
                  if (!inputs) {
                    return { [sinif.sinif]: { kisiSayisi: sinif.kisiSayisi } }
                  } else {
                    return { ...inputs, [sinif.sinif]: { kisiSayisi: sinif.kisiSayisi } }
                  }
                })
              })
              kayitOlanlarData.kayitOlanlar.kisiler.map(kisi => {
                setKayitOlanBilgiler(inputs => {
                  if (!inputs) {
                    return { [kisi.sinif]: [{ isimsoyisim: kisi.isimsoyisim, numara: kisi.numara }] }
                  } else {
                    if (inputs[kisi.sinif]) {
                      let wr = false
                      inputs[kisi.sinif].map(inputkisi => {
                        if (kisi.numara === inputkisi.numara && kisi.isim === inputkisi.isim) {
                          wr = true
                        }
                      })
                      if (wr == false) {
                        return { ...inputs, [kisi.sinif]: [...inputs[kisi.sinif], { isimsoyisim: kisi.isimsoyisim, numara: kisi.numara }] }
                      } else {
                        return { ...inputs, [kisi.sinif]: [...inputs[kisi.sinif]] }
                      }
                    } else {
                      return { ...inputs, [kisi.sinif]: [{ isimsoyisim: kisi.isimsoyisim, numara: kisi.numara }] }
                    }
                  }
                });
              })
            }
            console.log(kayitOlanlarData, kayitOlanBilgiler)
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
                      {sinif.saat}
                    </Typography>
                    <Typography variant="h5" component="h2">
                      {sinif.sinif}{bull}{sinif.icerik}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {siniflarBilgiler[sinif.sinif] && (<><b>{sinif.kontenjan - siniflarBilgiler[sinif.sinif].kisiSayisi}</b>/{sinif.kontenjan}</>)}
                    </Typography>
                    <Typography variant="body2" component="p">
                      {sinif.aciklama}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Grid container>
                      <Grid item xs={12}>
                        <Field
                          fullWidth
                          onChange={handleInputChange}
                          name={"isimsoyisim|" + sinif.sinif + "|"}
                          type="isimsoyisim"
                          autoComplete="isimsoyisim"
                          required
                          label="İsim Soyisim"
                        />
                        <br />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name={"sinif|" + sinif.sinif + "|"}
                          onChange={handleInputChange}
                          type="sinif"
                          autoComplete="sinif"
                          required
                          fullWidth
                          label="Sınıf"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          name={"numara|" + sinif.sinif + "|"}
                          onChange={handleInputChange}
                          type="numara"
                          autoComplete="numara"
                          required
                          fullWidth
                          label="Numara"
                        />
                        <br />
                      </Grid>
                      <Grid container justify="center">
                        <Grid item >
                          <Button onClick={async () => { kaydet(sinif.sinif, kisiKaydet) }} variant="contained" color="primary" size="small">Kaydet</Button>
                        </Grid>
                      </Grid>
                      <List className={classes.l_root} subheader={<li />}>
                        <li key={`kaydolanlar`} className={classes.l_listSection}>
                          <ul className={classes.l_ul}>
                            <ListSubheader>{`Kayıt Olanlar (${sinif.sinif})`}</ListSubheader>
                            {kayitOlanBilgiler[sinif.sinif] && kayitOlanBilgiler[sinif.sinif].map(kayitOlan => {
                              return (<ListItem key={`item-${kayitOlan.isimsoyisim}${kayitOlan.numara}`}>
                                <ListItemText primary={kayitOlan.isimsoyisim + " " + kayitOlan.numara} />
                              </ListItem>)
                            })}
                          </ul>
                        </li>
                      </List>
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