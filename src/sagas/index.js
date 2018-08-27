import {
  watchGetNamespace,
  watchCreateNamespace,
  watchDeleteNamespace,
  watchCreateApp,
  watchDeleteApp,
  watchGetIngresses,
} from './k8sSaga';

export default function* rootSaga() {
  yield [
    watchCreateNamespace(),
    watchGetNamespace(),
    watchDeleteNamespace(),
    watchCreateApp(),
    watchGetIngresses(),
    watchDeleteApp(),
  ];
}
