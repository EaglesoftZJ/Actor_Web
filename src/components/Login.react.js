/*
 * Copyright (C) 2015-2016 Actor LLC. <https://actor.im>
 */

import React, { Component, PropTypes } from 'react';
import { Container } from 'flux/utils';
import classnames from 'classnames';
import SharedContainer from '../utils/SharedContainer';
import { appName, AuthSteps } from '../constants/ActorAppConstants';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import LoginActionCreators from '../actions/LoginActionCreators';
import DepartmentAcationCreators from '../actions/DepartmentActionCreators';

import LoginStore from '../stores/LoginStore';

import TextField from './common/TextField.react';

class Login extends Component {
  constructor(props) {
    super(props);

    LoginActionCreators.start();

    const SharedActor = SharedContainer.get();
    this.appName = SharedActor.appName ? SharedActor.appName : appName;
  }

  static getStores() {
    return [LoginStore];
  }

  static calculateState() {
    return {
      login: LoginStore.getLogin(),
      code: LoginStore.getCode(),
      name: LoginStore.getName(),
      step: LoginStore.getStep(),
      errors: LoginStore.getErrors(),
      isCodeRequested: LoginStore.isCodeRequested(),
      isCodeSended: LoginStore.isCodeSended(),
      isLoginRequested: LoginStore.isLoginRequested(),
      isSignupStarted: LoginStore.isSignupStarted(),
      isOpened: false
    }
  }

  static contextTypes = {
    intl: PropTypes.object
  };

  componentDidMount() {
    this.handleFocus();
  }

  componentDidUpdate() {
    // this.handleFocus();
  }

  // From change handlers
  onLoginChange = event => {
    event.preventDefault();
    LoginActionCreators.changeLogin(event.target.value);
  };
  onCodeChange = event => {
    event.preventDefault();
    LoginActionCreators.changeCode(event.target.value);
  };
  onNameChange = event => {
    event.preventDefault();
    LoginActionCreators.changeName(event.target.value);
  };

  // Form submit handlers
  onRequestCode = event => {
    event.preventDefault();
    let prmoise = new Promise((resolve, reject) => {
      LoginActionCreators.requestNickName(this.state.login, resolve, reject);
    });
    prmoise.then(() => {
      let prmoise = new Promise((resolve, reject) => {
        LoginActionCreators.sendPassword(this.state.code, resolve, reject);
      });
      prmoise.then(() => {}, () => {
        this.handleFocus();
      });
    }, () => {
      this.handleFocus();
    });
  };
  onSignupRequested = event => {
    event.preventDefault();
    LoginActionCreators.sendSignup(this.state.name);
  };

  handleRestartAuthClick = event => {
    event.preventDefault();
    LoginActionCreators.restartAuth();
  };

  handleSelectName = (name, event) => {
    event.preventDefault();
    LoginActionCreators.changeLogin(name);
  }

  toggleDropdown = event => {
    event.preventDefault();
    const { isOpened } = this.state;
    if (!isOpened) {
      this.setState({'isOpened': true});
      document.addEventListener('click', this.closeDropdown);
    } else {
      this.closeDropdown();
    }
  }
  closeDropdown = () => {
    this.setState({'isOpened': false});
    document.removeEventListener('click', this.closeDropdown);
  }

  handleFocus = () => {
    const { step } = this.state;

    switch (step) {
      case AuthSteps.LOGIN_WAIT:
      case AuthSteps.CODE_WAIT:
        if (!this.state.isCodeRequested) {
          this.refs.login.focus();
        } else if (!this.state.isCodeSended) {
          this.refs.code.focus();
        }
        break;
      case AuthSteps.NAME_WAIT:
        this.refs.name.focus();
        break;
      default:
    }
  };
  renderDropDown() {
    let storeName = localStorage.getItem('storeName') ? localStorage.getItem('storeName').split(',') : [];
    if (storeName && storeName.length === 0) return null;
    return (
      <div>
      <i className="drop-icon material-icons" onClick={this.toggleDropdown}>arrow_drop_down</i>
      <ul className="dropdown__menu">
        {storeName.map((item, index) => {
          return <li className="dropdown__menu__item" onClick={this.handleSelectName.bind(this, item)} key={ index }>{ item }</li>})}
      </ul>
      </div>
    );
  }
  render() {
    const { step, errors, login, code, name, isOpened, isCodeRequested, isCodeSended, isSignupStarted, isLoginRequested } = this.state;
    const { intl } = this.context;

    let requestFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--request', {
      'login-new__forms__form--active': step === AuthSteps.LOGIN_WAIT || step === AuthSteps.CODE_WAIT,
      'login-new__forms__form--done': step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT
    });
    // let checkFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--check', {
    //   'login-new__forms__form--active': step === AuthSteps.CODE_WAIT && isCodeRequested,
    //   'login-new__forms__form--done': step !== AuthSteps.CODE_WAIT && isCodeSended
    // });
    let signupFormClassName = classnames('login-new__forms__form', 'login-new__forms__form--signup', {
      'login-new__forms__form--active': step === AuthSteps.NAME_WAIT
    });

    let dropClassName = classnames('dropdown', {
      'dropdown--opened': isOpened
    });

    const spinner = (
      <div className="spinner">
        <div/><div/><div/><div/><div/><div/>
        <div/><div/><div/><div/><div/><div/>
      </div>
    );

    return (
      <section className="login-new row center-xs middle-xs">

        {/* <div className="login-new__welcome col-xs row center-xs middle-xs">
          <img alt={`${this.appName} messenger`}
               className="logo"
               src="assets/images/logo.png"
               srcSet="assets/images/logo@2x.png 2x"/>

          <article>
            <h1 className="login-new__heading">
              <FormattedHTMLMessage id="login.welcome.header" values={{ appName: this.appName }}/>
            </h1>

            <FormattedHTMLMessage id="login.welcome.text" values={{ appName: this.appName }}/>
          </article>

          <footer>
            <div className="pull-left"><FormattedMessage id="login.welcome.copyright" values={{ appName: this.appName }}/></div>
            <div className="pull-right">
              <a href="//actorapp.ghost.io/desktop-apps">Desktop</a>&nbsp;&nbsp;•&nbsp;&nbsp;
              <a href="//actor.im/ios">iPhone</a>&nbsp;&nbsp;•&nbsp;&nbsp;
              <a href="//actor.im/android">Android</a>
            </div>
          </footer>
        </div> */}

        <div className="login-new__forms col-xs-6 col-md-4 row center-xs middle-xs">
        <img alt={`${this.appName} messenger`}
               className="logo"
               src="assets/images/logo.png"
               srcSet="assets/images/logo@2x.png 2x"/>
          <div>
            <h1 className="login-new__heading"><FormattedMessage id="login.signIn"/></h1>

            <form className={requestFormClassName} onSubmit={this.onRequestCode}>
              {/* <a className="wrong" onClick={this.handleRestartAuthClick}><FormattedMessage id="login.wrong"/></a>*/}
              <div className={ dropClassName }>
              <TextField className="login-new__forms__form__input input__material--wide"
                         disabled={isLoginRequested || step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT}
                         errorText={errors.login}
                         floatingLabel={intl.messages['login.user']}
                         onChange={this.onLoginChange}
                         ref="login"
                         value={login}/>
                { this.renderDropDown() }
              </div>
              <div style={{height: 20 +'px'}}></div>
              <TextField className="login-new__forms__form__input input__material--wide"
                         disabled={isLoginRequested || step !== AuthSteps.LOGIN_WAIT && step !== AuthSteps.CODE_WAIT}
                         errorText={errors.code}
                         floatingLabel={intl.messages['login.authPassword']}
                         onChange={this.onCodeChange}
                         ref="code"
                         type="password"
                         value={code}/>
              <footer className="text-center">
                <button className="button button--rised button--wide"
                        type="submit"
                        disabled={isLoginRequested}>
                  <FormattedMessage id="button.login"/>
                  {isLoginRequested ? spinner : null}
                </button>
              </footer>
            </form>

            <form className={signupFormClassName} onSubmit={this.onSignupRequested}>
              <TextField className="login-new__forms__form__input input__material--wide"
                         disabled={isSignupStarted || step === AuthSteps.COMPLETED}
                         errorText={errors.signup}
                         floatingLabel={intl.messages['login.yourName']}
                         onChange={this.onNameChange}
                         ref="name"
                         type="text"
                         value={name}/>
              <footer className="text-center">
                <button className="button button--rised button--wide"
                        type="submit"
                        disabled={isSignupStarted}>
                  <FormattedMessage id="button.signUp"/>
                  {isSignupStarted ? spinner : null}
                </button>
              </footer>
            </form>
          </div>
        </div>
      </section>
    );
  }
}

export default Container.create(Login, { pure: false, withProps: true });
