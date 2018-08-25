import React from 'react';
import { Link } from 'react-router-dom';

const NamespacePage = ({ createEnvironment }) => {
  return (
    <div>
      <h1>Review apps</h1>
      {/* <h2>Use this site to find review apps for testing.</h2> */}

      <input placeholder="e.g. starplay" type="text" /><button onClick={createEnvironment}>create</button>
      <ul>
        <li><Link to="/epic-osg-7-sso">epic/OSG-7-sso</Link> <button>delete</button></li>
          <ul>
          <li>The Star Club <button>create</button><button>delete</button> <button>update</button></li>
          <li>Star Play <button>create</button><button>delete</button> <button>update</button></li>
          <li><Link to="/prop">Star Sydney</Link> <button>create</button><button>delete</button> <button>update</button></li>
          <li><Link to="/prop">Star Goldcoast</Link> <button>create</button><button>delete</button> <button>update</button></li>
          <li><Link to="/prop">Treasury Brisbane</Link> <button>create</button><button>delete</button> <button>update</button></li>
          <li><Link to="/prop">Darling</Link> <button>create</button><button>delete</button> <button>update</button></li>
          <li><Link to="/starpoker">Star Poker</Link> <button>create</button><button>delete</button> <button>update</button></li>
          </ul>
      </ul>
    </div>
  );
};

export default NamespacePage;
