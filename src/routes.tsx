
import { BrowserRouter, Route} from 'react-router-dom'
import Home from './pages/Home.tsx'
import './index.css'

export default function Routes() {
    return (
        <BrowserRouter>
        <Route path="/" element={<Home />}></Route>
        </BrowserRouter>
    )
}