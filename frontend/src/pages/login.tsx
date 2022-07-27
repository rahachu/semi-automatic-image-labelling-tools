import LoginPageComponent from "@/components/pages/LoginPage";
import { sessionOptions } from "@/lib/session";
import { User } from "@/types/User";
import { withIronSessionSsr } from "iron-session/next";
import { NextPage } from "next";

const LoginPage: NextPage = () => (
    <LoginPageComponent/>
);
  
export const getServerSideProps = withIronSessionSsr(async function ({
  req,
  res,
}) {
  const user = req.session.user

  if (user) {
    res.setHeader('location', '/')
    res.statusCode = 302
    res.end()
    return {
      props: {
        user,
      },
    }
  }

  return {
    props: { 
        user: { isLoggedIn: false } as User
     },
  }
}, sessionOptions)

export default LoginPage;
