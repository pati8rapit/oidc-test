import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>About</h1>
      <Button
        variant='contained'
        onClick={() => {
          navigate('/');
        }}
      >
        ホームへ
      </Button>
    </div>
  );
};

export default About;
