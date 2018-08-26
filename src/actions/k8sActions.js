import * as types from '../constants/actionTypes';

export function getNamespace() {
  return {
    type: types.GET_NAMESPACE_REQUEST,
  };
}

export function createNamespace(namespace) {
  return {
    type: types.CREATE_NAMESPACE_REQUEST,
    namespace
  };
}

export function deleteNamespace(namespace) {
  return {
    type: types.DELETE_NAMESPACE_REQUEST,
    namespace
  };
}

/**
 * App bind to namespace object before use
 */
export function createApp(app) {
  const namespace = this;
  return {
    type: types.CREATE_APP_REQUEST,
    namespace,
    app
  };
}

/**
 * Ingress
 */
export function getIngresses() {
  return {
    type: types.GET_INGRESSES_REQUEST,
  };
}
