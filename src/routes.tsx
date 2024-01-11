import { BrowserRouter, Route, Routes as Router} from 'react-router-dom'
import Home from './pages/Home'
import Welcome from './pages/Welcome'
export default function Routes() {
    return (
         <BrowserRouter>
      <Router>
        <Route path="/" Component={Home} />
        <Route path="/welcome" Component={Welcome} />
      </Router>
      </BrowserRouter>
    )
}