import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './Comments.module.css';
import NewCommentForm from './NewCommentForm';
import CommentsList from './CommentsList';

const Comments = () => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const params=useParams();
  const {sendRequest,status,data:loadedComments,error}=useHttp(getAllComments);

  useEffect(()=>{
    sendRequest(params.quoteId);
  },[params.quoteId,sendRequest]);

  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  const addedCommentHandler= useCallback(()=>{
    sendRequest(params.quoteId);
  },[sendRequest,params.quoteId]);
  let comments;
  if (status==='pending') {
    comments=(
      <div className='centered'>
        <LoadingSpinner/>
      </div>
    );
  }
  if (status==='completed' && (loadedComments && loadedComments.length>0)) {
    comments=(
      <CommentsList comments={loadedComments} />
    );
  }
  if (status==='completed' && (!loadedComments || loadedComments.length===0)) {
    comments=(
      <p className='centered'>No comments were added yet!</p>
    );
  }
  if (status==='error' && !error) {
    comments=(
      <p className='centered'>{error.message}</p>
    );
  }
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>
      {!isAddingComment && (
        <button className='btn' onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && <NewCommentForm quoteId={params.quoteId} onAddedComment={addedCommentHandler} />}
      {/* <p>Comments...</p> */}
      {comments}
    </section>
  );
};

export default Comments;
