'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var newDailogObj = {},
    oldDailogObj = {};

var DialogStore = function (_ReduceStore) {
  _inherits(DialogStore, _ReduceStore);

  function DialogStore() {
    _classCallCheck(this, DialogStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  DialogStore.prototype.getInitialState = function getInitialState() {
    return {
      peer: null,
      storePeer: null,
      dialogs: []
    };
  };

  DialogStore.prototype.getDialogs = function getDialogs() {
    var _getState = this.getState(),
        dialogs = _getState.dialogs;

    return dialogs;
  };

  DialogStore.prototype.getCurrentPeer = function getCurrentPeer() {
    var _getState2 = this.getState(),
        peer = _getState2.peer;

    return peer;
  };

  DialogStore.prototype.getStorePeer = function getStorePeer() {
    var _getState3 = this.getState(),
        storePeer = _getState3.storePeer;

    return storePeer;
  };

  DialogStore.prototype.isMember = function isMember() {
    var peer = this.getCurrentPeer();
    if (peer && peer.type === _ActorAppConstants.PeerTypes.GROUP) {
      var group = _ActorClient2.default.getGroup(peer.id);
      return group && group.members.length !== 0;
    }

    return true;
  };

  DialogStore.prototype.isFavorite = function isFavorite(id) {
    var favoriteDialogs = (0, _lodash.find)(this.getDialogs(), { key: 'favourites' });
    if (!favoriteDialogs) return false;

    return (0, _lodash.some)(favoriteDialogs.shorts, function (dialog) {
      return dialog.peer.peer.id === id;
    });
  };

  DialogStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.DIALOGS_CHANGED:
        console.log('dialogs', JSON.stringify(action.dialogs));
        var arr = [];
        var dailogs = JSON.parse(JSON.stringify(action.dialogs));
        newDailogObj = {};
        for (var i = 0; i < dailogs.length; i++) {
          for (var j = 0; j < dailogs[i].shorts.length; j++) {
            if (dailogs[i].shorts[j].counter > 0) {
              var key = dailogs[i].shorts[j].peer.peer.key;
              newDailogObj[key] = dailogs[i].shorts[j];
              if (oldDailogObj[key] && oldDailogObj[key].counter < dailogs[i].shorts[j].counter || !oldDailogObj[key]) {
                dailogs[i].shorts[j].updateTime = new Date().getTime();
              } else {
                dailogs[i].shorts[j].updateTime = oldDailogObj[key].updateTime;
              }
              arr.push(dailogs[i].shorts[j]);
            }
          }
        }
        oldDailogObj = newDailogObj;
        arr.sort(function (a, b) {
          return b.updateTime - a.updateTime;
        });
        if (_ActorClient2.default.isElectron()) {
          _ActorClient2.default.sendToElectron('new-messages', { minimizeMsg: arr });
        }
        return _extends({}, state, {
          dialogs: action.dialogs
        });

      case _ActorAppConstants.ActionTypes.BIND_DIALOG_PEER:
        return _extends({}, state, {
          peer: action.peer,
          storePeer: action.peer
        });

      case _ActorAppConstants.ActionTypes.UNBIND_DIALOG_PEER:
        return _extends({}, state, {
          peer: null
        });

      default:
        return state;
    }
  };

  DialogStore.prototype.isAdmin = function isAdmin() {
    if (this.getState().peer.type === _ActorAppConstants.PeerTypes.GROUP) {
      var myID = _ActorClient2.default.getUid();
      var members = _ActorClient2.default.getGroup(this.getState().peer.id).members;
      var adminId = _Linq2.default.from(members).where('$.isAdmin == true').select('$.peerInfo.peer.id').toArray()[0];
      return adminId === myID;
    }
    return true;
  };

  return DialogStore;
}(_utils.ReduceStore);

exports.default = new DialogStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=DialogStore.js.map