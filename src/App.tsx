import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import DashboardPage from './components/DashboardPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardPage />
    </ThemeProvider>
  );
}

export default App;

