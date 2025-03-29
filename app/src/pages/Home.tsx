import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>ホーム画面</h1>
      <Button
        variant='contained'
        onClick={() => {
          navigate('/about');
        }}
      >
        ABOUT
      </Button>
    </div>
  );
};

export default Home;
