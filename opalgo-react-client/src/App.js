import './App.css'
import PublicPage from './components/PublicPage'
import 'antd/dist/antd.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/Home'
import Activation from './components/Activation'
import Admin from './components/Admin'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route
            path="/home"
            exact
            render={(props) => <Home {...props}></Home>}
          ></Route>

          <Route
            path="/"
            exact
            render={(props) => <PublicPage {...props}></PublicPage>}
          ></Route>

          <Route
            path="/admin"
            exact
            render={(props) => <Admin {...props}></Admin>}
          ></Route>

          <Route
            path="/users/activate/:token"
            exact
            render={(props) => <Activation {...props}></Activation>}
          ></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
