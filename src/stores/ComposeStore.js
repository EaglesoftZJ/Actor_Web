/*
 * Copyright (C) 2015 Actor LLC. <https://actor.im>
 */

import { ReduceStore } from 'flux/utils';
import Dispatcher from '../dispatcher/ActorAppDispatcher';
import { ActionTypes, PeerTypes } from '../constants/ActorAppConstants';
import ActorClient from '../utils/ActorClient';
import { parseMentionQuery, parseBotCommand } from '../utils/ComposeUtils';
import DialogInfoStore from '../stores/DialogInfoStore';
import ProfileStore from '../stores/ProfileStore';
import linq from 'linq';
class ComposeStore extends ReduceStore {
  getInitialState() {
    return {
      text: '',
      mentions: null,
      commands: null,
      autoFocus: true,
      editMessage: null
    };
  }

  reduce(state, action) {
    switch (action.type) {
      case ActionTypes.COMPOSE_CLEAN:
      case ActionTypes.BIND_DIALOG_PEER:
        return this.getInitialState();

      case ActionTypes.COMPOSE_TYPING:
        const nextState = {
          ...state,
          text: action.text,
          commands: null,
          mentions: null
        };

        if (action.peer.type === PeerTypes.GROUP) {
          const query = parseMentionQuery(action.text, action.caretPosition);
          if (query) {
            nextState.mentions = ActorClient.findMentions(action.peer.id, query.text);
            var members = DialogInfoStore.getState().members;
            // 数据源修改
            var results = linq.from(members).where((data) => {
              if((data.peerInfo.userName.indexOf(query.text) !== -1 || data.peerInfo.title.indexOf(query.text) !== -1) && data.peerInfo.userName !== ProfileStore.getState().profile.nick) {
                return true;
              }
              return false;
            }).select(`{isAdmin: $.isAdmin, isNick: true, mentionMatches: [], mentionText: "@" + $.peerInfo.userName, secondMatches: [], secondText: $.peerInfo.title, peer:$.peerInfo }`).toArray();
            nextState.mentions = results;
          }
        } else {
          const command = parseBotCommand(action.text);
          if (command) {
            nextState.commands = ActorClient.findBotCommands(action.peer.id, command.name || '');
          }
        }

        return nextState;

      case ActionTypes.MESSAGES_EDIT_START:
        return {
          ...state,
          text: action.message.content.text,
          editMessage: action.message
        };

      case ActionTypes.MESSAGES_EDIT_END:
        return {
          ...state,
          text: '',
          editMessage: null
        };

      case ActionTypes.COMPOSE_MENTION_INSERT:
        const query = parseMentionQuery(action.text, action.caretPosition);
        if (!query) {
          console.error('Mention not found', { state, action });
          return state;
        }

        const mentionEnding = query.atStart ? ': ' : ' ';
        const textBeforeMention = action.text.substring(0, action.caretPosition - query.text.length - 1);
        const textAfterMention = action.text.substring(action.caretPosition, action.text.length);

        return {
          ...state,
          text: textBeforeMention + action.mention.mentionText + mentionEnding + textAfterMention,
          mentions: null
        };

      case ActionTypes.COMPOSE_MENTION_CLOSE:
        return {
          ...state,
          mentions: null
        };

      case ActionTypes.DRAFT_LOAD:
        return {
          ...state,
          text: action.draft
        };

      case ActionTypes.EMOJI_INSERT:
        const textBeforeEmoji = action.text.substring(0, action.caretPosition);
        const textAfterEmoji = action.text.substring(action.caretPosition, action.text.length);

        return {
          ...state,
          text: textBeforeEmoji + action.emoji + ' ' + textAfterEmoji
        };

      case ActionTypes.COMPOSE_PASTE:
        return {
          ...state,
          text: action.text
        };

      case ActionTypes.COMPOSE_TOGGLE_AUTO_FOCUS:
        return {
          ...state,
          autoFocus: action.isEnable
        };

      case ActionTypes.SEARCH_TOGGLE_FOCUS:
        return {
          ...state,
          autoFocus: !action.isEnable
        };

      default:
        return state;
    }
  }
}

export default new ComposeStore(Dispatcher);
