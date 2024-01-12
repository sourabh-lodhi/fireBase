"use client";
import NavBarToggle from "@/components/navbars/navbar";
import SideNav from "@/components/navbars/side-nav";
const CustomComponentLayout = ({ children }) => {
  return (
    <div className="container-fluid bg-light min-vh-100">
      <div className="row min-vh-100">
        <div className="col-2 bg-white border-end border-end-1 d-none d-lg-block ">
          <div>
            <SideNav />
          </div>
        </div>
        <div className="col-lg-10 col-12 bg-light ">
          <div className="mx-2 my-3">
            <div className="d-lg-none mb-3">
              <NavBarToggle />
              <hr />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomComponentLayout;
