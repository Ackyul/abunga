import Router from "./router/Router";
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Router />
    </>
  );
}

export default App;
