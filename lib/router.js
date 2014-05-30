Router.configure({
  layoutTemplate: 'base',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('posts'); }
});

Router.map(function() {
  this.route('postsList', {path: '/'});

  this.route('postSubmit', {path: '/submit'});
  
  this.route('postPage', {
    path: '/posts/:_id',
    data: function() { return Posts.findOne(this.params._id); }
  });
});

Router.onBeforeAction('loading');
