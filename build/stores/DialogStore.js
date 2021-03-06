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

var _ProfileStore = require('../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

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
      case _ActorAppConstants.ActionTypes.FILTER_DIALOGS_GROUP:
        // 过滤删除的群组
        // function isTheSameToPre() {
        //   return linq.from(group).except(preGroup, '$.peerInfo.peer.id').toArray().length === 0;
        // }
        // var group = PingyinSearchStore.getState()['群组'];
        // if (group && state.dialogs.length > 0 && (!preGroup || !isTheSameToPre())) {
        //   time++;
        //   if (time > 1 && preGroup && preGroup.length === 0)  state.dialogs = preDialogs; 
        //   preGroup = group;
        //   preDialogs = JSON.parse(JSON.stringify(state.dialogs));
        //   for (var i = 0; i < state.dialogs.length; i++) {
        //     if (state.dialogs[i].key !== 'privates') {
        //       // 非用户组
        //       var arr = linq.from(state.dialogs[i].shorts).where('$.peer.peer.type === "group"').toArray(); // 群组部分
        //       var arr1 = linq.from(state.dialogs[i].shorts).where('$.peer.peer.type !== "group"').toArray(); // 非群组部分
        //       var activeGroup = linq.from(arr).join(group, 'outer => outer.peer.peer.id', 'inner => inner.peerInfo.peer.id', 'outer => outer').toArray(); // 未删除群组
        //       state.dialogs[i].shorts.splice(0, state.dialogs[i].shorts.length, ...arr1, ...activeGroup); // 重新组合
        //     }
        //   }
        // }
        return _extends({}, state);

      case _ActorAppConstants.ActionTypes.DIALOGS_CHANGED:
        // web端左侧对话框列表排序处理，客户端消息推送处理
        var arr = [];
        if (!action.dialogs[0] || !action.dialogs[0].sort) {
          for (var i = 0; i < action.dialogs.length; i++) {
            var _action$dialogs$i$sho;

            var oldData = _Linq2.default.from(state.dialogs).where('$.key == \'' + action.dialogs[i].key + '\'').toArray()[0];
            var oldArr = [];
            // 数据过滤
            action.dialogs[i]['shorts'] = _Linq2.default.from(action.dialogs[i]['shorts']).where('$.peer.title !== "系统管理员" && $.peer.title !== "账号已删除"').toArray();
            if (oldData) {
              oldArr = oldData.shorts;
            }
            for (var j = 0; j < action.dialogs[i].shorts.length; j++) {
              var dialog = action.dialogs[i].shorts[j];
              var key = dialog.peer.peer.key;
              oldDialog = null;
              var oldDialog = _Linq2.default.from(oldArr).where('$.peer.peer.key == \'' + key + '\'').toArray()[0];
              /* 取合集添加 */
              var index = oldArr.indexOf(oldDialog);
              index >= 0 && oldArr.splice(index, 1);
              /* 取合集添加 */
              if (oldDialog && oldDialog.counter < dialog.counter || !oldDialog) {
                dialog.updateTime = new Date().getTime();
              } else {
                dialog.updateTime = oldDialog.updateTime;
              }
            }
            /* 取合集添加 */
            (_action$dialogs$i$sho = action.dialogs[i].shorts).push.apply(_action$dialogs$i$sho, oldArr);
            /* 取合集添加 */
            action.dialogs[i].shorts.sort(function (a, b) {
              return b.updateTime - a.updateTime;
            });
            action.dialogs[i].sort = true;
            arr = arr.concat(action.dialogs[i].shorts);
          }
        }

        arr = _Linq2.default.from(arr).where('$.counter > 0').toArray().sort(function (a, b) {
          return b.updateTime - a.updateTime;
        });

        console.log('arr', arr);

        if (_ActorClient2.default.isElectron()) {
          _ActorClient2.default.sendToElectron('setDialogStore', { key: 'dialogs_' + _ProfileStore2.default.getProfile().id, value: action.dialogs });
          _ActorClient2.default.sendToElectron('new-messages', { minimizeMsg: arr });
        }
        return _extends({}, state, {
          dialogs: action.dialogs
        });
      case _ActorAppConstants.ActionTypes.DIALOGS_STORE_CHANGED:
        console.log('DIALOGS_STORE_CHANGED');
        return _extends({}, state);
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