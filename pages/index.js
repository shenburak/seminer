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

const useStyles = makeStyles({
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
});

export default function Index() {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Kayıt
        </Typography>
        <Link href="/admin" color="secondary">
          Tüm kayıtlar
        </Link>
      </Box>

      <Grid container>
        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                09.30-11.30
        </Typography>
              <Typography variant="h5" component="h2">
                9/C{bull}Ali Veli
        </Typography>
              <Typography className={classes.pos} color="textSecondary">
                <b>33</b>/34
          </Typography>
              <Typography variant="body2" component="p">
                Açıklama
          </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" size="small">Yeni Kayıt</Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                09.30-11.30
        </Typography>
              <Typography variant="h5" component="h2">
                9/C{bull}Ali Veli
        </Typography>
              <Typography className={classes.pos} color="textSecondary">
                <b>33</b>/34
          </Typography>
              <Typography variant="body2" component="p">
                Açıklama
          </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" size="small">Yeni Kayıt</Button>
            </CardActions>
          </Card>
        </Grid>


        <Grid item xs={6}>
          <Card className={classes.root}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                09.30-11.30
        </Typography>
              <Typography variant="h5" component="h2">
                9/C{bull}Ali Veli
        </Typography>
              <Typography className={classes.pos} color="textSecondary">
                <b>33</b>/34
          </Typography>
              <Typography variant="body2" component="p">
                Açıklama
          </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" size="small">Yeni Kayıt</Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Box my={4}>
        <ProTip />
        <Copyright />
      </Box>
    </Container>
  );
}