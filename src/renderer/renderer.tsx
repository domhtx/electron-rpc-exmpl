/**
 * React renderer.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// Import the styles here to process them with webpack
import '@public/style.css';
import { ExampleRPCMethods, createClient } from '@/rpc';
import { ipcRenderer } from 'electron';

ReactDOM.render(
  <div className='app'>
    <h4>Welcome to React, Electron and Typescript</h4>
    <p>Hello</p>
  </div>,
  document.getElementById('app')
);

const cli: ExampleRPCMethods = createClient(ipcRenderer);

(async () => {
  console.log("renderer", await cli.helloWorld());
})();