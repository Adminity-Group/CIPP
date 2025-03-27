import { Layout as DashboardLayout } from "/src/layouts/index.js";
import { CippTablePage } from "/src/components/CippComponents/CippTablePage.jsx";
import { Book, AddModerator as AddModeratorIcon } from "@mui/icons-material";
import { Button } from "@mui/material";
import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const Page = () => {
  const pageTitle = "App Protection & Configuration Policies";

  const actions = [
    {
      label: "Create template based on policy",
      type: "POST",
      url: "/api/AddIntuneTemplate",
      data: {
        ID: "id",
        URLName: "managedAppPolicies",
      },
      confirmText: "Are you sure you want to create a template based on this policy?",
      icon: <Book />,
      color: "info",
    },
    {
      label: "Delete Policy",
      type: "POST",
      url: "/api/RemovePolicy",
      data: {
        ID: "id",
        URLName: "managedAppPolicies",
      },
      confirmText: "Are you sure you want to delete this policy?",
      icon: <TrashIcon />,
      color: "danger",
    },
  ];

  const offCanvas = {
    extendedInfoFields: [
      "createdDateTime",
      "displayName",
      "lastModifiedDateTime",
      "PolicyTypeName",
    ],
    actions: actions,
  };

  const simpleColumns = ["displayName", "isAssigned", "lastModifiedDateTime"];

  return (
    <CippTablePage
      cardButton={
        <>
          <Button
            component={Link}
            href="/endpoint/MEM/add-policy"
            startIcon={<AddModeratorIcon />}
          >
            Deploy Intune Policy
          </Button>
        </>
      }
      title={pageTitle}
      apiUrl="/api/ListGraphRequest"
      apiData={{
        Endpoint: "deviceAppManagement/managedAppPolicies",
        $orderby: "displayName",
        manualPagination: true,
      }}
      apiDataKey="Results"
      actions={actions}
      offCanvas={offCanvas}
      simpleColumns={simpleColumns}
    />
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
export default Page;
