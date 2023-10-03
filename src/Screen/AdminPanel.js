import React, { useState, useEffect } from "react";
import MuiDrawer from "@mui/material/Drawer";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import AdminInpPanel from "./AdminInpPanel";
import { fbGet } from "../Config/firebaseMethod";

function AdminPanel() {
  const [openDrawer, setOpenDrawer] = useState(false); // State to track whether the drawer is open or closed
  const [quizBtn, setQuizBtn] = useState([]);
  const navigate = useNavigate(); // Get the navigate function
  const btnLogout = () => {
    navigate("/login");
  };

  useEffect(() => {
    fbGet("QuizDetails")
      .then((data) => {
        console.log(data);
        setQuizBtn(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const listItem = [
    {
      icon: (
        <div className="w-100">
          {quizBtn.map((btn, i) => (
            <div key={i}>
              <Button
                fullWidth
                variant="contained"
                color="error"
                className="my-2 px-5"
                onClick={() => handleRouter(btn.route)}
              >
                {btn.QuizOpen}
              </Button>
            </div>
          ))}
        </div>
      ),
      // route: "/quizscreen", // Specify the route to navigate to
    },
  ];

  const handleRouter = (route) => {
    const secretKey = prompt("Enter Secret Key"); // Prompt the user for the secret key

    // Check if the secretKey is provided and not empty
    if (secretKey !== null && secretKey.trim() !== "") {
      // Here, you can add logic to validate the secretKey against your data (fbGet)
      // For now, let's assume that you have a list of validSecretKeys as an array
      const validSecretKeys = quizBtn.map((btn) => btn.SecretKey);

      if (validSecretKeys.includes(secretKey)) {
        navigate('/quizscreen'); // If the secretKey is valid, navigate to the specified route
      } else {
        alert("Invalid Secret Key. Please try again.");
      }
    } else {
      alert("Secret Key is required.");
    }
  };


  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer); // Toggle the state to open/close the drawer
  };

  return (
    <>
      {/* App Bar Left-Side */}
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer} // Open/close the drawer when the menu button is clicked
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <MuiDrawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
          <List>
            {listItem.map((item, index) => {
              const { text, icon, route } = item;
              return (
                <ListItem key={text} onClick={() => handleRouter(route)}>
                  <ListItemButton>
                    <div key={index}>
                      <ListItemIcon>{icon}</ListItemIcon>
                    </div>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Button
            className="mt-auto mb-4 mx-auto"
            variant="contained"
            color="error"
            onClick={btnLogout}
          >
            Logout
          </Button>
        </MuiDrawer>
      </div>
      {/* Admin Panel Right-Side */}
      <AdminInpPanel />
    </>
  );
}

export default AdminPanel;
