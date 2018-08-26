import { takeLatest } from 'redux-saga';
import { select, put, call } from 'redux-saga/effects';
import callApi from './helpers';
import * as types from '../constants/actionTypes';
import * as k8sActions from '../actions/k8sActions';
import * as apps from '../k8s/apps';
import url from 'url';
import { K8S_URL } from '../config';
import { dns1123 } from '../utils/string';

export function* getNamespace(namespace) {

  const config = {
    method: 'GET',
  };
  const uri = url.resolve(K8S_URL, '/k8s/api/v1/namespaces?labelSelector=app%3Dreview');
  console.log(uri);

  try {
    yield call(callApi, () => fetch(uri, config), [types.GET_NAMESPACE_SUCCESS, types.GET_NAMESPACE_FAILURE]);
  } catch(error) {
    // yield put(appActions.showMessage('Login Error:', error.message, 'danger'));
  }
}

export function* watchGetNamespace() {
  yield* takeLatest(types.GET_NAMESPACE_REQUEST, getNamespace);
}

/**
 * Ingresses
 */
export function* getIngresses() {

  const config = {
    method: 'GET',
  };
  const uri = url.resolve(K8S_URL, '/k8s/apis/extensions/v1beta1/ingresses');
  console.log(uri);

  try {
    yield call(callApi, () => fetch(uri, config), [types.GET_INGRESSES_SUCCESS, types.GET_INGRESSES_FAILURE]);
    const state = yield select();
    console.log(state);
  } catch(error) {
    // yield put(appActions.showMessage('Login Error:', error.message, 'danger'));
  }
}

export function* watchGetIngresses() {
  yield* takeLatest(types.GET_INGRESSES_REQUEST, getIngresses);
}

export function* createNamespace({ namespace }) {

  const body = {
    "kind": "Namespace",
    "apiVersion": "v1",
    "metadata": {
        "name": dns1123(namespace),
        "labels": {
            "app": "review"
        },
        "annotations": {
            "branch": namespace
        }
    }
  };

  const config = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(body),
  };
  const uri = url.resolve(K8S_URL, '/k8s/api/v1/namespaces');
  console.log(uri);

  try {
    yield call(callApi, () => fetch(uri, config), [types.CREATE_NAMESPACE_SUCCESS, types.CREATE_NAMESPACE_FAILURE]);
    yield put(k8sActions.createApp.call(body, 'mysql'));
    yield put(k8sActions.getIngresses());
    yield put(k8sActions.getNamespace());
  } catch(error) {
    // yield put(k8sActions.get('Login Error:', error.message, 'danger'));
  }
}

export function* watchCreateNamespace() {
  yield* takeLatest(types.CREATE_NAMESPACE_REQUEST, createNamespace);
}

/**
 * Delete namespace
 * @param {object} action
 */
export function* deleteNamespace({ namespace }) {

  const config = {
    method: 'DELETE',
  };
  const uri = url.resolve(K8S_URL, `/k8s/api/v1/namespaces/${namespace}`);

  try {
    yield call(callApi, () => fetch(uri, config), [types.DELETE_NAMESPACE_SUCCESS, types.DELETE_NAMESPACE_FAILURE]);
    yield put(k8sActions.getNamespace());
  } catch(error) {
    // yield put(appActions.showMessage('Login Error:', error.message, 'danger'));
  }
}

export function* watchDeleteNamespace() {
  yield* takeLatest(types.DELETE_NAMESPACE_REQUEST, deleteNamespace);
}

/**
 * Create App
 */

export function* createApp({ app, namespace }) {

  console.log(apps[app]);
  const deploymentconfig = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(apps[app].deployment.call(namespace)),
  };
  const deploymenturi = url.resolve(K8S_URL, `/k8s/apis/extensions/v1beta1/namespaces/${namespace.metadata.name}/deployments`);

  const serviceconfig = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(apps[app].service.call(namespace)),
  };
  const serviceuri = url.resolve(K8S_URL, `/k8s/api/v1/namespaces/${namespace.metadata.name}/services`);

  const ingressconfig = {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(apps[app].ingress.call(namespace)),
  };
  const ingressuri = url.resolve(K8S_URL, `/k8s/apis/extensions/v1beta1/namespaces/${namespace.metadata.name}/ingresses`);

  try {
    // deployment
    yield call(callApi, () => fetch(deploymenturi, deploymentconfig), [types.CREATE_DEPLOYMENT_SUCCESS, types.CREATE_DEPLOYMENT_FAILURE]);

    // service
    yield call(callApi, () => fetch(serviceuri, serviceconfig), [types.CREATE_SERVICE_SUCCESS, types.CREATE_SERVICE_FAILURE]);

    // // ingress
    yield call(callApi, () => fetch(ingressuri, ingressconfig), [types.CREATE_INGRESS_SUCCESS, types.CREATE_INGRESS_FAILURE]);

    yield put(k8sActions.getIngresses());
  } catch(error) {
    // yield put(k8sActions.get('Login Error:', error.message, 'danger'));
  }
}

export function* watchCreateApp() {
  yield* takeLatest(types.CREATE_APP_REQUEST, createApp);
}
