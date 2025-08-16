import { FC, useContext, useEffect, useState } from "react";
import { GlobalProvider } from "../contexts/GlobalContext";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import Snippets, { IEditSnippet } from "./Snippets";
import {
  KeyboardArrowDown,
  PushPin,
  PushPinOutlined,
} from "@mui/icons-material";
import { Query } from "iodm-query";
import { SNIPPET_CATEGORY_COLLECTION_NAME } from "../configs";
import { ISnippetCategory } from "../models";

const Categories: FC<{ onEditSnippetClick: (item: IEditSnippet) => void }> = ({
  onEditSnippetClick,
}) => {
  const { idb, snippetCategories, loadSnippetCategory } =
    useContext(GlobalProvider);
  const [expandedNames, setExpandedNames] = useState<string[]>([]);

  useEffect(() => {
    setExpandedNames(
      snippetCategories.filter((sc) => sc.expand).map((sc) => sc.name)
    );
  }, [snippetCategories]);

  return (
    <>
      {snippetCategories.length === 0 && (
        <Typography textAlign="center">
          Create category and snippet to get started!
        </Typography>
      )}
      {snippetCategories.map((snippetCategory) => (
        <Accordion
          key={snippetCategory.name}
          expanded={expandedNames.includes(snippetCategory.name)}
          onChange={(_, expanded) => {
            if (expanded) {
              setExpandedNames(expandedNames.concat(snippetCategory.name));
            } else {
              setExpandedNames(
                expandedNames.filter((name) => name !== snippetCategory.name)
              );
            }
          }}
        >
          <AccordionSummary expandIcon={<KeyboardArrowDown />}>
            <Stack direction="row" alignItems="center" gap={2}>
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  if (!idb) return;

                  await new Query<any, ISnippetCategory>(
                    idb,
                    SNIPPET_CATEGORY_COLLECTION_NAME
                  ).findByIdAndUpdate(snippetCategory.name, (p) => ({
                    ...p,
                    expand: p.expand ? false : true,
                  }));

                  loadSnippetCategory();
                }}
              >
                {snippetCategory.expand ? <PushPin /> : <PushPinOutlined />}
              </div>

              <Typography>{snippetCategory.name}</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Snippets
              category={snippetCategory.name}
              snippets={snippetCategory.snippets}
              onEditSnippetClick={onEditSnippetClick}
            />
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default Categories;
