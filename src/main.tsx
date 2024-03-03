import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './app/App.tsx';
import { setupStore } from './app/store/store.ts';
import './styles/index.scss';

const store = setupStore();
const element = document.getElementById('root');
if (element) {
	createRoot(element).render(
    <Provider store={store}>
      <App />
      </Provider>
  );
}
