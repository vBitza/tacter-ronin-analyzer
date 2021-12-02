import logo from './logo.svg';
import backgroundImage from './assets/axieBackground.jpg'
import './App.css';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import RoninAnalyzer from './pages/RoninAnalyzer'

function App() {
  return (
    <div
      className="container"
      style={{
        backgroundSize: 'cover',
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="gradient"
        style={{
          position: 'relative',
          overflowY: 'auto',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: "linear-gradient(180deg, rgba(21, 23, 25, 0.25), rgba(0, 0, 0, 1))"
        }}
      >
        <p
          style={{
            marginTop: '5%',
            marginBottom: 0,
            color: 'white',
            fontSize: '40px'
          }}
        >
          Tacter Ronin Wallet Analyzer
        </p>
        <p
          style={{
            marginTop: '20px',
            color: 'white',
            fontSize: '20px'
          }}
        >
          Description
        </p>
        <Container
          style={{
            position: 'relative',
            width: '50%',
            marginTop: '100px'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '24px',
              width: '864px',
              minHeight: '240px',
              background: '#212326',
              border: '1px solid #565D64',
              boxSizing: 'border-box',
              boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
            }}
          >
            <RoninAnalyzer/>
          </Box>
        </Container>

      </div>
    </div>
  );
}

export default App;
