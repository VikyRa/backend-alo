let onlineUsers = [];

const getOnlineUsers = () => onlineUsers;

const addUser = (user) => {onlineUsers.push(user);};

const getSocketId = (userId) => {
  if (
    onlineUsers.filter(
      ({ userId: userIdArg }) => userIdArg === userId
    )[0]
  )
    return onlineUsers.filter(
      ({ userId: userIdArg }) => userIdArg === userId
    )[0].socketId;
  return "";
};

const removeUser = (socketId) => {
//   console.log(onlineUsers, socketId);
  onlineUsers = onlineUsers.filter(
    (user) => user.socketId.toString() !== socketId.toString()
  );
  // console.log(onlineUsers);
  return onlineUsers;
};

module.exports={removeUser,getSocketId,getOnlineUsers,addUser};