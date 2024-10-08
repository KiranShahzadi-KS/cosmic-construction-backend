const express = require("express");
const Router = express.Router();
const userRouter = require("./userRoute");
const contactRouter = require("./contactUsRoute");
const categoriesRoute = require("./categoriesRoute");
const colorRoute = require("./colorRoute");
const attributRoute = require("./attributesRoute");
const reviewRoute = require("./reviewRoute");
const productRoute = require("./productRoute");
const blogCategoriesRoute = require("./blogCategoriesRoute");
const blogRoute = require("./blogRoute");
const jobCategoryRoute = require("./jobCategoriesRoute");
const applicationFormRoute = require("./applicationFormRoute");
const jobRoute = require("./jobPostRoute");
const teamRoute = require("./teamRoute");
const servicesCategoryRoute = require("./servicesCategoriesRoute");
const servicesRoute = require("./serviceRoute");
const orderRoute = require("./orderRoute");
const aboutUsRoute = require("./aboutUsRoute");
const questionAnswer = require("./questionAnswerRoute");
const testimonialRoute = require("./testimonialRoute");

Router.use("/user", userRouter);
Router.use("/contact", contactRouter);
Router.use("/categories", categoriesRoute);
Router.use("/color", colorRoute);
Router.use("/attribute", attributRoute);
Router.use("/review", reviewRoute);
Router.use("/product", productRoute);
Router.use("/blogCat", blogCategoriesRoute);
Router.use("/blog", blogRoute);
Router.use("/job", jobRoute);
Router.use("/jobCategories", jobCategoryRoute);
Router.use("/applicationForm", applicationFormRoute);
Router.use("/team", teamRoute);
Router.use("/serviceCat", servicesCategoryRoute);
Router.use("/services", servicesRoute);
Router.use("/order", orderRoute);
Router.use("/about", aboutUsRoute);
Router.use("/QA", questionAnswer);
Router.use("/Testimonial", testimonialRoute);

module.exports = Router;
