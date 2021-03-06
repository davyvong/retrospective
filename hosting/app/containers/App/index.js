import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Board from 'containers/Board/Loadable';
import Home from 'containers/Home/Loadable';
import Modal from 'containers/Modal/Loadable';
import NotFound from 'containers/NotFound/Loadable';

import GlobalStyle from '../../globalStyles';

export default function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/board/:boardId" component={Board} />
        <Route component={NotFound} />
      </Switch>
      <Modal />
      <GlobalStyle />
    </div>
  );
}
