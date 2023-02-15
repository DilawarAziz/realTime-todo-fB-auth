import { useState, useEffect } from "react";
import { useRef } from "react";
import img from "../src/imf.jpg";
import { RiTodoLine } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import App from "./firebase";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { FaUserCircle } from "react-icons/fa";
import { getAuth, signOut } from "firebase/auth";
import {
  getStorage,
  ref as Ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useHistory } from "react-router-dom";
import { getDatabase, ref, onValue, update } from "firebase/database";
import userimg from "./user.png";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Todo({ useruid }) {
  const [inputVal, setinputVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [popup, setpopup] = useState(false);
  const [userinfo, setuserinfo] = useState();
  const [todoIndex, setTodoIndex] = useState();
  const [file, setfile] = useState();
  const inputElement = useRef();
  const db = getDatabase(App);
  const auth = getAuth();
  const storage = getStorage();

  let history = useHistory();
  useEffect(() => {
    const starCountRef = ref(db, "users/" + useruid.uid);
    onValue(starCountRef, (snapshot) => {
      setuserinfo(snapshot.val()?.userdata);
      if (snapshot.val()?.todos) {
        setTodos(snapshot.val()?.todos);
      }
    });
  }, [useruid]);
  let addTodo = () => {
    if (inputVal) {
      update(ref(db, "users/" + useruid.uid + "/"), {
        todos: [ inputVal,...todos],
      })
        .then((r) => {
          console.log("savd succsfully");
        })
        .catch((error) => {
          console.log(error);
        });
      setinputVal("");
    }
  };

  let delTodo = (index) => {
    todos.splice(index, 1);
    setTodos([...todos]);
    update(ref(db, "users/" + useruid.uid + "/"), {
      todos: [...todos],
    })
      .then((r) => {
        console.log("savd succsfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let editTodo = (index) => {
    inputElement.current.focus();
    setinputVal(todos[index]);
    setTodoIndex(index);
  };
  let updateTodo = () => {
    if (inputVal) {
      todos[todoIndex] = inputVal;
      setTodos([...todos]);
      update(ref(db, "users/" + useruid.uid + "/"), {
        todos: [...todos],
      })
        .then((r) => {
          console.log("savd succsfully");
        })
        .catch((error) => {
          console.log(error);
        });
      setinputVal("");
      setTodoIndex(-1);
    }
  };
  let logOut = () => {
    signOut(auth)
      .then(() => {
        history.push("/Login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  let deleteAll = () => {
    let conf = window.confirm("Are you sure want to delete all tasks!");
    // console.log(conf)
    if (conf) {
      setTodos([]);
      update(ref(db, "users/" + useruid.uid + "/"), {
        todos: [],
      })
        .then((r) => {
          console.log("savd succsfully");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  let toggle = () => {
    if (popup) {
      setpopup(false);
    } else {
      setpopup(true);
    }
  };
  let updateProfile = (event) => {
    setfile(event.target.files[0]);

    const metadata = {
      contentType: "image/jpeg",
    };

    const storageRef = Ref(storage, "images/" + file?.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          if (downloadURL) {
            update(ref(db, "users/" + useruid.uid + "/userdata"), {
              imageurl: downloadURL,
            });
          }
        });
      }
    );
  };
  return (
    <div className="main">
      <div className="navbar">
        <div>
          <RiTodoLine color="orange" className="logo" />
          <h2>TODO LIST</h2>
        </div>
        {/* <img className="logo" src={user}/> */}
        <FaUserCircle onClick={toggle} id="userIcon" color="orange" />
      </div>
      {popup && (
        <div className="dialaugBox">
          <img
            src={
              useruid?.photoURL
                ? useruid?.photoURL
                : userinfo?.imageurl
                ? userinfo?.imageurl
                : userimg
            }
            alt="img"
          />
          <input
            onChange={updateProfile}
            hidden
            type="file"
            className="todo-input"
            id="inputCity2"
            accept="image/*"
          />
          <label htmlFor="inputCity2" className="form-label-file">
            <CameraAltIcon color="primary" fontSize="small" />
          </label>
          <hr />
         {useruid?.email&& <p>
            <HiOutlineMail />
            {useruid?.email}
          </p>}
          <p>
            <FaRegUser />
            {userinfo?.name || useruid?.displayName}
          </p>

          <button onClick={logOut}>
            <FiLogOut />
            log Out
          </button>
        </div>
      )}
      <div id="sub-main">
        <img src={img} alt="" />
        <form onSubmit={addTodo} className="input-main">
          <textarea
            className="todo-input"
            ref={inputElement}
            placeholder="Type your task!"
            value={inputVal}
            onChange={(r) => {
              setinputVal(r.target.value);
            }}
            type="text"
            id="input"
          />
          {todoIndex >= 0 ? (
            <Button
              className="add-todo"
              variant="contained"
              onClick={updateTodo}
            >
              Update
            </Button>
          ) : inputVal ? (
            <Button
              className="add-todo"
              variant="contained"
              onClick={addTodo}
              type="submit"
              endIcon={<SendIcon />}
            >
              Add
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={deleteAll}
              className="add-todo"
              startIcon={<DeleteIcon />}
              disabled={!todos?.length ? true : false}
            >
              All
            </Button>
          )}
        </form>
        <ul id="ul">
          {!todos.length && userinfo && (
            <p>
              Click on the add button to add your daily tasks and challenges...!{" "}
            </p>
          )}
          {!todos?.length && !userinfo && (
             <Box >
             <Skeleton />
             <Skeleton animation="wave" />
             <Skeleton animation={false} />
             <Skeleton />
             <Skeleton animation="wave" />
             <Skeleton animation={false} />
             <Skeleton />
             <Skeleton animation="wave" />
             <Skeleton animation={false} />
           </Box>
          )}
          {todos?.map((v, i) => (
            <li key={i}>
              {v}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  alignSelf: "flex-end",
                }}
              >
                <button className="delete-button" onClick={() => editTodo(i)}>
                  <FiEdit className="dltIcon" />
                </button>
                {todoIndex !== i && (
                  <button className="delete-button" onClick={() => delTodo(i)}>
                    <MdOutlineDelete className="dltIcon" color="red" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Todo;
