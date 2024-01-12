"use client";
import SideNav from "@/components/navbars/side-nav";
import Charts from "@/components/chart/chart";
import Dashboard from "@/components/dashboard/dashboard";
import Cards from "@/components/cards/cards";
import NavBarToggle from "@/components/navbars/navbar";
import { useEffect } from "react";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

const Home = () => {
  useEffect(() => {
    (async function () {
      const testTableCollection = collection(db, "TestTable");
      const testTableSnap = await getDocs(testTableCollection);
      testTableSnap?.docs?.map((item) => {
        console.log("test", item.data());
      });
    })();
  }, []);

  return (
    <div className="container-fluid bg-light row min-vh-100">
      <div className="mx-2 my-3">
        <Dashboard />
        <Cards />
        <Charts />
      </div>
    </div>
  );
};
export default Home;
