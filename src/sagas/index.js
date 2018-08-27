import {
  watchGetNamespace,
  watchCreateNamespace,
  watchDeleteNamespace,
  watchCreateApp,
  watchDeleteApp,
  watchGetIngresses,
  watchGetPods,
} from './k8sSaga';

export default function* rootSaga() {
  yield [
    watchCreateNamespace(),
    watchGetNamespace(),
    watchDeleteNamespace(),
    watchCreateApp(),
    watchGetIngresses(),
    watchDeleteApp(),
    watchGetPods(),
  ];
}
