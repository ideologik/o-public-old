/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

/** 
  All of the routes for the Material Dashboard 2 PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 PRO React layouts
import Analytics from "layouts/dashboards/analytics";
import AlreadySubscribed from "layouts/static/alreadySubscribed";
import ConfirmEmail from "layouts/static/confirmEmail";
import Thankyou from "layouts/static/thankyou";
import Billing from "layouts/Billing";
import Subscription from "layouts/authentication/sign-up/subscription";
import PasswordReset from "layouts/authentication/sign-in/passwordReset";
import ForgotDone from "layouts/authentication/sign-in/forgotDone";
import Forgot from "layouts/authentication/sign-in/forgot";
import Done from "layouts/authentication/sign-up/done";
import Terms from "layouts/terms";
import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpCover from "layouts/authentication/sign-up/cover";

// Material Dashboard 2 PRO React components
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
// import profilePicture from "assets/images/team-3.jpg";

const routes = [
  {
    type: "collapse",
    name: localStorage.getItem("userName"),
    key: "profile",
    icon: (
      <MDAvatar
        src={localStorage.getItem("userPicture")}
        alt={localStorage.getItem("userName")}
        size="sm"
      />
    ),
    collapse: [
      {
        name: "Logout",
        key: "logout",
        route: "/sign-in",
        component: <SignInIllustration />,
      },
    ],
  },
  { type: "divider", key: "divider-0" },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: "dashboard",
    route: "/dashboard",
    component: <Analytics />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: "credit_card",
    route: "/billing",
    component: <Billing />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Sign Up",
    key: "sign-up",
    icon: "",
    route: "/authentication/sign-up/cover",
    component: <SignUpCover />,
    noCollapse: true,
  },
  {
    type: "route",
    name: "Terms",
    key: "terms",
    icon: "",
    route: "/terms",
    component: <Terms />,
  },
  {
    type: "route",
    name: "Done",
    key: "done",
    icon: "",
    route: "/done",
    component: <Done />,
  },
  {
    type: "route",
    name: "forgot",
    key: "forgot",
    icon: "",
    route: "/forgot",
    component: <Forgot />,
  },
  {
    type: "route",
    name: "forgotDone",
    key: "forgotDone",
    icon: "",
    route: "/forgotDone",
    component: <ForgotDone />,
  },
  {
    type: "route",
    name: "passwordReset",
    key: "passwordReset",
    icon: "",
    route: "/passwordReset",
    component: <PasswordReset />,
  },
  {
    type: "route",
    name: "Subscription",
    key: "subscription",
    icon: "",
    route: "/subscription",
    component: <Subscription />,
  },
  {
    type: "route",
    name: "thankyou",
    key: "thankyou",
    icon: "",
    route: "/thank-you",
    component: <Thankyou />,
  },
  {
    type: "route",
    name: "alreadySubscribed",
    key: "alreadySubscribed",
    icon: "",
    route: "/already-subscribed",
    component: <AlreadySubscribed />,
  },
  {
    type: "route",
    name: "confirmEmail",
    key: "confirmEmail",
    icon: "",
    route: "/confirm-email",
    component: <ConfirmEmail />,
  },
];

export default routes;
