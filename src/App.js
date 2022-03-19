import React, {Component, Fragment} from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Movies from './Components/Movies';
import Home from './Components/Home';
import Admin from './Components/Admin';
import Genres from './Components/Genres';
import OneMovie from './Components/OneMovie';
import OneGenre from './Components/OneGenre';
import EditMovie from './Components/EditMovie';
import Login from './Components/Login';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      jwt: "",
    }

    this.handleJWTChange(this.handleJWTChange.bind(this));
  }

  handleJWTChange = (jwt) => {
    this.setState({jwt: jwt});
  }

  logout = () => {
    this.setState({jwt: ""});
  }

  render(){

    let loginLink;
    console.log(this.state.jwt);
    if (this.state.jwt === ""){
      loginLink = <Link to="/login">Login</Link>
    } else {
      loginLink = <Link to="/logout" onClick={this.logout}>Logout</Link>
    }

    return ( 
      <Router>
        <div className='container'>
          <div className='row'>
            <div className='col mt-3'>
              <h1 className='mt-3'>Go Watch a Movie!</h1>
            </div>
            <div className='col mt-3 text-end'>
              {loginLink}
            </div>
            <hr className='mb-3'></hr>
          </div>
          <div className='row'>
            <div className='col-md-2'>
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">                  
                    <Link to="/">Home</Link>
                  </li>
                  <li className="list-group-item">                  
                    <Link to="/movies">Movies</Link>
                  </li>
                  <li className="list-group-item">                  
                    <Link to="/genres">Genres</Link>
                  </li>
                  {this.state.jwt !== "" &&
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/movie/0">Add Movie</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </Fragment>
                  }
                </ul>
                <pre>
                  {JSON.stringify(this.state, null, 3)}
                </pre>
              </nav>
            </div>
            <div className='col-md-10'>
              <Switch>
                <Route path="/movies/:id" component={OneMovie}>                  
                </Route>             
                <Route path="/movies">
                    <Movies />
                </Route>
                <Route exact path="/genres">
                  <Genres />
                </Route> 
                <Route path="/genre/:id" component={OneGenre}>                  
                </Route>

                <Route path="/login" component={(props) => <Login {...props} handleJWTChange={this.handleJWTChange} />} />
                
                <Route path="/admin/movie/:id" component={EditMovie}>                  
                </Route>             
                <Route path="/admin">
                    <Admin />
                </Route>             
                <Route path="/">
                    <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>   
      </Router>
    );
  }
}
