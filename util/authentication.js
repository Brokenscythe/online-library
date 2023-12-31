function createUserSession(req, user, action) {
  req.session.uid = user.id.toString();
  req.session.save(action);
}

function destroyUserSession(req) {
  req.session.uid = null;
}

module.exports = {
  createUserSession: createUserSession,
  destroyUserSession: destroyUserSession,
};
