import Layout from "@/components/layout";
import TableList from "@/components/tables";
import React from "react";

export default function TablesPage() {
  return (
    <Layout>
      <TableList />
    </Layout>
  );
}

TablesPage.auth = true;
