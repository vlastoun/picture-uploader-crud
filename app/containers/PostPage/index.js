import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import PageTemplate from 'components/PageTemplate';
import PostForm from 'components/PostForm';
import {
  EDITOR_CHANGED,
  SEND_POST_REQUESTED,
  NEW_POST_REQUESTED,
  IMAGE_UPLOAD_FINISHED,
  IMAGE_DELETE,
} from './constants';
import { editorState, selectCategories, selectImages, makeSelectUser, loadingState } from './selectors';
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable no-console */

class PostPage extends React.Component {
  constructor(props) {
    super(props);
    this.sendData = this.sendData.bind(this);
    this.state = { editorState: null };
  }
  componentWillMount() {
    this.props.newPostRequest();
  }
  sendData(data) {
    this.props.onSubmit(data, this.props.editorState, this.props.user, this.props.images);
  }
  render() {
    return (
      <PageTemplate heading="Post">
        {this.props.loading
          ? <h2>loading...</h2>
          : <PostForm
            editorChanged={this.props.editorChanged}
            editorState={this.props.editorState}
            sendData={this.sendData}
            categories={this.props.categories}
            imagesUploaded={this.props.imagesUploaded}
            images={this.props.images}
            imageDelete={this.props.imageDelete}
          />
        }
      </PageTemplate>
    );
  }
}

PostPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  newPostRequest: PropTypes.func.isRequired,
  editorChanged: PropTypes.func.isRequired,
  editorState: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  imagesUploaded: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  imageDelete: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    editorChanged: (data) => dispatch({ type: EDITOR_CHANGED, content: data }),
    newPostRequest: () => dispatch({ type: NEW_POST_REQUESTED }),
    onSubmit: (data, currentEditorState, user, images) =>
      dispatch({
        type: SEND_POST_REQUESTED,
        content: { data, currentEditorState, user, images },
      }),
    imagesUploaded: (images) => dispatch({ type: IMAGE_UPLOAD_FINISHED, images }),
    imageDelete: (id) => dispatch({ type: IMAGE_DELETE, id }),
  };
}
const mapStateToProps = createStructuredSelector({
  editorState: editorState(),
  categories: selectCategories(),
  images: selectImages(),
  user: makeSelectUser(),
  loading: loadingState(),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostPage);
