import { combineReducers } from 'redux';
import ipfsReducer from './ipfs';
import golReducer from './gol';
import blockReducer from './block';
import bandwidthReducer from './bandwidth';
import accountReducer from './account';
import queryReducer from './query';

const rootReducer = combineReducers({
  ipfs: ipfsReducer,
  gol: golReducer,
  block: blockReducer,
  bandwidth: bandwidthReducer,
  account: accountReducer,
  query: queryReducer,
});

export default rootReducer;
