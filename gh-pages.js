import { publish } from "gh-pages";

publish(
  "build",
  {
    branch: "gh-pages",
    repo: "https://github.com/MeowningMaster/bomber-front.git",
    user: {
      name: "MeowningMaster",
      email: "meowningmaster@gmail.com",
    },
    dotfiles: true,
  },
  () => {
    console.log("Deploy Complete!");
  }
);
