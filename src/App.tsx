import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './components/GuestFunc/LandingPage/LandingPage';
// import DraftLandingpage from './components/GuestFunc/LandingPage/DraftLandingPage';
import NoPage from './components/GuestFunc/NoPage/NoPage';
import Register from './components/UserFunc/Register/Register';
import Departments from './components/GuestFunc/Infomation/Departments';
import ListUser from './components/UserFunc/ListUser/ListUser';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* user */}
        <Route path="/u/">
          <Route path="register" element={<Register />} />
          <Route path="total" element={<ListUser />} />
        </Route>
        {/* guest */}
        <Route path='/g/'>
          {/* infomation */}
          <Route path="i/">
            <Route path="departments" element={<Departments />} />
          </Route>
        </Route>
        {/* admin */}
        <Route path='/a/'>

        </Route>
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
