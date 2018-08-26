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
      <input name="namespace" onBlur={handleBlur} onChange={handleChange} value={values.namespace} placeholder="e.g. starplay" type="text" />
      <button type="submit" onClick={handleSubmit}>create</button>
    </React.Fragment>
  );
});

const Ingresses = ({ ingresses, namespace, app }) => {
  return ingresses.items.map(ingress => {
    if (namespace.metadata.name == ingress.metadata.namespace
      && ingress.metadata.name == app
    ) {
      return ingress.spec.rules.map(rule => {
        return <div key={ingress.metadata.uid} ><a target="_blank" href={ 'http://' + rule.host}>{rule.host}</a></div>
      });
    }
  })
}

const AppList = ({ namespace, ingresses, createApp, getApp }) => {
  console.log(namespace);
  // getApp.call(namespace, 'nginx');
  return (
    <ul>
      <li>nginx <Ingresses app={'nginx'} namespace={namespace} ingresses={ingresses} /> <div><button onClick={e => { createApp.call(namespace, 'nginx') }}>create</button><button disabled>delete</button> <button disabled>update</button></div></li>
      <li>mysql <Ingresses app={'mysql'} namespace={namespace} ingresses={ingresses} /> <div><button onClick={e => { createApp.call(namespace, 'mysql') }}>create</button><button disabled>delete</button> <button disabled>update</button></div></li>
      <li>starclub <Ingresses app={'starclub'} namespace={namespace} ingresses={ingresses} /> <div><button onClick={e => { createApp.call(namespace, 'starclub') }}>create</button><button disabled>delete</button> <button disabled>update</button></div></li>
      <li>property <Ingresses app={'property'} namespace={namespace} ingresses={ingresses} /> <div><button onClick={e => { createApp.call(namespace, 'property') }}>create</button><button disabled>delete</button> <button disabled>update</button></div></li>
    </ul>
  );
}

const NamespacePage = ({ getIngresses, getNamespace, createNamespace, deleteNamespace, createApp, k8s }) => {

  if (!window.hydrate) {
    window.hydrate = 1;
    getIngresses();
    getNamespace();
  }

  return (
    <div>
      <h1>Review</h1>
      {/* <h2>Use this site to find review apps for testing.</h2> */}

      <CreateNamespaceForm createNamespace={createNamespace} />

      <ul>{k8s.namespaces && k8s.namespaces.items.map(item => (
        <li key={item.metadata.uid}>           {item.status.phase}
         <Link to={item.metadata.name}>{item.metadata.annotations.branch}</Link>
          <button onClick={e => { deleteNamespace(item.metadata.name) } }>delete</button>
          <Route path={'/' + item.metadata.name} render={props => <AppList ingresses={k8s.ingresses} namespace={item} createApp={createApp} />} />
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
