
import Header from "./component/Header/Header";
import AppRouter from "./AppRouter";
import {Provider} from 'react-redux';
import store from "./reduxModules/store";
import {ToastProvider} from 'react-toast-notifications';
function App() {
  return (
    <ToastProvider>
    <Provider store={store}>
      <>
      <AppRouter />
      </>
    </Provider>
    </ToastProvider>
  );
}

export default App;
