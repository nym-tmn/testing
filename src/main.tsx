import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './providers/AuthProvider.tsx'
import './main.css';

createRoot(document.getElementById('root')!).render(
	<AuthProvider>
		<App />
	</AuthProvider>
)

