import Layout from "@/components/layout";
import Sidebar from "@/components/layout";
import MenuBusyTableComponent from "@/components/menu/busyTable";
import MenuTableComponent from "@/components/menu/busyTable";
import {useRouter} from "next/router";
export default function TableMenuPage() {
  return (
    <Layout>
      <MenuBusyTableComponent />
    </Layout>
  );
}
