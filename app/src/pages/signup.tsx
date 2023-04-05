import type { NextPage } from "next";
import Head from "next/head";
import { SignupView } from "../views";

const Signup: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Sign Up for Andy's Discord</title>
        <meta
          name="description"
          content="Sign up"
        />
      </Head>
      <SignupView />
    </div>
  );
};

export default Signup;
