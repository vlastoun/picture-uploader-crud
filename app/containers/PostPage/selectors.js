import { createSelector } from 'reselect';

const selectHome = (state) => state.get('post');

const editorState = () => createSelector(
  selectHome,
  (homeState) => homeState.get('textEditorState')
);
const selectCategories = () => createSelector(
  selectHome,
  (homeState) => homeState.get('categories')
);
export {
  selectCategories,
  editorState,
  selectHome,
};
