'use strict';

exports.__esModule = true;

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

var _Linq = require('Linq');

var _Linq2 = _interopRequireDefault(_Linq);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var PingyinSearchStore = function (_ReduceStore) {
  _inherits(PingyinSearchStore, _ReduceStore);

  function PingyinSearchStore() {
    _classCallCheck(this, PingyinSearchStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  PingyinSearchStore.prototype.getInitialState = function getInitialState() {
    return {};
  };

  PingyinSearchStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.PINGYIN_SEARCH_CHANGED:
        return action.obj;
      default:
        return state;
    }
  };

  return PingyinSearchStore;
}(_utils.ReduceStore);

exports.default = new PingyinSearchStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=PingyinSearchStore.js.map