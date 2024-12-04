import { createRoot } from 'react-dom/client'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWindowMinimize, faWindowMaximize, faWindowRestore, faXmark } from '@fortawesome/free-solid-svg-icons';

library.add(faWindowMinimize, faWindowMaximize, faWindowRestore, faXmark);
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
