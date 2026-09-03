import ReactDOM from 'react-dom/client';
import { enableDevMockClients } from 'src/configs/devMockBackend';
import api from 'src/services/api';
import App from './App';

// Em desenvolvimento, sem backend, devolve respostas mockadas às chamadas axios
// feitas pela instância `api` (usada pelos sagas) e pelo axios global.
enableDevMockClients(api);

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
