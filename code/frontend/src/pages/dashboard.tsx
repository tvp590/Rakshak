import { GetStaticProps } from 'next';
import React from 'react'

const Dashboard = () => {
  return (
    <>
        Hello
    </>
  );
}

export default Dashboard;

export const getStaticProps : GetStaticProps = async () => {
    return {
      props: {
        pageTitle: "Dashboard - Rakshak",
      },
    };
  };
