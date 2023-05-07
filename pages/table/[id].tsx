import Layout from "@/components/layout";
import Sidebar from "@/components/layout";
import MenuTableComponent from "@/components/menu/busyTable";
import MenuFreeTableComponent from "@/components/menu/freeTable";
import {useRouter} from "next/router";
export default function TableMenuPage() {
  return (
    <Layout>
      <MenuFreeTableComponent />
    </Layout>
  );
}
