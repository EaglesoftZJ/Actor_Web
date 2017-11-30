'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _utils = require('flux/utils');

var _ActorAppDispatcher = require('../dispatcher/ActorAppDispatcher');

var _ActorAppDispatcher2 = _interopRequireDefault(_ActorAppDispatcher);

var _ActorAppConstants = require('../constants/ActorAppConstants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Copyright (C) 2015 Actor LLC. <https://actor.im>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

var CropStore = function (_ReduceStore) {
  _inherits(CropStore, _ReduceStore);

  function CropStore() {
    _classCallCheck(this, CropStore);

    return _possibleConstructorReturn(this, _ReduceStore.apply(this, arguments));
  }

  CropStore.prototype.getInitialState = function getInitialState() {
    return {
      source: null,
      callback: null
    };
  };

  CropStore.prototype.reduce = function reduce(state, action) {
    switch (action.type) {
      case _ActorAppConstants.ActionTypes.CROP_MODAL_SHOW:
        return _extends({}, state, {
          source: action.source,
          callback: action.callback
        });
      case _ActorAppConstants.ActionTypes.CROP_MODAL_HIDE:
        return this.getInitialState();

      default:
        return state;
    }
  };

  return CropStore;
}(_utils.ReduceStore);

exports.default = new CropStore(_ActorAppDispatcher2.default);
//# sourceMappingURL=CropAvatarStore.js.map