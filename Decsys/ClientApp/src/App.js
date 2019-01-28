import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Normalize, Button } from "@smooth-ui/core-sc";

class App extends Component {
  render() {
    return (
      <>
        <Normalize />
        <Router>
          <>
            <Button as={Link} to="/">
              Home
            </Button>
            <Button as={Link} to="/1">
              Page 1
            </Button>
            <Button as={Link} to="/2">
              Page 1
            </Button>

            <Route path="/" exact render={() => <p>Hello, World!</p>} />
            <Route path="/1" render={() => <p>Page 1</p>} />
            <Route path="/2" render={() => <p>Page 2</p>} />
          </>
        </Router>
      </>
    );
  }
}

export default App;
