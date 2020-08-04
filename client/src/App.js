import React from 'react';
import { Router, Switch, Route } from 'react-router-dom'
import { history } from './helpers/history'
import { PrivateRoute } from './PrivateRoute'
import Header from './components/Layouts/Header';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Dashboard/Profile';
import Story from './components/Dashboard/Story';
import AddStory from './components/Dashboard/AddStory';
import StoryPage from './components/Dashboard/StoryPage';
import StoryQA from './components/Dashboard/StoryQA';
import Otp from './components/Login/Otp';
import ForgotPassword from './components/Login/ForgotPassword';
import ResetPassword from './components/Login/ResetPassword';
import ValueTag from './components/Dashboard/ValueTag/ValueTag';
import CharacterTag from './components/Dashboard/CharacterTag/CharacterTag';
import Charity from './components/Dashboard/Charity/Charity';
import Badge from './components/Dashboard/Badge/Badge';
import StoryCategory from './components/Dashboard/Category/StoryCategory';
import TermsOfUse from './components/Dashboard/TermsOfUse';
import TermsOfUseForm from './components/Dashboard/TermsOfUseForm';
import FAQ from './components/Dashboard/FAQ';
import AddfaqSection from './components/Dashboard/AddfaqSection'
class App extends React.Component {
  render() {
    return (
      <>
        <Router history={history}>
          <Switch>
            <React.StrictMode>
              <div id="wrapper">
                <Header />
                <Route exact path="/" component={Login} />
                <Route path="/verify-otp" component={Otp} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <Route exact path="/set-password" component={ResetPassword} />
                {/* <Redirect from="*" to="/" /> */}

                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/profile" component={Profile} />
                <PrivateRoute exact path="/story" component={Story} />
                <PrivateRoute exact path="/add-story" component={AddStory} />
                <PrivateRoute exact path="/story-page/:storyId" component={StoryPage} />
                <PrivateRoute exact path="/story-question-answer/:storyId" component={StoryQA} />
                <PrivateRoute exact path="/value-tags" component={ValueTag} />
                <PrivateRoute exact path="/character-tags" component={CharacterTag} />
                <PrivateRoute exact path="/charity" component={Charity} />
                <PrivateRoute exact path="/badge" component={Badge} />
                <PrivateRoute exact path="/story-category" component={StoryCategory} />
                <PrivateRoute exact path="/terms-of-use" component={TermsOfUse} />
                <PrivateRoute exact path="/terms-of-use-create" component={TermsOfUseForm} />
                <PrivateRoute exact path="/faq" component={FAQ} />
                {/* <PrivateRoute exact path="/AddfaqSection" component={AddfaqSection} /> */}

              </div>
            </React.StrictMode>
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
