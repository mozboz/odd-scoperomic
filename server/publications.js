Meteor.publish('posts', function() {
  return Posts.find();
});

Meteor.publish('objects', function() {
  return Objects.find();
});

Meteor.publish('supportObjects', function() {
  return SupportObjects.find();
});