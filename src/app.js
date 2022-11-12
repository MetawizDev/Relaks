const express = require("express");
const ExceptionHandler = require("./common/handlers/exception.handler");
const RouteNotFoundHandler = require("./common/handlers/route-not-found.handler");
const { knexConnection, initDatabase } = require("./database");
const cors = require("cors");
const path = require("path");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { swaggerSpec } = require("./swagger");
const passport = require("passport");
const session = require("express-session");
// Import Routers
const portionsRouter = require("./routers/portion.router");
const HealthCheckRouter = require("./routers/healthCheck.router");
const AuthRouter = require("./routers/auth.router");
const CategoryRouter = require("./routers/category.router");
const FoodItemRouter = require("./routers/food-item.router");
const orderRouter = require("./routers/order.router");
const ManagerRouter = require("./routers/manager.router");
const TableRouter = require("./routers/table.router");
const PromotionRouter = require("./routers/promotion.router");
const trendingRouter = require("./routers/trending.router");
const userRouter = require("./routers/user.router");

const socketServer = require("./configs/socketConfig");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const httpServer = require("http").Server(app);

socketServer.connect(httpServer);

app.use(session({ secret: process.env.SESSION_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init database
initDatabase(knexConnection);
// Global middlewares - auth

/**
 * @swagger
 * /:
 *   get:
 *     description: Welcome to cafe-app-api v1.!
 *     responses:
 *       200:
 *         description: Returns welcome message.
 */

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to cafe-app-api v1.",
  });
});

// Routers

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/health", HealthCheckRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/portions", portionsRouter);
app.use("/api/v1/food-items", FoodItemRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/managers", ManagerRouter);
app.use("/api/v1/tables", TableRouter);
app.use("/api/v1/promotions", PromotionRouter);
app.use("/api/v1/trending", trendingRouter);
app.use("/api/v1/users", userRouter);

// Route not found handler
app.use(RouteNotFoundHandler);
// app.use(errorHandler);

// Exception handler
app.use(ExceptionHandler);

httpServer.listen(process.env.PORT, () => {
  console.log(`[Server] Listening on port ${process.env.PORT}`);
});

module.exports = httpServer;
