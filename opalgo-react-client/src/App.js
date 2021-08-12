import './App.css'
import PublicPage from './components/public-comp/PublicPage'
import 'antd/dist/antd.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './components/private-comp/Home'
import Activation from './components/public-comp/Activation'
import Admin from './components/private-comp/Admin'
import { UpdateProfile } from './components/private-comp/UpdateProfile'
import GlobalAuthContextProvider from './contexts/GlobalAuthContext'

function App() {
  return (
    <GlobalAuthContextProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route
              path="/home"
              exact
              render={(props) => <Home {...props}></Home>}
            ></Route>

            <Route
              path="/updateprofile"
              exact
              render={(props) => <UpdateProfile {...props} />}
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
    </GlobalAuthContextProvider>
  )
}

export default App
