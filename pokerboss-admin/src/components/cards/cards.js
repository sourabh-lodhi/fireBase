import React from "react";
import styles from "./styles.module.css";
import { Placeholder } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Cards = () => {
  return (
    <div className="d-flex row flex-wrap">
      <div className="col-lg-2 col-md-11 col-12 bg-white rounded mx-4 my-3">
        <Placeholder as="p" className="mt-2" animation="wave">
          <Placeholder xs={5} size="lg" />
          <Placeholder xs={8} size="lg" />
        </Placeholder>
      </div>
      <div className="col-lg-2 col-md-11 col-12 bg-white rounded mx-4 my-3">
        <Placeholder as="p" className="mt-2" animation="wave">
          <Placeholder xs={5} size="lg" />
          <Placeholder xs={8} size="lg" />
        </Placeholder>
      </div>
      <div className="col-lg-2 col-md-11 col-12 bg-white rounded mx-4 my-3">
        <Placeholder as="p" className="mt-2" animation="wave">
          <Placeholder xs={5} size="lg" />
          <Placeholder xs={8} size="lg" />
        </Placeholder>
      </div>
      <div className="col-lg-2 col-md-11 col-12 bg-white rounded mx-4 my-3">
        <Placeholder as="p" className="mt-2" animation="wave">
          <Placeholder xs={5} size="lg" />
          <Placeholder xs={8} size="lg" />
        </Placeholder>
      </div>
    </div>
    // <div className="d-flex flex-wrap">
    //   <div className={`shadow ${styles.container}`}>
    //     {/* <div className={styles.body}></div> */}
    //     <Placeholder animation="glow">
    //       <Placeholder className="w-50" />
    //     </Placeholder>
    //     <div className={styles.icon}></div>
    //   </div>
    // </div>
  );
};

export default Cards;
