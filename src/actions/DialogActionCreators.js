/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch, dispatchAsync } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import history from '../utils/history';
import ActorClient from '../utils/ActorClient';
import PeerUtils from '../utils/PeerUtils';

import ActionCreators from './ActionCreators';
import MessageActionCreators from './MessageActionCreators';
import TypingActionCreators from './TypingActionCreators';
import DialogInfoActionCreators from './DialogInfoActionCreators';
import OnlineActionCreators from './OnlineActionCreators';
import GroupProfileActionCreators from './GroupProfileActionCreators';
import DraftActionCreators from './DraftActionCreators';

import DialogStore from '../stores/DialogStore';
import MessageStore from '../stores/MessageStore';
import linq from 'linq';

class DialogActionCreators extends ActionCreators {
  deleteDialog(id, keys) {
    // 删除根据id删除dialog
    var dialogs = DialogStore.getDialogs();
    var arr = null;
    for (var i = 0; i < dialogs.length; i++) {
      if (!keys || keys && keys.indexOf(dialogs[i].key) !== -1) {
        arr = linq.from(dialogs[i].shorts).except([{peer: {peer: {id: id}}}], '$.peer.peer.id').toArray();
        dialogs[i].shorts = arr;
      }
    }
    this.setDialogs(dialogs);
  }
  
  setDialogs(dialogs) {
    dispatch(ActionTypes.DIALOGS_CHANGED, { dialogs });
  }

  selectDialogPeerUser(uid) {
    if (uid === ActorClient.getUid()) {
      console.warn('You can\'t chat with yourself');
    } else {
      history.push(`/im/${PeerUtils.peerToString(ActorClient.getUserPeer(uid))}`);
    }
  }

  selectStorePeerUser() {
    
    history.push(`/im/${PeerUtils.peerToString(DialogStore.getStorePeer())}`);
  
  }

  

  selectDialogPeer(peer) {
    const currentPeer = DialogStore.getCurrentPeer();

    if (currentPeer) {
      DraftActionCreators.saveDraft(currentPeer);
      dispatch(ActionTypes.UNBIND_DIALOG_PEER, { peer: currentPeer });
      ActorClient.onConversationClosed(currentPeer);

      this.removeBindings('peer');
    }

    if (!peer) {
      return;
    }

    dispatch(ActionTypes.BIND_DIALOG_PEER, { peer });
    ActorClient.onConversationOpen(peer);
    DraftActionCreators.loadDraft(peer);

    const bindings = [
      ActorClient.bindMessages(peer, MessageActionCreators.setMessages),
      ActorClient.bindTyping(peer, TypingActionCreators.setTyping)
    ];

    switch (peer.type) {
      case PeerTypes.USER:
        bindings.push(
          ActorClient.bindUser(peer.id, DialogInfoActionCreators.setDialogInfo),
          ActorClient.bindUserOnline(peer.id, OnlineActionCreators.setUserOnline)
          // ActorClient.bindUserOnline(221653468, function({ ...args }) {
          //   console.log(args);
          // })
        );
        break;
      case PeerTypes.GROUP:
        bindings.push(
          ActorClient.bindGroup(peer.id, DialogInfoActionCreators.setDialogInfo),
          ActorClient.bindGroupOnline(peer.id, OnlineActionCreators.setGroupOnline)
        );
        GroupProfileActionCreators.getIntegrationToken(peer.id);
        break;
    }
    this.setBindings('peer', bindings);
  }

  onDialogsEnd() {
    ActorClient.onDialogsEnd();
  }

  onChatEnd(peer) {
    ActorClient.onChatEnd(peer);
  }

  leaveGroup(gid) {
    return dispatchAsync(ActorClient.leaveGroup(gid), {
      request: ActionTypes.GROUP_LEAVE,
      success: ActionTypes.GROUP_LEAVE_SUCCESS,
      failure: ActionTypes.GROUP_LEAVE_ERROR
    }, { gid });
  }

  deleteGroup(gid) {
    return dispatchAsync(ActorClient.deleteGroup(gid), {
      request: ActionTypes.GROUP_DELETE,
      success: ActionTypes.GROUP_DELETE_SUCCESS,
      failure: ActionTypes.GROUP_DELETE_ERROR
    }, { gid });
  }

  deleteChat(peer) {
    return dispatchAsync(ActorClient.deleteChat(peer), {
      request: ActionTypes.CHAT_DELETE,
      success: ActionTypes.CHAT_DELETE_SUCCESS,
      failure: ActionTypes.CHAT_DELETE_ERROR
    }, { peer });
  }
  toLeaveGroup(peer) {
    const gid = peer.id;
    this.leaveGroup(gid).then(
      this.deleteChat.bind(this, peer)
    );
  }
  toDeleteChat(peer) {
    const gid = peer.id;
    switch (peer.type) {
      case PeerTypes.USER:
        this.deleteChat(peer);
        break;
      case PeerTypes.GROUP:
        this.deleteGroup(gid);
        break;
      default:
    }
  }

  clearChat(peer) {
    dispatchAsync(ActorClient.clearChat(peer), {
      request: ActionTypes.GROUP_CLEAR,
      success: ActionTypes.GROUP_CLEAR_SUCCESS,
      failure: ActionTypes.GROUP_CLEAR_ERROR
    }, { peer });
  }

  hideChat(peer) {
    dispatchAsync(ActorClient.hideChat(peer), {
      request: ActionTypes.GROUP_HIDE,
      success: ActionTypes.GROUP_HIDE_SUCCESS,
      failure: ActionTypes.GROUP_HIDE_ERROR
    }, { peer });
  }

  blockUser(id) {
    console.debug('Block user %s', id);
  }

  loadMoreMessages(peer) {
    if (MessageStore.isAllRendered()) {
      this.onChatEnd(peer);
    } else {
      dispatch(ActionTypes.MESSAGES_LOAD_MORE);
    }
  }
}

export default new DialogActionCreators();
