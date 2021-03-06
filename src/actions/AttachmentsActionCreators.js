/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { dispatch } from '../dispatcher/ActorAppDispatcher';
import { ActionTypes } from '../constants/ActorAppConstants';
import blobToFile from '../utils/blobToFile';

import MessageActionCreators from './MessageActionCreators';
import ComposeActionCreators from '../actions/ComposeActionCreators';

import DialogStore from '../stores/DialogStore';
import AttachmentsStore from '../stores/AttachmentsStore';

function sendAttachment(currentPeer, attachment) {
  if (attachment.isAnimation && attachment.sendAsPicture) {
    MessageActionCreators.sendAnimationMessage(currentPeer, attachment.file);
  } else if (attachment.isImage && attachment.sendAsPicture) {
    MessageActionCreators.sendPhotoMessage(currentPeer, attachment.file);
  } else {
    MessageActionCreators.sendFileMessage(currentPeer, attachment.file);
  }
}

export default {
  show(attachments) {
    const normalizedAttachments = attachments.map((file) => {
      if (file instanceof File == false) {
        file = blobToFile(file);
      }
      var isOverSize = false;

      if(file.size >= 10 * 1024 * 1024) {
        isOverSize = true;
      }
      return {
        isImage: file.type.includes('image'),
        isAnimation: file.type === 'image/gif',
        sendAsPicture: isOverSize ? false : true,
        isOverSize,
        file
      }
    });

    dispatch(ActionTypes.ATTACHMENT_MODAL_SHOW, { attachments: normalizedAttachments });
    ComposeActionCreators.toggleAutoFocus(false);
  },

  hide() {
    dispatch(ActionTypes.ATTACHMENT_MODAL_HIDE);
    ComposeActionCreators.toggleAutoFocus(true);
  },

  selectAttachment(index) {
    dispatch(ActionTypes.ATTACHMENT_SELECT, { index })
  },

  changeAttachment(sendAsPicture) {
    dispatch(ActionTypes.ATTACHMENT_CHANGE, { sendAsPicture });
  },

  deleteAttachment() {
    dispatch(ActionTypes.ATTACHMENT_DELETE);
    if (AttachmentsStore.getAllAttachments().length === 0) {
      this.hide();
    }
  },

  sendAttachment() {
    var currentPeer = DialogStore.getCurrentPeer();
    currentPeer = null;
    var attachment = AttachmentsStore.getAttachment();
    if (!currentPeer) {
      
      currentPeer =  DialogStore.getStorePeer();
      console.log('storelog',currentPeer );
    }

    sendAttachment(currentPeer, attachment);

    dispatch(ActionTypes.ATTACHMENT_SEND);

    if (AttachmentsStore.getAllAttachments().length === 0) {
      this.hide();
    }

    ComposeActionCreators.toggleAutoFocus(true);
  },

  sendAll(attachments) {
    var currentPeer = DialogStore.getCurrentPeer();

    if (!currentPeer) {
      currentPeer =  DialogStore.getStorePeer();
    }

    attachments.forEach((attachment) => {
      sendAttachment(currentPeer, attachment);
    });

    dispatch(ActionTypes.ATTACHMENT_SEND_ALL, { attachments });
    this.hide();
    ComposeActionCreators.toggleAutoFocus(true);
  }
}
