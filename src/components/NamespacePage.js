import React from 'react';
import { Link, Route } from 'react-router-dom';
import { withFormik } from 'formik';
import * as yup from 'yup';

const CreateNamespaceForm = withFormik({
  mapPropsToValues: props => ({
    namespace: ''
  }),

  validationSchema: props => yup.lazy(values => yup.object().shape({
    namespace: yup.string().required('Required'),
  })),

  handleSubmit: (values, { setSubmitting, props: { createNamespace, ...rest } }) => {
    setSubmitting(false);
    createNamespace(values.namespace);
  },
})(props => {
  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    setFieldValue,
    handleSubmit,
    handleReset,
  } = props;

  return (
    <React.Fragment>
      <input style={{width: '400px'}} name="namespace" onBlur={handleBlur} onChange={handleChange} value={values.namespace} placeholder="e.g. feature/ABC-123-cool-thing" type="text" />
      <button type="submit" onClick={handleSubmit}>create</button>
    </React.Fragment>
  );
});

const Pods = ({ pods, namespace, app }) => {
  return pods.items.map(pod => {
    if (namespace.metadata.name == pod.metadata.namespace
      && pod.metadata.labels.app == app
    ) {
      return (<div key={pod.metadata.uid} >
        <strong>{pod.metadata.name} {pod.status.phase}</strong>
        {pod.spec.containers.map(container => {
          const key = pod.metadata.uid + container.name
          return <pre key={key} style={{fontSize: 12}}>kubectl exec -it {pod.metadata.name} -n {namespace.metadata.name} -c {container.name} /bin/bash</pre>
        })}
      </div>);
    }
  });
}

const Ingresses = ({ ingresses, namespace, app }) => {
  return ingresses.items.map(ingress => {
    if (namespace.metadata.name == ingress.metadata.namespace
      && ingress.metadata.name == app
    ) {
      return ingress.spec.rules.map(rule => {
        return rule.http.paths.map(pathConfig => {
          const link = 'http://' + rule.host + ( pathConfig.path || '/' );
          return <div key={link} ><a target="_blank" href={link}>{link}</a></div>
        });
      });
    }
  })
}

const AppActions = ({ app, createApp, deleteApp  }) => {
  return <div>
    <button onClick={e => { createApp(app) }}>create</button>
    <button onClick={e => { deleteApp(app) }}>delete</button>
  </div>
};

const AppList = ({ namespace, ingresses, pods }) => {
  console.log(namespace);

  return (
    <React.Fragment>
      <h3>Apps</h3>
      <ul>
        <li>nginx <Pods app={'nginx'} namespace={namespace} pods={pods} /><Ingresses app={'nginx'} namespace={namespace} ingresses={ingresses} /> <AppActions createApp={namespace.createApp} deleteApp={namespace.deleteApp} app="nginx" /></li>
        <li>mysql <Pods app={'mysql'} namespace={namespace} pods={pods} /><Ingresses app={'mysql'} namespace={namespace} ingresses={ingresses} /> <AppActions createApp={namespace.createApp} deleteApp={namespace.deleteApp} app="mysql" /></li>
        <li>starclub <Pods app={'starclub'} namespace={namespace} pods={pods} /><Ingresses app={'starclub'} namespace={namespace} ingresses={ingresses} /> <AppActions createApp={namespace.createApp} deleteApp={namespace.deleteApp} app="starclub" /></li>
        <li>starplay <Pods app={'starplay'} namespace={namespace} pods={pods} /><Ingresses app={'starplay'} namespace={namespace} ingresses={ingresses} /> <AppActions createApp={namespace.createApp} deleteApp={namespace.deleteApp} app="starplay" /></li>
        <li>property <Pods app={'property'} namespace={namespace} pods={pods} /><Ingresses app={'property'} namespace={namespace} ingresses={ingresses} /> <AppActions createApp={namespace.createApp} deleteApp={namespace.deleteApp} app="property" /></li>
      </ul>
    </React.Fragment>
  );
}

/**
 * Bind action creators to namespace
 * @param {object} namespace
 * @param {object} actionMap
 */
const bindNamespaceActions = (namespace, actionMap) => {
  for(var action in actionMap) {
    namespace[action] = actionMap[action].bind(namespace);
  }
  return namespace;
}

const NamespacePage = ({ getPods, getIngresses, getNamespace, createNamespace, deleteNamespace, createApp, deleteApp, k8s }) => {

  if (!window.hydrate) {
    window.hydrate = 1;
    getIngresses();
    getPods();
    getNamespace();
  }

  return (
    <div>
      <h1>Review</h1>
      {/* <h2>Use this site to find review apps for testing.</h2> */}

      <CreateNamespaceForm createNamespace={createNamespace} />

      <ul>{k8s.namespaces && k8s.namespaces.items.map(item => (
        <li key={item.metadata.uid}>           {item.status.phase}
         <Link to={'/app/' + item.metadata.name}>{item.metadata.annotations.branch}</Link>
          <button onClick={e => { deleteNamespace(item.metadata.name) } }>delete</button>
          <Route path={'/app/' + item.metadata.name} render={props => <AppList pods={k8s.pods} ingresses={k8s.ingresses} namespace={bindNamespaceActions({...item}, { deleteApp, createApp })} />} />
        </li>))}
      </ul>
      {/* <pre>{k8s.namespaces && JSON.stringify(k8s.namespaces.items, null, 2)}</pre> */}
    </div>
  );
};

export default NamespacePage;

{/* <li>Star Play <button>create</button><button>delete</button> <button>update</button></li>
<li><Link to="/prop">Star Sydney</Link> <button>create</button><button>delete</button> <button>update</button></li>
<li><Link to="/prop">Star Goldcoast</Link> <button>create</button><button>delete</button> <button>update</button></li>
<li><Link to="/prop">Treasury Brisbane</Link> <button>create</button><button>delete</button> <button>update</button></li>
<li><Link to="/prop">Darling</Link> <button>create</button><button>delete</button> <button>update</button></li>
<li><Link to="/starpoker">Star Poker</Link> <button>create</button><button>delete</button> <button>update</button></li> */}
