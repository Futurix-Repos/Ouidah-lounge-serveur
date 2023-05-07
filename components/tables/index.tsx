import React from "react";
import Tables from "./list";
import Orders from "./orders";
import Zones from "./zones";

export default function TableList() {
  return (
    <div className="w-full flex space-x-4 ">
      <div className="w-[100%] ml-2  mt-10">
        <Zones />
        <Tables />
      </div>
    </div>
  );
}
