'use strict';

exports.__esModule = true;

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _ComposeActionCreators = require('../actions/ComposeActionCreators');

var _ComposeActionCreators2 = _interopRequireDefault(_ComposeActionCreators);

var _ProfileStore = require('../stores/ProfileStore');

var _ProfileStore2 = _interopRequireDefault(_ProfileStore);

var _ActorClient = require('../utils/ActorClient');

var _ActorClient2 = _interopRequireDefault(_ActorClient);

var _makepy = require('makepy');

var _makepy2 = _interopRequireDefault(_makepy);

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  show: function show() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_SHOW);
    _ComposeActionCreators2.default.toggleAutoFocus(false);
  },
  hide: function hide() {
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.DEPARTMENT_HIDE);
    _ComposeActionCreators2.default.toggleAutoFocus(true);
  },
  setPingyinSearchList: function setPingyinSearchList(list) {
    var obj = { '群组': [] };
    // 过滤系统管理员
    list = _Linq2.default.from(list).where('$.peerInfo.title.indexOf("系统管理员") == -1').toArray();
    for (var _iterator = list, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var item = _ref;

      if (!item.peerInfo.title) continue;
      if (item.peerInfo.peer.type === 'group') {
        obj['群组'].push(item);
        continue;
      }
      var letterStore = [];
      for (var _iterator2 = _makepy2.default.make.pingYing(item.peerInfo.title), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var pingyin = _ref2;

        var letter = pingyin.substring(0, 1).toLowerCase();
        if (letterStore.indexOf(letter) !== -1) {
          continue;
        } else {
          letterStore.push(letter);
        }
        var _key = '';
        _key = /[a-z]/.test(letter) ? letter : '#';
        if (!obj[_key]) {
          obj[_key] = [];
        }
        obj[_key].push(item);
      }
    }
    for (var key in obj) {
      obj[key].sort(function (a, b) {
        if (a.peerInfo.title > b.peerInfo.title) {
          return 1;
        } else if (a.peerInfo.title > b.peerInfo.title) {
          return 0;
        } else {
          return -1;
        }
      });
    }
    (0, _ActorAppDispatcher.dispatch)(_ActorAppConstants.ActionTypes.PINGYIN_SEARCH_CHANGED, { obj: obj });
  }
}; /*
    * Copyright (C) 2015 Actor LLC. <https://actor.im>
    */
//# sourceMappingURL=PingyinSearchActionCreators.js.map