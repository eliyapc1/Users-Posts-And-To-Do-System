import axios from "axios";

const usersAPI = "https://jsonplaceholder.typicode.com/users";
const todosAPI = "https://jsonplaceholder.typicode.com/todos";
const postsAPI = "https://jsonplaceholder.typicode.com/posts";

// Retrieve data from web service and store it in localStorage,
// in order to simulate a server and save data after refresh and closing browser.
const storeUsers = async () => {
  try {
    const { data: users } = await axios.get(usersAPI);
    const fixedUsersArr = [];
    for (const user of users) {
      fixedUsersArr.push({
        id: user.id,
        name: user.name,
        email: user.email,
        address: {
          street: user.address.street,
          city: user.address.city,
          zipcode: user.address.zipcode,
        },
      });
    }
    localStorage.setItem("users", JSON.stringify(fixedUsersArr));
  } catch (error) {
    console.log(error);
  }
};

const storeTodos = async () => {
  try {
    const { data: todos } = await axios.get(`${todosAPI}`);
    const fixedTodosArr = [];
    for (const todo of todos) {
      fixedTodosArr.push({
        id: todo.id,
        userId: todo.userId,
        title: todo.title,
        completed: todo.completed,
      });
    }
    localStorage.setItem("todos", JSON.stringify(fixedTodosArr));
  } catch (error) {
    console.log(error.message);
  }
};

const storePosts = async () => {
  try {
    const { data: posts } = await axios.get(`${postsAPI}`);
    const fixedPostsArr = [];
    for (const post of posts) {
      fixedPostsArr.push({
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
      });
    }
    localStorage.setItem("posts", JSON.stringify(fixedPostsArr));
  } catch (error) {
    console.log(error.message);
  }
};

// Awaits until data will be pulled out of the API and stored in local storage.
const storeData = async () => {
  await storeUsers();
  await storeTodos();
  await storePosts();
};

const getAllUsers = async () => {
  // Prevents fetching data from API on every page refresh.
  if (localStorage.getItem("users") === null) {
    await storeData();
  }
  return JSON.parse(localStorage.getItem("users"));
};

const addUser = (name, email) => {
  const allUsers = JSON.parse(localStorage.users);
  const newUser = {
    id: +allUsers[allUsers.length - 1].id + 1,
    name,
    email,
    address: {
      street: "",
      city: "",
      zipcode: "",
    },
  };

  allUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(allUsers));
};

const updateUsers = (id, updatedUser) => {
  const fixedUsersArr = JSON.parse(localStorage.getItem("users"));
  const userIndex = fixedUsersArr.findIndex((user) => user.id === id);
  fixedUsersArr.splice(userIndex, 1, updatedUser);
  localStorage.setItem("users", JSON.stringify(fixedUsersArr));
  return JSON.parse(localStorage.getItem("users"));
};

const deleteUser = (id) => {
  const fixedUsersArr = JSON.parse(localStorage.getItem("users"));
  const userIndex = fixedUsersArr.findIndex((user) => user.id === id);
  fixedUsersArr.splice(userIndex, 1);
  localStorage.setItem("users", JSON.stringify(fixedUsersArr));
  return JSON.parse(localStorage.getItem("users"));
};

const searchUser = (keyword) => {
  const allUsers = JSON.parse(localStorage.users);
  return allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword.toLowerCase()) ||
      user.email.toLowerCase().includes(keyword.toLowerCase())
  );
};

const getUserTodos = (id) => {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const userTodos = todos.filter((todo) => todo.userId === id);
  return userTodos;
};

const getUserPosts = (id) => {
  const posts = JSON.parse(localStorage.getItem("posts"));
  return posts.filter((post) => post.userId === id);
};

const updateUserTodo = (todoId, updatedTodo) => {
  const todos = JSON.parse(localStorage.getItem("todos"));
  const todoIndex = todos.findIndex((todo) => todo.id === todoId);
  todos.splice(todoIndex, 1, updatedTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// const updateUserPost = (postId, updatedPost) => {
//   const posts = JSON.parse(localStorage.getItem("posts"));
//   const postIndex = posts.findIndex((post) => post.id === postId);
//   posts.splice(postIndex, 1, updatedPost);
//   localStorage.setItem("posts", JSON.stringify(posts));
// };

const addTodo = (id, title) => {
  const allUsersTodos = JSON.parse(localStorage.todos);
  let newTodoId = allUsersTodos[allUsersTodos.length - 1].id + 1;

  const newTodo = {
    id: newTodoId,
    userId: id,
    title,
    completed: false,
  };

  allUsersTodos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(allUsersTodos));
  // window.location.reload();
};

const addPost = (id, title, body) => {
  const allUsersPosts = JSON.parse(localStorage.posts);
  let newPostId = allUsersPosts[allUsersPosts.length - 1].id + 1;

  const newPost = {
    userId: id,
    id: newPostId,
    title,
    body,
  };

  allUsersPosts.push(newPost);
  localStorage.setItem("posts", JSON.stringify(allUsersPosts));
};


const validInput = (inputObj) => {
  let check = true;
  for (const key of Object.keys(inputObj)) {
    if (!inputObj[key] || inputObj[key] === "Required field") {
      inputObj[key] = "Required field";
      check = false;
    }
    if (key === "address") {
      for (const addKey of Object.keys(inputObj[key])) {
        if (addKey === "zipcode") continue;
        if (!inputObj[key][addKey] || inputObj[key][addKey] === "Required field") {
          inputObj[key][addKey] = "Required field";
          check = false;
        }
      }
    }
  }
  return [check, inputObj];
};


export {
  getAllUsers,
  addUser,
  updateUsers,
  deleteUser,
  searchUser,
  getUserTodos,
  getUserPosts,
  updateUserTodo,
  // updateUserPost,
  addTodo,
  addPost,
  validInput
};
