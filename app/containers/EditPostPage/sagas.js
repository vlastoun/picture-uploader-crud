import { take, call, cancel, takeLatest, put } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';
import axios from 'axios';
import { HOST } from 'constants/host';
import {
  FETCH_CATEGORIES_REQUESTED,
  FETCH_POST_REQUESTED,
  FETCH_CATEGORIES_FAILED,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_POST_FAILED,
  FETCH_POST_SUCCESS,
  FETCH_IMAGES_REQUESTED,
  FETCH_IMAGES_SUCCESS,
  FETCH_IMAGES_FAILED,
  OLD_IMAGE_DEL_REQ,
  OLD_IMAGE_DELETE,
  ADD_IMAGE_TO_STASH,
 } from './constants';

const TOKEN = localStorage.getItem('token');

export function* fetchCategories() {
  const URL = `${HOST}api/ctagories?access_token=${TOKEN}`;
  try {
    const response = yield call(axios.get, URL);
    yield put({ type: FETCH_CATEGORIES_SUCCESS, data: response.data });
  } catch (err) {
    yield put({ type: FETCH_CATEGORIES_FAILED, message: err.response.data.error.message });
  }
}

export function* fetchImages(action) {
  const IMAGES_URL = `${HOST}api/posts/${action.postId}/cloudinaries?access_token=${TOKEN}`;
  try {
    const response = yield call(axios.get, IMAGES_URL);
    yield put({ type: FETCH_IMAGES_SUCCESS, data: response.data });
  } catch (err) {
    yield put({ type: FETCH_IMAGES_FAILED, message: err.response.data.error.message });
  }
}


/* eslint-disable no-param-reassign*/

export function* fetchPostRequest(action) {
  yield put({ type: FETCH_CATEGORIES_REQUESTED });
  yield put({ type: FETCH_IMAGES_REQUESTED, postId: action.postId });
  const URL = `${HOST}api/posts/${action.postId}?access_token=${TOKEN}`;
  try {
    const response = yield call(axios.get, URL);
    yield put({ type: FETCH_POST_SUCCESS, data: response.data });
  } catch (err) {
    yield put({ type: FETCH_POST_FAILED, message: err.response.data.error.message });
  }
}
export function* redirect() {
  yield put(push('/admin/posts'));
}

export function* deleteImage(action) {
  // const URL = `${HOST}api/cloudinaries/delete-image?imageId=${action.id}&access_token=${TOKEN}`;
  // yield call(axios.post, URL);
  yield put({ type: ADD_IMAGE_TO_STASH, id: action.id });
  yield put({ type: OLD_IMAGE_DELETE, id: action.id });
}


export function* postWatcher() {
  const watcher = yield takeLatest(FETCH_POST_REQUESTED, fetchPostRequest);
  const catWatcher = yield takeLatest(FETCH_CATEGORIES_REQUESTED, fetchCategories);
  const imaWatcher = yield takeLatest(FETCH_IMAGES_REQUESTED, fetchImages);
  const oldWatcher = yield takeLatest(OLD_IMAGE_DEL_REQ, deleteImage);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(catWatcher);
  yield cancel(imaWatcher);
  yield cancel(oldWatcher);
}

export default [
  postWatcher,
];
