import React from 'react';
import { Link, Route } from 'react-router-dom';
import { withFormik } from 'formik';
import * as apps from '../k8s/apps';
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
          return (
            <React.Fragment key={key}>
            <h5>{container.name} container</h5>
            <div style={{padding: 10, backgroundColor: '#eeeeee'}}>
            <div>shell</div>
            <pre style={{fontSize: 12}}>
              kubectl exec -it {pod.metadata.name} -n {namespace.metadata.name} -c {container.name} /bin/bash
            </pre>
            <div>logs</div>
            <pre style={{fontSize: 12}}>
              kubectl logs -f {pod.metadata.name} -n {namespace.metadata.name} -c {container.name}
            </pre>
            </div>
            </React.Fragment>
          );
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
  return <React.Fragment>
    <button onClick={e => { createApp(app) }}>create</button>
    {' '}
    <button onClick={e => { deleteApp(app) }}>delete</button>
  </React.Fragment>
};

const AppList = ({ namespace, ingresses, pods }) => {
  return (
    <React.Fragment>
      <h3>Apps</h3>
      <strong>{namespace.metadata.name}</strong>
      <div>{namespace.metadata.annotations.branch}</div>
      <ul>
        {Object.keys(apps).map(app => (
          <li key={app}>
            <strong>{app}</strong> <AppActions app={app} createApp={namespace.createApp} deleteApp={namespace.deleteApp} />
            <Ingresses  app={app} namespace={namespace} ingresses={ingresses} />
            <Pods       app={app} namespace={namespace} pods={pods} />
          </li>
        ))}
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
    window.hydrate = setInterval(() => {
      getIngresses();
      getPods();
      getNamespace();
    }, 5000);

    getIngresses();
    getPods();
    getNamespace();
  }

  return (
    <div>
      <h1><Link to="/">Review</Link></h1>
      {/* <h2>Use this site to find review apps for testing.</h2> */}

      <CreateNamespaceForm createNamespace={createNamespace} />

      <ul>{k8s.namespaces && k8s.namespaces.items.map(item => (
        <li key={item.metadata.uid}>
          {item.status.phase} {' '}
          <Link to={'/app/' + item.metadata.name}><strong>{item.metadata.annotations.branch}</strong></Link>{' '}
          <button onClick={e => { deleteNamespace(item.metadata.name) } }>delete</button>
          <Route path={'/app/' + item.metadata.name} render={props => <AppList pods={k8s.pods} ingresses={k8s.ingresses} namespace={bindNamespaceActions({...item}, { deleteApp, createApp })} />} />
        </li>))}
      </ul>
      {/* <pre>{k8s.namespaces && JSON.stringify(k8s.namespaces.items, null, 2)}</pre> */}
    </div>
  );
};

export default NamespacePage;
