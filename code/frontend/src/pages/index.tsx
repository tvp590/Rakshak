import { GetStaticProps } from "next";
export default function Home() {
  return (
    <>
      Hello
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      pageTitle: "Home - Rakshak", 
    },
  };
};