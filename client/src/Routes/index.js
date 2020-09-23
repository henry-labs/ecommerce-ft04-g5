import React from "react";
import { Route } from "react-router-dom";
import CrudComponent from "pages/Crud";
import Product from "pages/Product";
import SignIn from "pages/SignIn";
import SignUp from "pages/SignUp";
import Admin from "pages/Admin";
import Home from "pages/Home";
import Products from "pages/Products";
import About from "pages/About";

const Routes = () => {
  return (
    <>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/products" component={Products} />
      <Route exact path="/products/:id" component={Product}></Route>
      <Route exact path="/sign-in" component={SignIn}></Route>
      <Route exact path="/sign-up" component={SignUp}></Route>
      <Route path="/admin" component={Admin}></Route>
      <Route exact path="/CRUD/" component={CrudComponent}></Route>
      <Route exact path="/about" component = {About}></Route>
    </>
  );
};

export default Routes;
