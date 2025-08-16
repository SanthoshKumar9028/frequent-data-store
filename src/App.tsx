// import { useState } from "react";
import { useEffect, useState } from "react";
import AddGroupForm from "./components/AddGroupForm";
import { BaseStore } from "./store-manager/base-store";
import { IGroup, ISnippetCategory } from "./models";
import { IndexedDBStore } from "./store-manager/indexeddb-store";
import {
  DB_NAME,
  DB_VERSION,
  GROUP_COLLECTION_NAME,
  SNIPPET_CATEGORY_COLLECTION_NAME,
} from "./configs";
import {
  defaultGlobalValue,
  GlobalProvider,
  IGlobalProviderState,
} from "./contexts/GlobalContext";
import AddCategoryForm from "./components/AddCategoryForm";
import AddSnippetForm from "./components/AddSnippetForm";
import Layout from "./components/Layout";
import { Dialog, DialogContent, Typography } from "@mui/material";
import Categories from "./components/Categories";
import { SnackBarContext } from "./contexts/SnackBarContext";
import { useSnackBar } from "./hooks/useSnackBar";
import { IEditSnippet } from "./components/Snippets";

function App() {
  const [globalState, setGlobalState] =
    useState<IGlobalProviderState>(defaultGlobalValue);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [editSnippet, setEditSnippet] = useState<IEditSnippet | undefined>(
    undefined
  );
  const [dbState, setDBState] = useState<
    "connecting" | "ready" | "error" | "old-version-error"
  >("connecting");
  const { openSnackBar, snackBar } = useSnackBar();

  useEffect(() => {
    const openRequest = window.indexedDB.open(DB_NAME, DB_VERSION);
    openRequest.onerror = () => setDBState("error");
    openRequest.onblocked = () => setDBState("old-version-error");
    openRequest.onsuccess = () => {
      const groupStore: BaseStore<IGroup> = new IndexedDBStore(
        GROUP_COLLECTION_NAME,
        openRequest.result
      );
      const snippetCategoryStore: BaseStore<ISnippetCategory> =
        new IndexedDBStore(
          SNIPPET_CATEGORY_COLLECTION_NAME,
          openRequest.result
        );

      Promise.all([groupStore.findAll(), snippetCategoryStore.findAll()])
        .then((responses) => {
          setDBState("ready");
          setGlobalState({
            idb: openRequest.result,
            groupStore,
            snippetCategoryStore,
            groups: responses[0],
            snippetCategories: responses[1],
            async loadGroups() {
              const groups = await groupStore.findAll();
              setGlobalState((prv) => ({ ...prv, groups }));
              return groups;
            },
            async loadSnippetCategory() {
              const snippetCategories = await snippetCategoryStore.findAll();
              setGlobalState((prv) => ({ ...prv, snippetCategories }));
              return snippetCategories;
            },
          });
        })
        .catch(() => setDBState("error"));
    };
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;

      if (!db.objectStoreNames.contains(GROUP_COLLECTION_NAME)) {
        const groupsStore = db.createObjectStore(GROUP_COLLECTION_NAME, {
          keyPath: "name",
        });
        groupsStore.put({ name: "Common" });
      }
      if (!db.objectStoreNames.contains(SNIPPET_CATEGORY_COLLECTION_NAME)) {
        db.createObjectStore(SNIPPET_CATEGORY_COLLECTION_NAME, {
          keyPath: "name",
        });
      }
    };
  }, []);

  console.log(globalState);

  return (
    <>
      <GlobalProvider value={globalState}>
        <SnackBarContext value={{ openSnackBar }}>
          {/* db - {dbState} */}
          <Layout
            onMenuClick={(type) => {
              setOpenDialog(type);
              setEditSnippet(undefined);
            }}
          >
            <Categories
              onEditSnippetClick={(item) => {
                setEditSnippet(item);
                setOpenDialog("add_snippet");
              }}
            />
          </Layout>

          <Dialog open={openDialog === "add_group"} fullScreen>
            <DialogContent>
              <AddGroupForm onClose={() => setOpenDialog(null)} />
            </DialogContent>
          </Dialog>
          <Dialog open={openDialog === "add_category"} fullScreen>
            <DialogContent>
              <AddCategoryForm onClose={() => setOpenDialog(null)} />
            </DialogContent>
          </Dialog>
          <Dialog open={openDialog === "add_snippet"} fullScreen>
            <DialogContent>
              <AddSnippetForm
                editSnippet={editSnippet}
                onClose={() => setOpenDialog(null)}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={dbState === "old-version-error" || dbState === "error"}
            fullScreen
          >
            <DialogContent>
              <Typography>
                {dbState === "old-version-error" &&
                  "The internal database has been updated, but the old instance is still running in another tab. Please close all the tabs and open the application again."}
                {dbState === "error" &&
                  "Something went wrong while connecting the database. Please try again later"}
              </Typography>
            </DialogContent>
          </Dialog>
        </SnackBarContext>

        {snackBar}
      </GlobalProvider>
    </>
  );
}

export default App;
