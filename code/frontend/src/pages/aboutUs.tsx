import { GetStaticProps } from "next";
import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container>
      ADD TEXT HERE
    </Container>
  );
};

export default AboutUs;


export const getStaticProps: GetStaticProps = async () => {
    return {
      props: {
        pageTitle: "About Us - Rakshak",
      },
    };
};