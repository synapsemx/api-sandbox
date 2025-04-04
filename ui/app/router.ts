import EmberRouter from '@ember/routing/router';
import config from 'ui/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('posts', { path: '/' }, function () {
    this.route('new');
  });
  this.route('categories');
  this.route('tags');
});
