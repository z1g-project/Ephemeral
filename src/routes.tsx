import { BrowserRouter, Route} from 'react-router-dom'
import Home from './pages/Home.tsx'
import Welcome from './pages/Welcome.tsx'
import './index.css'

export default function Routes() {
    return (
        <BrowserRouter>
        <Route path="/" Component={Home}></Route>
        <Route path="/welcome" Component={Welcome}></Route>
        </BrowserRouter>
    )
}